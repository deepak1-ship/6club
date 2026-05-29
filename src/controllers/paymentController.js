import connection from "../config/connectDB.js";
import moment from "moment";
import { generateClaimRewardID, getBonuses } from "../helpers/games.js";
import {
  REWARD_STATUS_TYPES_MAP,
  REWARD_TYPES_MAP,
} from "../constants/reward_types.js";
import AppError from "../errors/AppError.js";
import Joi from "joi";
import bcrypt from "bcrypt";
import _ from "lodash";

let timeNow = Date.now();

export const PaymentStatusMap = {
  PENDING: 0,
  SUCCESS: 1,
  CANCELLED: 2,
};

const PaymentMethodsMap = {
  UPI_MANUAL: "upi_manual",
  USDT_MANUAL: "usdt_manual",
};

// UPI Manual Payment Integration --------------
const initiateManualUPIPayment = async (req, res) => {
  const query = req.query;

  const [activeUpiId] = await connection.query(
    "SELECT upi_id FROM new_upi_ids WHERE is_active = 1 LIMIT 1"
  );
  const [activeUpiQr] = await connection.query(
    "SELECT filepath FROM new_upi_images WHERE is_active = 1 LIMIT 1"
  );

  return res.render("wallet/manual_payment.ejs", {
    Amount: query?.am,
    UpiId: activeUpiId[0]?.upi_id || "",
    QrCodeImage: activeUpiQr[0]?.filepath || "",
  });
};

const addManualUPIPaymentRequest = async (req, res) => {
  try {
    const data = req.body;
    let auth = req.cookies.auth;
    let money = parseInt(data.money);
    let utr = parseInt(data.utr);
    const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY_INR);

    if (!money || !(money >= minimumMoneyAllowed)) {
      return res.status(400).json({
        message: `Money is Required and it should be ₹${minimumMoneyAllowed} or above!`,
        status: false,
        timeStamp: timeNow,
      });
    }

    if (!utr && utr?.length != 12) {
      return res.status(400).json({
        message: `UPI Ref No. or UTR is Required And it should be 12 digit long`,
        status: false,
        timeStamp: timeNow,
      });
    }

    const [isUsedUtr] = await connection.query(
      "SELECT * FROM recharge WHERE utr = ? ",
      [utr],
    );
    if (isUsedUtr.length) {
      return res.status(400).json({
        message: `UPI Ref No. or UTR is already used`,
        status: false,
        timeStamp: timeNow,
      });
    }

    const user = await getUserDataByAuthToken(auth);

    const pendingRechargeList = await rechargeTable.getRecordByPhoneAndStatus({
      phone: user.phone,
      status: PaymentStatusMap.PENDING,
      type: PaymentMethodsMap.UPI_MANUAL,
    });

    if (pendingRechargeList.length !== 0) {
      const deleteRechargeQueries = pendingRechargeList.map((recharge) => {
        return rechargeTable.cancelById(recharge.id);
      });

      await Promise.all(deleteRechargeQueries);
    }

    const orderId = getRechargeOrderId();

    const newRecharge = {
      orderId: orderId,
      transactionId: "NULL",
      utr: utr,
      phone: user.phone,
      money: money,
      type: PaymentMethodsMap.UPI_MANUAL,
      status: 0,
      today: rechargeTable.getCurrentTimeForTodayField(),
      url: "NULL",
      time: rechargeTable.getCurrentTimeForTimeField(),
    };

    const recharge = await rechargeTable.create(newRecharge);

    return res.status(200).json({
      message:
        "Payment Requested successfully Your Balance will update shortly!",
      recharge: recharge,
      status: true,
      timeStamp: timeNow,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: "Something went wrong!",
      timestamp: timeNow,
    });
  }
};
// --------------------------------------------

// USDT Manual Payment Integration ------------
const initiateManualUSDTPayment = async (req, res) => {
  const query = req.query;

  const [bank_recharge_momo] = await connection.query(
    "SELECT * FROM bank_recharge WHERE type = 'momo'",
  );

  let bank_recharge_momo_data;
  if (bank_recharge_momo.length) {
    bank_recharge_momo_data = bank_recharge_momo[0];
  }

  const momo = {
    bank_name: bank_recharge_momo_data?.name_bank || "",
    username: bank_recharge_momo_data?.name_user || "",
    upi_id: bank_recharge_momo_data?.stk || "",
    usdt_wallet_address: bank_recharge_momo_data?.qr_code_image || "",
  };

  return res.render("wallet/usdt_manual_payment.ejs", {
    Amount: query?.am,
    UsdtWalletAddress: momo.usdt_wallet_address,
    QrCodeImage: null,
  });
};

