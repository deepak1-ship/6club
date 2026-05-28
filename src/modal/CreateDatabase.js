import "dotenv/config";
import connection from "../config/connectDB.js";

let timeNow = Date.now();

// Helper function to generate period ID based on current date
const generatePeriodId = (periodNumber = 1) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  // Format: YYYYMMDD1000XX (where XX is period number padded to 4 digits)
  return `${year}${month}${day}1000${String(periodNumber).padStart(4, "0")}`;
};

// Get random result for games
const getRandomResult = (max = 9) => Math.floor(Math.random() * (max + 1));

const CreateWingo = async (req, res) => {
  // Reset DataBase Wingo
  await connection.execute("DELETE FROM wingo");

  let arr = ["wingo10", "wingo5", "wingo3", "wingo"];
  const basePeriod = generatePeriodId(0);
  const currentPeriod = generatePeriodId(1);

  for (let i = 0; i < arr.length; i++) {
    // Insert completed game record
    const sql =
      "INSERT INTO wingo SET period = ?, game = ?, amount = ?, status = 1, time = ?";
    await connection.execute(sql, [
      basePeriod,
      arr[i],
      getRandomResult(),
      timeNow,
    ]);

    // Insert current pending game record
    const sql_1 =
      "INSERT INTO wingo SET period = ?, game = ?, amount = 0, status = 0, time = ?";
    await connection.execute(sql_1, [currentPeriod, arr[i], timeNow]);
  }
  console.log("✅ Create Success Database Wingo with fresh periods.");
};

const Create5D = async (req, res) => {
  // Reset DataBase 5D
  await connection.execute("DELETE FROM 5d");

  let arr = [10, 5, 3, 1];
  const basePeriod = generatePeriodId(0);
  const currentPeriod = generatePeriodId(1);

  // Generate random 5-digit result
  const randomResult = () => {
    let result = "";
    for (let j = 0; j < 5; j++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  };

  for (let i = 0; i < arr.length; i++) {
    const sql =
      "INSERT INTO 5d SET period = ?, result = ?, game = ?, status = 1, time = ?";
    await connection.execute(sql, [
      basePeriod,
      randomResult(),
      arr[i],
      timeNow,
    ]);
    const sql_1 =
      "INSERT INTO 5d SET period = ?, result = ?, game = ?, status = 0, time = ?";
    await connection.execute(sql_1, [currentPeriod, "0", arr[i], timeNow]);
  }
  console.log("✅ Create Success Database 5D with fresh periods.");
};

const CreateK3 = async (req, res) => {
  // Reset DataBase K3
  await connection.execute("DELETE FROM k3");

  let arr = [10, 5, 3, 1];
  const basePeriod = generatePeriodId(0);
  const currentPeriod = generatePeriodId(1);

  // Generate random 3-digit result (dice: 1-6 each)
  const randomK3Result = () => {
    let result = "";
    for (let j = 0; j < 3; j++) {
      result += Math.floor(Math.random() * 6) + 1;
    }
    return result;
  };

  for (let i = 0; i < arr.length; i++) {
    const sql =
      "INSERT INTO k3 SET period = ?, result = ?, game = ?, status = 1, time = ?";
    await connection.execute(sql, [
      basePeriod,
      randomK3Result(),
      arr[i],
      timeNow,
    ]);
    const sql_1 =
      "INSERT INTO k3 SET period = ?, result = ?, game = ?, status = 0, time = ?";
    await connection.execute(sql_1, [currentPeriod, "0", arr[i], timeNow]);
  }
  console.log("✅ Create Success Database K3 with fresh periods.");
};

const CreateTrxWingo = async (req, res) => {
  // Reset DataBase TRX Wingo
  await connection.execute("DELETE FROM trx_wingo_game");

  let arr = ["trx_wingo", "trx_wingo3", "trx_wingo5", "trx_wingo10"];
  const basePeriod = generatePeriodId(0);
  const currentPeriod = generatePeriodId(1);

  for (let i = 0; i < arr.length; i++) {
    // Insert completed game record with sample hash
    const sql =
      "INSERT INTO trx_wingo_game SET period = ?, result = ?, game = ?, status = 1, block_id = ?, block_time = ?, hash = ?, time = ?, release_status = 1";
    await connection.execute(sql, [
      basePeriod,
      getRandomResult(),
      arr[i],
      0,
      timeNow,
      "0000000000000000000000000000000000000000000000000000000000000000",
      timeNow,
    ]);

    // Insert current pending game record
    const sql_1 =
      "INSERT INTO trx_wingo_game SET period = ?, result = 0, game = ?, status = 0, block_id = 0, block_time = '', hash = '', time = ?, release_status = 0";
    await connection.execute(sql_1, [currentPeriod, arr[i], timeNow]);
  }
  console.log("✅ Create Success Database TRX Wingo with fresh periods.");
  console.log(
    "📌 Please press Ctrl + C and run 'npm start' to start the server.",
  );
};

const Level = async (req, res) => {
  // Reset DataBase Level
  await connection.execute("DELETE FROM level");

  await connection.execute(
    "INSERT INTO level SET id = 7, level = 6, f1 = 1, f2 = 0.3, f3 = 0.09, f4 = 0.027",
  );
  await connection.execute(
    "INSERT INTO level SET id = 6, level = 5, f1 = 0.9, f2 = 0.27, f3 = 0.081, f4 = 0.0243",
  );
  await connection.execute(
    "INSERT INTO level SET id = 5, level = 4, f1 = 0.85, f2 = 0.255, f3 = 0.0765, f4 = 0.023",
  );
  await connection.execute(
    "INSERT INTO level SET id = 4, level = 3, f1 = 0.8, f2 = 0.24, f3 = 0.072, f4 = 0.0216",
  );
  await connection.execute(
    "INSERT INTO level SET id = 3, level = 2, f1 = 0.75, f2 = 0.225, f3 = 0.0675, f4 = 0.0203",
  );
  await connection.execute(
    "INSERT INTO level SET id = 2, level = 1, f1 = 0.7, f2 = 0.21, f3 = 0.063, f4 = 0.0189",
  );
  await connection.execute(
    "INSERT INTO level SET id = 1, level = 0, f1 = 0.6, f2 = 0.18, f3 = 0.054, f4 = 0.0162",
  );
};

const NapRut = async (req, res) => {
  // Reset DataBase Level
  await connection.execute("DELETE FROM bank_recharge");
  await connection.execute(
    "INSERT INTO `bank_recharge` (`id`, `name_bank`, `name_user`, `stk`, `type`, `time`) VALUES (NULL, 'MB BANK', 'NGUYEN NHAT LONG', '0800103725300', 'bank', '1655689155500')",
  );
  await connection.execute(
    "INSERT INTO `bank_recharge` (`id`, `name_bank`, `name_user`, `stk`, `type`, `time`) VALUES (NULL, 'MOMO', 'NGUYEN NHAT LONG', '387633464', 'momo', '1655689155500')",
  );
};

const Admin = async (req, res) => {
  // Reset DataBase Level
  await connection.execute("DELETE FROM admin_ac");
  await connection.execute(
    "INSERT INTO `admin_ac` (`id`, `wingo1`, `wingo3`, `wingo5`, `wingo10`, `k5d`, `k5d3`, `k5d5`, `k5d10`, `win_rate`, `telegram`, `cskh`, `app`) VALUES (NULL, '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '80', 'https://t.me/Olivia_XDR', 'https://t.me/Olivia_XDR', '#')",
  );
};

// Run all database reset functions
CreateWingo();
Create5D();
CreateK3();
CreateTrxWingo();