const addManualUSDTPaymentRequest = async (req, res) => {
  try {
    const data = req.body;
    let auth = req.cookies.auth;
    let money_usdt = parseInt(data.money);
    
    // Get dynamic USDT rate
    let usdtRate = 92; // Default rate
    try {
      const [rateRow] = await connection.query("SELECT usdt_rate FROM admin_ac LIMIT 1");
      if (rateRow[0]?.usdt_rate && !isNaN(rateRow[0].usdt_rate)) {
        usdtRate = parseFloat(rateRow[0].usdt_rate);
        console.log('USDT rate from database:', usdtRate);
      } else {
        console.log('USDT rate not found in database, using default:', usdtRate);
      }
    } catch (error) {
      console.log('Error fetching USDT rate, using default:', usdtRate, error);
    }
    
    let money = money_usdt * usdtRate;
    
    // Debug logging
    console.log('USDT Payment Debug:');
    console.log('- Original USDT amount:', money_usdt);
    console.log('- USDT Rate used:', usdtRate);
    console.log('- Converted INR amount:', money);
    console.log('- Storing in database:', money);
    let utr = data.utr; // Keep as STRING for transaction hashes
    const minimumMoneyAllowed = parseInt(process.env.MINIMUM_MONEY_USDT);

    if (!money || !(money >= minimumMoneyAllowed)) {
      return res.status(400).json({
        message: `Money is Required and it should be USDT ${minimumMoneyAllowed.toFixed(2)} or above!`,
        status: false,
        timeStamp: timeNow,
      });
    }

    if (!utr || utr.length < 10) {
      return res.status(400).json({
        message: `Transaction hash is required and should be at least 10 characters long`,
        status: false,
        timeStamp: timeNow,
      });
    }

    // Check for duplicate transaction hash
    const [isUsedUtr] = await connection.query(
      "SELECT * FROM recharge WHERE utr = ? ",
      [utr]
    );
    if (isUsedUtr.length) {
      return res.status(400).json({
        message: `Transaction hash is already used`,
        status: false,
        timeStamp: timeNow,
      });
    }

    const user = await getUserDataByAuthToken(auth);

    const pendingRechargeList = await rechargeTable.getRecordByPhoneAndStatus({
      phone: user.phone,
      status: PaymentStatusMap.PENDING,
      type: PaymentMethodsMap.USDT_MANUAL,
    });

    if (pendingRechargeList.length !== 0) {
      const deleteRechargeQueries = pendingRechargeList.map((recharge) => {
        return rechargeTable.cancelById(recharge.id);
      });

      await Promise.all(deleteRechargeQueries);
    }

    const orderId = getRechargeOrderId();

    const newRecharge = {
      orderId: orderId,
      transactionId: "NULL",
      utr: utr,
      phone: user.phone,
      money: money,
      type: PaymentMethodsMap.USDT_MANUAL,
      status: 0,
      today: rechargeTable.getCurrentTimeForTodayField(),
      url: "NULL",
      time: rechargeTable.getCurrentTimeForTimeField(),
    };

    // Debug the payment type being stored
    console.log('Storing payment type:', PaymentMethodsMap.USDT_MANUAL);
    console.log('Full recharge record:', newRecharge);

    const recharge = await rechargeTable.create(newRecharge);

    return res.status(200).json({
      message:
        "Payment Requested successfully Your Balance will update shortly!",
      recharge: recharge,
      status: true,
      timeStamp: timeNow,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: "Something went wrong!",
      timestamp: timeNow,
    });
  }
};
// --------------------------------------------

// Browse Recharge Record ---------------------
const browseRechargeRecord = async (req, res) => {
  try {
    let auth = req.cookies.auth;

    if (!auth) {
      return res.status(200).json({
        message: "Unauthorized",
        status: false,
        timeStamp: timeNow,
      });
    }

    const [recharge] = await connection.query(
      `SELECT * FROM recharge WHERE status = 0 AND (type = '${PaymentMethodsMap.UPI_MANUAL}' OR type = '${PaymentMethodsMap.USDT_MANUAL}')`,
      [],
    );

    return res.status(200).json({
      message: "Success",
      status: true,
      list: recharge,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      status: false,
      timeStamp: timeNow,
    });
  }
};
// --------------------------------------------

// Set Recharge Status ------------------------
const setRechargeStatus = async (req, res) => {
  try {
    let auth = req.cookies.auth;
    let data = {
      id: parseInt(req.body.id),
      status: parseInt(req.body.status),
    };

    if (!auth) {
      return res.status(401).json({
        message: "Unauthorized",
        status: false,
        timeStamp: timeNow,
      });
    }

    if (!data.id || !data.status) {
      return res.status(400).json({
        message: "Invalid Request",
        status: false,
        timeStamp: timeNow,
      });
    }

    const recharge = await rechargeTable.getRechargeById({ id: data.id });

    if (recharge === null) {
      return res.status(400).json({
        message: "Recharge not found!",
        status: false,
        timeStamp: timeNow,
      });
    }

    if (
      recharge.status === PaymentStatusMap.SUCCESS &&
      data.status === PaymentStatusMap.SUCCESS
    ) {
      return res.status(400).json({
        message: "Recharge already verified!",
        status: false,
        timeStamp: timeNow,
      });
    }

    if (
      recharge.status === PaymentStatusMap.CANCELLED &&
      data.status === PaymentStatusMap.CANCELLED
    ) {
      return res.status(400).json({
        message: "Recharge already cancelled!",
        status: false,
        timeStamp: timeNow,
      });
    }

    if (
      [
        PaymentStatusMap.SUCCESS,
        PaymentStatusMap.CANCELLED,
        PaymentStatusMap.PENDING,
      ].includes(data.status) === false
    ) {
      console.log([
        PaymentStatusMap.SUCCESS,
        PaymentStatusMap.CANCELLED,
        PaymentStatusMap.PENDING,
      ]);
      console.log(data.status);
      return res.status(400).json({
        message: "Invalid Status!",
        status: false,
        timeStamp: timeNow,
      });
    }

    if (data.status === PaymentStatusMap.SUCCESS) {
      const user = await getUserDataByPhoneNumber(recharge.phone);

      await connection.query("UPDATE recharge SET status = 1 WHERE id = ?", [
        data.id,
      ]);

      await addUserAccountBalance({
        phone: user.phone,
        money: recharge.money,
        code: user.code,
        invite: user.invite,
        rechargeId: recharge.id,
      });

      return res.status(200).json({
        message: "Recharge verified successfully!",
        status: true,
        timeStamp: timeNow,
      });
    } else if (data.status === PaymentStatusMap.CANCELLED) {
      await rechargeTable.setRechargeStatusById({
        id: data.id,
        status: PaymentStatusMap.CANCELLED,
      });
      return res.status(200).json({
        message: "Recharge cancelled successfully!",
        status: true,
        timeStamp: timeNow,
      });
    }

    await rechargeTable.setRechargeStatusById({
      id: data.id,
      status: PaymentStatusMap.PENDING,
    });
    return res.status(200).json({
      message: "Recharge set to waiting successfully!",
      status: true,
      timeStamp: timeNow,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      errorMessage: error.message,
      error: error,
      status: false,
      timeStamp: timeNow,
    });
  }
};

const walletTransfer = async (req, res) => {
  try {
    const schema = Joi.object({
      dialCode: Joi.string().required(),
      phone: Joi.string().required(),
      amount: Joi.number().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let auth = req.cookies.auth;

    const [rows] = await connection.query(
      "SELECT phone, money, password FROM users WHERE token = ?",
      [auth],
    );

    if (_.isEmpty(rows)) {
      return res.status(200).json({
        message: "Unauthorized",
        status: false,
      });
    }

    const user = rows[0];

    const pwd = req.body.password;

    const validPassword = await bcrypt.compare(pwd, user.password);

    if (!validPassword) {
      return res.status(400).json({
        status: false,
        message: "Invalid password",
      });
    }

    const phone = req.body.phone;

    if (phone === user.phone) {
      return res.status(400).json({
        message: "You can't transfer money to yourself!",
        status: false,
        timeStamp: timeNow,
      });
    }

    const amount = parseFloat(req.body.amount);

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount should be greater than 0!",
        status: false,
        timeStamp: timeNow,
      });
    }

    if (user.money < amount) {
      return res.status(400).json({
        message: "Insufficient Balance!",
        status: false,
        timeStamp: timeNow,
      });
    }

    const receiver = await connection.query(
      "SELECT * FROM users WHERE phone = ?",
      [phone],
    );

    if (receiver.length === 0) {
      return res.status(400).json({
        message: "Receiver not found!",
        status: false,
        timeStamp: timeNow,
      });
    }

    await connection.query(
      "UPDATE users SET money = money + ? WHERE phone = ?",
      [amount, phone],
    );

    await connection.query(
      "UPDATE users SET money = money - ? WHERE phone = ?",
      [amount, user.phone],
    );

    await connection.query(
      "INSERT INTO `balance_transfer` (`sender_phone`, `receiver_phone`, `amount`, `datetime`) VALUES (?, ?, ?, ?)",
      [user.phone, phone, amount, moment().format("YYYY-MM-DD HH:mm:ss")],
    );

    return res.status(200).json({
      message: "Money transferred successfully!",
      status: true,
      timeStamp: timeNow,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
      status: false,
      timeStamp: timeNow,
    });
  }
};

// helpers ---------------
const getUserDataByAuthToken = async (authToken) => {
  let [users] = await connection.query(
    "SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `token` = ? ",
    [authToken],
  );
  const user = users?.[0];

  if (user === undefined || user === null) {
    throw Error("Unable to get user data!");
  }

  return {
    phone: user.phone,
    code: user.code,
    username: user.name_user,
    invite: user.invite,
  };
};

const getUserDataByPhoneNumber = async (phoneNumber) => {
  let [users] = await connection.query(
    "SELECT `phone`, `code`,`name_user`,`invite` FROM users WHERE `phone` = ? ",
    [phoneNumber],
  );
  const user = users?.[0];

  if (user === undefined || user === null) {
    throw Error("Unable to get user data!");
  }

  return {
    phone: user.phone,
    code: user.code,
    username: user.name_user,
    invite: user.invite,
  };
};

const getUserByInviteCode = async (invite) => {
  if (!invite) throw new AppError("invite code not provided", 400);
  const [inviter] = await connection.query(
    "SELECT phone FROM users WHERE `code` = ?",
    [invite],
  );
  return inviter?.[0] || null;
};

const addUserMoney = async (phone, money) => {
  if (!phone || !money) {
    throw new AppError(
      `add User Money phone ${phone} or money ${money} not provided`,
      400,
    );
  }
  await connection.query(
    "UPDATE users SET money = money + ?, total_money = total_money + ? WHERE `phone` = ?",
    [money, money, phone],
  );
};

const addUserAccountBalance = async ({ money, phone, invite, rechargeId }) => {
  const totalRecharge = await rechargeTable.totalRechargeCount(
    PaymentStatusMap.SUCCESS,
    phone,
  );

  const bonus = (money / 100) * 5;
  const user_money = money + bonus;

  const firstRechargeBonus =
    totalRecharge === 1 ? getBonuses(money).uplineBonus : 0;
  const dailyRechargeBonus = money >= 50000 ? bonus : 0;
  const totalInviterMoney = firstRechargeBonus + dailyRechargeBonus;

  await addUserMoney(phone, user_money);

  console.log(phone, money, rechargeId, totalRecharge);
  await rechargeTable.updateRemainingBet(
    phone,
    money,
    rechargeId,
    totalRecharge,
  );

  const rewardType =
    totalRecharge === 1
      ? REWARD_TYPES_MAP.FIRST_RECHARGE_BONUS
      : REWARD_TYPES_MAP.DAILY_RECHARGE_BONUS;
  await addUserRewards(phone, bonus, rewardType);

  const inviter = await getUserByInviteCode(invite);

  if (inviter) {
    if (firstRechargeBonus !== 0) {
      await addUserRewards(
        inviter.phone,
        firstRechargeBonus,
        REWARD_TYPES_MAP.FIRST_RECHARGE_AGENT_BONUS,
      );
    }

    if (dailyRechargeBonus !== 0) {
      await addUserRewards(
        inviter.phone,
        dailyRechargeBonus,
        REWARD_TYPES_MAP.DAILY_RECHARGE_AGENT_BONUS,
      );
    }

    if (totalInviterMoney !== 0) {
      await addUserMoney(inviter.phone, totalInviterMoney);
    }
  }
};

const getRechargeOrderId = () => {
  const date = new Date();
  let id_time =
    date.getUTCFullYear() +
    "" +
    date.getUTCMonth() +
    1 +
    "" +
    date.getUTCDate();
  let id_order =
    Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1)) +
    10000000000000;

  return id_time + id_order;
};

const addUserRewards = async (phone, bonus, rewardType) => {
  if (!phone || !bonus || !rewardType)
    throw new AppError(
      `add User Rewards Invalid Parameters phone ${phone} or bonus ${bonus} or rewardType ${rewardType}`,
      400,
    );
  const reward_id = generateClaimRewardID();
  let timeNow = Date.now();

  await connection.query(
    "INSERT INTO claimed_rewards (reward_id,phone, amount, type, time, status) VALUES (?,?,?,?,?,?)",
    [
      reward_id,
      phone,
      bonus,
      rewardType,
      timeNow,
      REWARD_STATUS_TYPES_MAP.SUCCESS,
    ],
  );
};

const rechargeTable = {
  getRecordByPhoneAndStatus: async ({ phone, status, type }) => {
    if (
      ![
        PaymentStatusMap.SUCCESS,
        PaymentStatusMap.CANCELLED,
        PaymentStatusMap.PENDING,
      ].includes(status)
    ) {
      throw Error("Invalid Payment Status!");
    }

    let recharge;

    if (type) {
      [recharge] = await connection.query(
        "SELECT * FROM recharge WHERE phone = ? AND status = ? AND type = ?",
        [phone, status, type],
      );
    } else {
      [recharge] = await connection.query(
        "SELECT * FROM recharge WHERE phone = ? AND status = ?",
        [phone, status],
      );
    }

    return recharge.map((item) => ({
      id: item.id,
      orderId: item.id_order,
      transactionId: item.transaction_id,
      utr: item.utr,
      phone: item.phone,
      money: item.money,
      type: item.type,
      status: item.status,
      today: item.today,
      url: item.url,
      time: item.time,
    }));
  },
  getRechargeByOrderId: async ({ orderId }) => {
    const [recharge] = await connection.query(
      "SELECT * FROM recharge WHERE id_order = ?",
      [orderId],
    );

    if (recharge.length === 0) {
      return null;
    }

    return recharge.map((item) => ({
      id: item.id,
      orderId: item.id_order,
      transactionId: item.transaction_id,
      utr: item.utr,
      phone: item.phone,
      money: item.money,
      type: item.type,
      status: item.status,
      today: item.today,
      url: item.url,
      time: item.time,
    }))?.[0];
  },
  getRechargeById: async ({ id }) => {
    const [recharge] = await connection.query(
      "SELECT * FROM recharge WHERE id = ? LIMIT 1",
      [id],
    );

    if (recharge.length === 0) {
      return null;
    }

    return recharge.map((item) => ({
      id: item.id,
      orderId: item.id_order,
      transactionId: item.transaction_id,
      utr: item.utr,
      phone: item.phone,
      money: item.money,
      type: item.type,
      status: item.status,
      today: item.today,
      url: item.url,
      time: item.time,
    }))?.[0];
  },
  totalRechargeCount: async (status, phone) => {
    if (!status || !phone) throw new AppError("Invalid Status or Phone", 400);

    const [totalRechargeRow] = await connection.query(
      "SELECT COUNT(*) as count FROM recharge WHERE phone = ? AND status = ?",
      [phone, status],
    );
    const totalRecharge = totalRechargeRow[0].count || 0;
    return totalRecharge;
  },
  updateRemainingBet: async (phone, money, rechargeId, totalRecharge) => {
    const [previousRecharge] = await connection.query(
      `SELECT remaining_bet FROM recharge WHERE phone = ? AND status = 1 ORDER BY time_remaining_bet DESC LIMIT 2`,
      [phone],
    );

    const previousRemainingBet = previousRecharge?.[1]?.remaining_bet || 0;

    const totalRemainingBet =
      totalRecharge === 0 ? money : previousRemainingBet + money;

    await connection.query(
      "UPDATE recharge SET remaining_bet = ? WHERE id = ?",
      [totalRemainingBet, rechargeId],
    );
  },
  cancelById: async (id) => {
    if (typeof id !== "number") {
      throw Error("Invalid Recharge 'id' expected a number!");
    }

    await connection.query("UPDATE recharge SET status = 2 WHERE id = ?", [id]);
  },
  setRechargeStatusById: async ({ id, status }) => {
    if (typeof id !== "number") {
      throw Error("Invalid Recharge 'id' expected a number!");
    }

    if (
      ![
        PaymentStatusMap.SUCCESS,
        PaymentStatusMap.CANCELLED,
        PaymentStatusMap.PENDING,
      ].includes(status)
    ) {
      throw Error("Invalid Payment Status!");
    }

    await connection.query("UPDATE recharge SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  },
  setStatusToSuccessByIdAndOrderId: async ({ id, orderId, utr }) => {
    if (typeof id !== "number") {
      throw Error("Invalid Recharge 'id' expected a number!");
    }

    if (utr) {
      await connection.query(
        "UPDATE recharge SET status = 1, utr = ? WHERE id = ? AND id_order = ?",
        [utr, id, orderId],
      );
    } else {
      await connection.query(
        "UPDATE recharge SET status = 1 WHERE id = ? AND id_order = ?",
        [id, orderId],
      );
    }
  },
  getCurrentTimeForTimeField: () => {
    return moment().valueOf();
  },
  getCurrentTimeForTodayField: () => {
    return moment().format("YYYY-DD-MM h:mm:ss A");
  },
  getDMYDateOfTodayFiled: (today) => {
    return moment(today, "YYYY-DD-MM h:mm:ss A").format("DD-MM-YYYY");
  },
  create: async (newRecharge) => {
    if (newRecharge.url === undefined || newRecharge.url === null) {
      newRecharge.url = "0";
    }

    await connection.query(
      `INSERT INTO recharge SET id_order = ?, transaction_id = ?, phone = ?, money = ?, type = ?, status = ?, today = ?, url = ?, time = ?, time_remaining_bet = ?, utr = ?`,
      [
        newRecharge.orderId,
        newRecharge.transactionId,
        newRecharge.phone,
        newRecharge.money,
        newRecharge.type,
        newRecharge.status,
        newRecharge.today,
        newRecharge.url,
        newRecharge.time,
        newRecharge.time,
        newRecharge?.utr,
      ],
    );

    const [recharge] = await connection.query(
      "SELECT * FROM recharge WHERE id_order = ?",
      [newRecharge.orderId],
    );

    if (recharge.length === 0) {
      throw Error("Unable to create recharge!");
    }

    return recharge[0];
  },
};

// Get Pay Type Names - Returns all active payment gateways with payment info
const getPayTypeName = async (req, res) => {
  try {
    const [gateways] = await connection.query(
      "SELECT * FROM new_payment_gateways WHERE is_active = 1 ORDER BY id ASC",
    );

    // Fetch active payment info for each type
    const [activeUpiId] = await connection.query(
      "SELECT upi_id FROM new_upi_ids WHERE is_active = 1 LIMIT 1"
    );
    const [activeUpiQr] = await connection.query(
      "SELECT filepath FROM new_upi_images WHERE is_active = 1 LIMIT 1"
    );
    const [activeUsdt] = await connection.query(
      "SELECT wallet_address, network_type FROM new_usdt_addresses WHERE is_active = 1 LIMIT 1"
    );

    let usdtRate = 92;
    try {
      const [rateRow] = await connection.query("SELECT usdt_rate FROM admin_ac LIMIT 1");
      if (rateRow[0]?.usdt_rate) usdtRate = parseFloat(rateRow[0].usdt_rate);
    } catch (_) {}

    // Attach payment info to each gateway based on its array index position
    const gatewaysWithPaymentInfo = gateways.map((gateway, index) => {
      let paymentInfo = null;
      const gatewayIndex = index + 1; // 1-based position

      if (gatewayIndex === 1) {
        paymentInfo = {
          type: "upi_id",
          upi_id: activeUpiId[0]?.upi_id || null,
          qr_image: activeUpiQr[0]?.filepath || null,
        };
      } else if (gatewayIndex === 2) {
        paymentInfo = {
          type: "upi_qr",
          qr_image: activeUpiQr[0]?.filepath || null,
          upi_id: activeUpiId[0]?.upi_id || null,
        };
      } else if (gatewayIndex === 3) {
        paymentInfo = {
          type: "usdt_address",
          wallet_address: activeUsdt[0]?.wallet_address || null,
          network_type: activeUsdt[0]?.network_type || "TRC20",
        };
      } else {
        paymentInfo = {
          type: "upi_qr",
          qr_image: activeUpiQr[0]?.filepath || null,
          upi_id: activeUpiId[0]?.upi_id || null,
        };
      }

      // Parse comma-separated recharge_amounts into array for frontend
      let parsedRechargeAmounts = [];
      if (gateway.recharge_amounts) {
        parsedRechargeAmounts = gateway.recharge_amounts
          .split(",")
          .map((a) => parseInt(a.trim()))
          .filter((a) => !isNaN(a));
      }

      return {
        ...gateway,
        payment_info: paymentInfo,
        recharge_amounts: parsedRechargeAmounts,
      };
    });

    return res.status(200).json({
      message: "Success",
      status: true,
      datas: gatewaysWithPaymentInfo,
      usdt_rate: usdtRate,
      timeStamp: Date.now(),
    });
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
    return res.status(200).json({
      message: "Failed to fetch payment gateways",
      status: false,
      datas: [],
      timeStamp: Date.now(),
    });
  }
};

// Initiate Gateway Payment - Dynamic payment page based on gateway ID
const initiateGatewayPayment = async (req, res) => {
  try {
    const { gateway_name, gateway_id, user_id } = req.params;
    const { amount } = req.query;

    if (!gateway_id || !user_id) {
      return res.status(400).send("Invalid payment request");
    }

    // Get gateway info
    const [gateways] = await connection.query(
      "SELECT * FROM new_payment_gateways WHERE id = ? AND is_active = 1 LIMIT 1",
      [gateway_id]
    );

    if (gateways.length === 0) {
      return res.status(404).send("Payment gateway not found or inactive");
    }

    const gateway = gateways[0];
    const gatewayId = parseInt(gateway_id);

    // Fetch payment info based on gateway ID position
    let paymentData = {
      gateway_id: gatewayId,
      gateway_name: gateway.pay_name,
      amount: amount || 0,
      user_id: user_id,
      min_price: gateway.min_price,
      max_price: gateway.max_price,
      bonus_percent: gateway.bonus_percent,
      payment_type: null,
      upi_id: null,
      qr_image: null,
      usdt_address: null,
      network_type: null,
    };

    // Find this gateway's position among all active gateways (same logic as getPayTypeName)
    const [allActiveGateways] = await connection.query(
      "SELECT id FROM new_payment_gateways WHERE is_active = 1 ORDER BY id ASC"
    );
    const gatewayPosition = allActiveGateways.findIndex(g => g.id === parseInt(gateway_id)) + 1; // 1-based

    if (gatewayPosition === 1) {
      const [upiData] = await connection.query(
        "SELECT upi_id FROM new_upi_ids WHERE is_active = 1 LIMIT 1"
      );
      paymentData.payment_type = "upi_id";
      paymentData.upi_id = upiData[0]?.upi_id || null;
    } else if (gatewayPosition === 2 || gatewayPosition >= 4) {
      const [qrData] = await connection.query(
        "SELECT filepath FROM new_upi_images WHERE is_active = 1 LIMIT 1"
      );
      paymentData.payment_type = "upi_qr";
      paymentData.qr_image = qrData[0]?.filepath || null;
    } else if (gatewayPosition === 3) {
      const [usdtData] = await connection.query(
        "SELECT wallet_address, network_type FROM new_usdt_addresses WHERE is_active = 1 LIMIT 1"
      );
      const [usdtQrData] = await connection.query(
        "SELECT filepath FROM new_usdt_images WHERE is_active = 1 LIMIT 1"
      );
      paymentData.payment_type = "usdt_address";
      paymentData.usdt_address = usdtData[0]?.wallet_address || null;
      paymentData.network_type = usdtData[0]?.network_type || "TRC20";
      paymentData.usdt_qr_image = usdtQrData[0]?.filepath || null;
      return res.render("wallet/crypto_payment.ejs", paymentData);
    }

    return res.render("wallet/gateway_payment.ejs", paymentData);
  } catch (error) {
    console.error("Error initiating gateway payment:", error);
    return res.status(500).send("Payment initialization failed");
  }
};

// Submit Gateway Payment - Handle UTR submission
const submitGatewayPayment = async (req, res) => {
  try {
    const { money, utr, gateway_id, user_id } = req.body;
    let auth = req.cookies.auth;

    if (!money || !gateway_id) {
      return res.status(400).json({
        message: "Amount and gateway ID are required",
        status: false,
        timeStamp: Date.now(),
      });
    }

    const amount = parseInt(money);

    // Validate gateway exists and is active, enforce min/max from DB
    const [gateways] = await connection.query(
      "SELECT * FROM new_payment_gateways WHERE id = ? AND is_active = 1 LIMIT 1",
      [gateway_id]
    );

    if (gateways.length === 0) {
      return res.status(400).json({
        message: "Payment gateway not found or inactive",
        status: false,
        timeStamp: Date.now(),
      });
    }

    const gateway = gateways[0];

    if (gateway.min_price && amount < gateway.min_price) {
      return res.status(400).json({
        message: `Minimum amount is ₹${gateway.min_price}`,
        status: false,
        timeStamp: Date.now(),
      });
    }

    if (gateway.max_price && amount > gateway.max_price) {
      return res.status(400).json({
        message: `Maximum amount is ₹${gateway.max_price}`,
        status: false,
        timeStamp: Date.now(),
      });
    }

    if (!utr) {
      return res.status(400).json({
        message: "Transaction ID / UTR is required",
        status: false,
        timeStamp: Date.now(),
      });
    }

    // Check if UTR already used
    const [isUsedUtr] = await connection.query(
      "SELECT * FROM recharge WHERE utr = ?",
      [utr]
    );
    if (isUsedUtr.length) {
      return res.status(400).json({
        message: "Transaction ID / UTR is already used",
        status: false,
        timeStamp: Date.now(),
      });
    }

    const user = await getUserDataByAuthToken(auth);

    const { payment_type } = req.body;

    // For USDT payments: update existing pending record with UTR instead of creating new one
    if (payment_type === 'usdt_address') {
      const [existingPending] = await connection.query(
        "SELECT * FROM recharge WHERE phone = ? AND status = 0 AND type = 'USDT' ORDER BY id DESC LIMIT 1",
        [user.phone]
      );

      if (existingPending.length > 0) {
        await connection.query(
          "UPDATE recharge SET utr = ? WHERE id = ?",
          [utr, existingPending[0].id]
        );

        return res.status(200).json({
          message: "Payment submitted successfully! Your balance will update shortly.",
          recharge: existingPending[0],
          status: true,
          timeStamp: Date.now(),
        });
      }
    }

    // For non-USDT payments: create new record as before
    let paymentType = gateway.pay_name || ("gateway_" + gateway_id);

    const orderId = getRechargeOrderId();

    const newRecharge = {
      orderId: orderId,
      transactionId: "NULL",
      utr: utr,
      phone: user.phone,
      money: amount,
      type: paymentType,
      status: 0,
      today: rechargeTable.getCurrentTimeForTodayField(),
      url: "NULL",
      time: rechargeTable.getCurrentTimeForTimeField(),
    };

    const recharge = await rechargeTable.create(newRecharge);

    return res.status(200).json({
      message: "Payment submitted successfully! Your balance will update shortly.",
      recharge: recharge,
      status: true,
      timeStamp: Date.now(),
    });
  } catch (error) {
    console.error("Error submitting gateway payment:", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong!",
      timeStamp: Date.now(),
    });
  }
};

const paymentController = {
  initiateManualUPIPayment,
  addManualUPIPaymentRequest,
  addManualUSDTPaymentRequest,
  initiateManualUSDTPayment,
  browseRechargeRecord,
  setRechargeStatus,
  walletTransfer,
  getPayTypeName,
  initiateGatewayPayment,
  submitGatewayPayment,
};

export default paymentController;

