import express from "express";
import accountController from "../controllers/accountController.js";
import homeController from "../controllers/homeController.js";
import winGoController from "../controllers/winGoController.js";
import userController from "../controllers/userController.js";
import middlewareController from "../controllers/middlewareController.js";
import adminController from "../controllers/adminController.js";
import dailyController from "../controllers/dailyController.js";
import k5Controller from "../controllers/k5Controller.js";
import k3Controller from "../controllers/k3Controller.js";
import paymentController from "../controllers/paymentController.js";

import withdrawalController from "../controllers/withdrawalController.js";
import trxWingoController from "../controllers/trxWingoController.js";
import gameController from "../controllers/gameController.js";
import promotionController from "../controllers/promotionController.js";

import vipController from "../controllers/vipController.js";
import websiteDesignController from "../controllers/FrontendController.js";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
fs.mkdirSync("src/public/uploads/upi", { recursive: true });
fs.mkdirSync("src/public/uploads", { recursive: true });
fs.mkdirSync("src/public/assets/png", { recursive: true });

// Multer configuration for image uploads (single directory for all)
const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/assets/png/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const imageUpload = multer({ storage: uploadStorage });

// Dedicated multer for UPI QR image uploads → saves to src/public/uploads/upi/
const upiUploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads/upi/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "upi_" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upiImageUpload = multer({ storage: upiUploadStorage });

// Dedicated multer for USDT QR image uploads → saves to src/public/uploads/
const usdtUploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "usdt_" + uniqueSuffix + path.extname(file.originalname));
  },
});
const usdtImageUpload = multer({ storage: usdtUploadStorage });

let router = express.Router();

const initWebRouter = (app) => {
  // page account


  router.get("/keFuMenu", accountController.keFuMenu);
  router.get("/login", accountController.loginPage);
  router.get("/register", accountController.registerPage);
  router.get("/forgot", accountController.forgotPage);
  router.get("/forgot_reset", accountController.forgotResetPage);
  router.post("/api/send_otp", accountController.sendOtpCode);
  router.post(
    "/api/reset_password",
    accountController.resetPasswordByOtpAndPhone,
  );

  // page home
  router.get("/", (req, res) => {
    return res.redirect("/home");
  });
  router.get("/home", homeController.homePage);
  router.get("/support", homeController.supportPage);
  // Public APIs
  router.get("/api/banners", homeController.getBanners);
  router.get("/api/activity-banners", homeController.getActivityBanners);
  router.get("/api/custom-banners", homeController.getCustomBanners);
  router.get("/api/category-banners", homeController.getCategoryBanners);
  router.get("/api/site-settings", homeController.getSiteSettings);
  router.get("/api/lang-currency", homeController.getLangCurrency);
  router.get("/api/invite-tasks", homeController.getInviteTasks);
  router.get("/checkIn", middlewareController, homeController.checkInPage);
  router.get("/activity", middlewareController, homeController.activityPage);
  router.get("/dailytask", middlewareController, homeController.dailytaskPage);
  router.get(
    "/invitation_rules",
    middlewareController,
    homeController.invitationRulesPage,
  );
  router.get("/invibonus", middlewareController, homeController.invibonusPage);
  router.get(
    "/invibonus/record",
    middlewareController,
    homeController.invitationRecord,
  );
  router.get(
    "/dailytask/record",
    middlewareController,
    homeController.rechargeAwardCollectionRecord,
  );
  router.get(
    "/attendance/record",
    middlewareController,
    homeController.attendanceRecordPage,
  );
  router.get(
    "/attendance/rules",
    middlewareController,
    homeController.attendanceRulesPage,
  );
  router.get("/rebate", middlewareController, homeController.rebatePage);
  router.get("/jackpot", middlewareController, homeController.jackpotPage);
  router.get("/newGift", middlewareController, homeController.newGift);
  router.get("/vip", middlewareController, homeController.vipPage);
  router.get("/newHot", middlewareController, homeController.newHot);
  router.get("/youtube", middlewareController, homeController.youtube);
  router.get("/mystery", middlewareController, homeController.mystery);
  router.get("/program", middlewareController, homeController.program);
  router.get("/winzo", middlewareController, homeController.winzo);
  router.get("/agent", middlewareController, homeController.agent);
  router.get("/dailyCheck", middlewareController, homeController.dailyCheck);
  router.get("/checkDes", middlewareController, homeController.checkDes);
  router.get("/checkRecord", middlewareController, homeController.checkRecord);
  router.get(
    "/attendance",
    middlewareController,
    homeController.attendancePage,
  );
  router.get(
    "/first_deposit_bonus",
    middlewareController,
    homeController.firstDepositBonusPage,
  );
  router.get(
    "/aviator_betting_reward",
    middlewareController,
    homeController.aviatorBettingRewardPage,
  );
  router.get(
    "/social_video_award",
    middlewareController,
    homeController.socialVideoAwardPagePage,
  );
  router.get(
    "/jackpot/rules",
    middlewareController,
    homeController.jackpotRulesPage,
  );
  router.get(
    "/jackpot/wining_star",
    middlewareController,
    homeController.jackpotWiningStarPage,
  );
  router.get("/wallet/transfer", middlewareController, homeController.transfer);
  router.get(
    "/game_history",
    middlewareController,
    homeController.gameHistoryPage,
  );

  router.get("/promotion", middlewareController, homeController.promotionPage);
  router.get(
    "/promotion/subordinates",
    middlewareController,
    homeController.subordinatesPage,
  );

  router.get(
    "/promotion1",
    middlewareController,
    homeController.promotion1Page,
  );
  router.get(
    "/promotion/myTeam",
    middlewareController,
    homeController.promotionmyTeamPage,
  );
  router.get(
    "/promotion/promotionDes",
    middlewareController,
    homeController.promotionDesPage,
  );
  router.get(
    "/promotion/comhistory",
    middlewareController,
    homeController.comhistoryPage,
  );
  router.get(
    "/promotion/tutorial",
    middlewareController,
    homeController.tutorialPage,
  );
  router.get(
    "/promotion/bonusrecord",
    middlewareController,
    homeController.bonusRecordPage,
  );
  router.get(
    "/promotion/rebateRadio",
    middlewareController,
    homeController.promotionRebateRatioPage,
  );

  // promotion controller
  router.get(
    "/api/subordinates/summary",
    middlewareController,
    promotionController.subordinatesDataAPI,
  );

  router.get(
    "/api/subordinates",
    middlewareController,
    promotionController.subordinatesAPI,
  );
  router.get(
    "/api/subordinates/details",
    middlewareController,
    promotionController.subordinatesDataByTimeAPI,
  );
  router.get(
    "/api/activity/invitation_bonus",
    middlewareController,
    promotionController.getInvitationBonus,
  );
  router.post(
    "/api/activity/invitation_bonus/claim",
    middlewareController,
    promotionController.claimInvitationBonus,
  );
  router.get(
    "/api/activity/invitation/record",
    middlewareController,
    promotionController.getInvitedMembers,
  );
  router.get(
    "/api/activity/daily_recharge_bonus",
    middlewareController,
    promotionController.getDailyRechargeReword,
  );
  router.post(
    "/api/activity/daily_recharge_bonus/claim",
    middlewareController,
    promotionController.claimDailyRechargeReword,
  );
  // router.post("/api/activity/daily_recharge/record", middlewareController, promotionController.claimDailyRechargeReword)
  router.get(
    "/api/activity/daily_recharge_bonus/record",
    middlewareController,
    promotionController.dailyRechargeRewordRecord,
  );
  router.get(
    "/api/activity/first_recharge_bonus",
    middlewareController,
    promotionController.getFirstRechargeRewords,
  );
  router.post(
    "/api/activity/first_recharge_bonus/claim",
    middlewareController,
    promotionController.claimFirstRechargeReword,
  );
  router.get(
    "/api/activity/attendance_bonus",
    middlewareController,
    promotionController.getAttendanceBonus,
  );
  router.post(
    "/api/activity/attendance_bonus/claim",
    middlewareController,
    promotionController.claimAttendanceBonus,
  );
  router.get(
    "/api/activity/attendance/record",
    middlewareController,
    promotionController.getAttendanceBonusRecord,
  );

  router.get(
    "/api/vip/info",
    middlewareController,
    vipController.getMyVIPLevelInfo,
  );
  router.get(
    "/api/vip/history",
    middlewareController,
    vipController.getVIPHistory,
  );

  router.get("/wallet", middlewareController, homeController.walletPage);
  router.get(
    "/wallet/recharge",
    middlewareController,
    homeController.rechargePage,
  );
  router.get(
    "/wallet/withdrawal",
    middlewareController,
    homeController.withdrawalPage,
  );
  router.get(
    "/wallet/rechargerecord",
    middlewareController,
    homeController.rechargerecordPage,
  );
  router.get(
    "/wallet/withdrawalrecord",
    middlewareController,
    homeController.withdrawalrecordPage,
  );
  router.get(
    "/wallet/addBank",
    middlewareController,
    withdrawalController.addBankCardPage,
  );
  router.get(
    "/wallet/selectBank",
    middlewareController,
    withdrawalController.selectBankPage,
  );
  router.get(
    "/wallet/addAddress",
    middlewareController,
    withdrawalController.addUSDTAddressPage,
  );
  router.get(
    "/wallet/transactionhistory",
    middlewareController,
    homeController.transactionhistoryPage,
  );

  router.get(
    "/wallet/paynow/manual_upi",
    middlewareController,
    paymentController.initiateManualUPIPayment,
  );
  router.get(
    "/wallet/paynow/manual_usdt",
    middlewareController,
    paymentController.initiateManualUSDTPayment,
  );
  router.post(
    "/wallet/paynow/manual_upi_request",
    middlewareController,
    paymentController.addManualUPIPaymentRequest,
  );
  router.post(
    "/wallet/paynow/manual_usdt_request",
    middlewareController,
    paymentController.addManualUSDTPaymentRequest,
  );
  router.get(
    "/api/pay/getPayTypeName",
    middlewareController,
    paymentController.getPayTypeName,
  );

  // Dynamic Payment Gateway Routes
  router.get(
    "/pay/:gateway_name/:gateway_id/:user_id",
    paymentController.initiateGatewayPayment,
  );
  router.post(
    "/pay/submit",
    middlewareController,
    paymentController.submitGatewayPayment,
  );

  router.get(
    "/game/statistics",
    middlewareController,
    gameController.gameStatistics,
  );
  router.get(
    "/mian/game_statistics",
    middlewareController,
    gameController.gameStatisticsPage,
  );

  router.get("/mian", middlewareController, homeController.mianPage);
  router.get("/settings", middlewareController, homeController.settingsPage);
  router.get(
    "/settings/change_avatar",
    middlewareController,
    homeController.changeAvatarPage,
  );

  router.get(
    "/recordsalary",
    middlewareController,
    homeController.recordsalary,
  );
  router.get(
    "/getrecord",
    middlewareController,
    homeController.getSalaryRecord,
  );
  router.get("/about", middlewareController, homeController.aboutPage);
  router.get("/guide", middlewareController, homeController.guidePage);
  router.get("/feedback", middlewareController, homeController.feedbackPage);
  router.get(
    "/notification",
    middlewareController,
    homeController.notificationPage,
  );
  router.get(
    "/login_notification",
    middlewareController,
    homeController.loginNotificationPage,
  );
  router.get(
    "/redenvelopes",
    middlewareController,
    homeController.redenvelopes,
  );
  router.get("/mian/forgot", middlewareController, homeController.forgot);
  router.get("/newtutorial", homeController.newtutorial);
  router.get(
    "/about/privacyPolicy",
    middlewareController,
    homeController.privacyPolicy,
  );
  router.get(
    "/about/riskAgreement",
    middlewareController,
    homeController.riskAgreement,
  );

  router.get("/myProfile", middlewareController, homeController.myProfilePage);

  // BET wingo
  router.get("/wingo", middlewareController, winGoController.winGoPage);

  // BET trx wingo
  router.get(
    "/trx_wingo",
    middlewareController,
    trxWingoController.trxWingoPage,
  );
  router.get(
    "/trx_block",
    middlewareController,
    trxWingoController.trxWingoBlockPage,
  );

  // BET K5D
  router.get("/5d", middlewareController, k5Controller.K5DPage);
  router.post(
    "/api/webapi/action/5d/join",
    middlewareController,
    k5Controller.betK5D,
  ); // register
  router.post(
    "/api/webapi/5d/GetNoaverageEmerdList",
    middlewareController,
    k5Controller.listOrderOld,
  ); // register
  router.post(
    "/api/webapi/5d/GetMyEmerdList",
    middlewareController,
    k5Controller.GetMyEmerdList,
  ); // register

  // BET K3
  router.get("/k3", middlewareController, k3Controller.K3Page);

  router.post(
    "/api/webapi/action/k3/join",
    middlewareController,
    k3Controller.betK3,
  ); // register
  router.post(
    "/api/webapi/k3/GetNoaverageEmerdList",
    middlewareController,
    k3Controller.listOrderOld,
  ); // register
  router.post(
    "/api/webapi/k3/GetMyEmerdList",
    middlewareController,
    k3Controller.GetMyEmerdList,
  ); // register

  // login | register
  router.post("/api/webapi/login", accountController.login); // login
  router.post("/api/webapi/register", accountController.register); // register
  router.get("/aviator", middlewareController, userController.aviator);
  router.get(
    "/api/webapi/GetUserInfo",
    middlewareController,
    userController.userInfo,
  ); // get info account
  router.put(
    "/api/webapi/change/userInfo",
    middlewareController,
    userController.changeUser,
  ); // get info account
  router.put(
    "/api/webapi/change/pass",
    middlewareController,
    accountController.resetPasswordByPassword,
  ); // get info account
  router.patch(
    "/api/webapi/change/avatar",
    middlewareController,
    accountController.updateAvatarAPI,
  ); // get info account
  router.patch(
    "/api/webapi/change/username",
    middlewareController,
    accountController.updateUsernameAPI,
  ); // get info account

  // bet wingo
  router.post(
    "/api/webapi/action/join",
    middlewareController,
    winGoController.betWinGo,
  ); // register
  router.post(
    "/api/webapi/GetNoaverageEmerdList",
    middlewareController,
    winGoController.listOrderOld,
  ); // register
  router.post(
    "/api/webapi/GetMyEmerdList",
    middlewareController,
    winGoController.GetMyEmerdList,
  ); // register

  // bet TRX wingo
  router.post(
    "/api/webapi/trx_wingo/action/join",
    middlewareController,
    trxWingoController.betTrxWingo,
  ); // register
  router.post(
    "/api/webapi/trx_wingo/GetNoaverageEmerdList",
    middlewareController,
    trxWingoController.listOrderOld,
  ); // register
  router.post(
    "/api/webapi/trx_wingo/GetMyEmerdList",
    middlewareController,
    trxWingoController.GetMyEmerdList,
  ); // register

  // promotion
  router.post(
    "/api/webapi/promotion",
    middlewareController,
    userController.promotion,
  ); // register
  router.post(
    "/api/webapi/checkIn",
    middlewareController,
    userController.checkInHandling,
  ); // register
  router.post(
    "/api/webapi/check/Info",
    middlewareController,
    userController.infoUserBank,
  ); // register
  router.post(
    "/api/webapi/addBank",
    middlewareController,
    userController.addBank,
  ); // register
  router.post(
    "/api/webapi/otp",
    middlewareController,
    userController.verifyCode,
  ); // register
  router.post(
    "/api/webapi/use/redenvelope",
    middlewareController,
    userController.useRedenvelope,
  ); // register

  // wallet
  router.post(
    "/api/webapi/recharge",
    middlewareController,
    userController.recharge,
  );
  router.post(
    "/api/webapi/cancel_recharge",
    middlewareController,
    userController.cancelRecharge,
  ); // register
  router.post("/wowpay/create", middlewareController, userController.wowpay);
  router.post(
    "/api/webapi/confirm_recharge",
    middlewareController,
    userController.confirmRecharge,
  );
  router.get(
    "/api/webapi/myTeam",
    middlewareController,
    userController.listMyTeam,
  ); // register
  router.get(
    "/api/webapi/recharge/list",
    middlewareController,
    userController.listRecharge,
  ); // register
  router.get(
    "/api/webapi/withdraw/transactionRecord",
    middlewareController,
    userController.listTransaction,
  ); // register
  router.get(
    "/api/webapi/withdraw/",
    middlewareController,
    userController.listWithdraw,
  ); // register
  router.post(
    "/api/webapi/withdrawal",
    middlewareController,
    userController.withdrawal3,
  ); // register
  // --

  const withdrawalRateLimiter = rateLimit({
    windowMs: 5 * 1000, // 15 minutes
    max: 1, // Limit each IP to 5 withdrawal requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: function (req, res /*, next */) {
      res.status(429).json({
        message:
          "Too many withdrawal requests created from this IP, please try again after 5 second",
        status: false,
        timeStamp: new Date().toISOString(),
      });
    },
  });

  router.post(
    "/api/webapi/withdraw/create",
    withdrawalRateLimiter,
    middlewareController,
    withdrawalController.createWithdrawalRequest,
  ); // register
  router.post(
    "/api/webapi/withdraw/add_bank_card",
    middlewareController,
    withdrawalController.addBankCard,
  ); // register
  router.post(
    "/api/webapi/withdraw/add_usdt_address",
    middlewareController,
    withdrawalController.addUSDTAddress,
  ); // register
  router.get(
    "/api/webapi/withdraw/bank_card",
    middlewareController,
    withdrawalController.getBankCardInfo,
  ); // register
  router.get(
    "/api/webapi/withdraw/usdt_address",
    middlewareController,
    withdrawalController.getUSDTAddressInfo,
  ); // register
  router.post(
    "/api/webapi/withdraw/add_upi",
    middlewareController,
    withdrawalController.addUPI,
  ); // register
  router.get(
    "/api/webapi/withdraw/upi",
    middlewareController,
    withdrawalController.getUPIInfo,
  ); // register
  router.get(
    "/api/webapi/withdraw/upi_cards",
    middlewareController,
    withdrawalController.getAllUPICards,
  ); // register
  router.get(
    "/api/webapi/withdraw/usdt_address_cards",
    middlewareController,
    withdrawalController.getAllUSDTCards,
  ); // register
  router.get(
    "/api/webapi/withdraw/history",
    middlewareController,
    withdrawalController.listWithdrawalHistory,
  ); // register
  router.get(
    "/api/webapi/withdraw/pending",
    middlewareController,
    withdrawalController.listWithdrawalRequests,
  ); // register
  router.post(
    "/api/webapi/admin/withdraw/status",
    adminController.middlewareAdminController,
    withdrawalController.approveOrDenyWithdrawalRequest,
  ); // register
  router.post(
    "/api/webapi/admin/withdraw/auto_approve",
    adminController.middlewareAdminController,
    withdrawalController.approveAndInitiateAquapayWithdrawalRequest,
  ); // register
  router.post(
    "/api/withdrawal/aqua_callback",
    withdrawalController.verifyAquapayWithdrawalRequest,
  ); // register
  // router.post("/api/webapi/recharge/check", middlewareController, userController.recharge2) // register
  // router.post("/api/webapi/callback_bank", middlewareController, userController.callback_bank) // register
  // router.post("/api/webapi/recharge/update", middlewareController, userController.updateRecharge) // update recharge
  router.post(
    "/api/wallet_transfer",
    middlewareController,
    paymentController.walletTransfer,
  ); // register
  router.post(
    "/api/webapi/transfer",
    middlewareController,
    userController.transfer,
  ); // register
  router.get(
    "/api/webapi/transfer_history",
    middlewareController,
    userController.transferHistory,
  ); //
  router.get(
    "/api/webapi/confirm_recharge_usdt",
    middlewareController,
    userController.confirmUSDTRecharge,
  ); //
  router.post(
    "/api/webapi/confirm_recharge_usdt",
    middlewareController,
    userController.confirmUSDTRecharge,
  ); //
  router.post(
    "/api/webapi/search",
    middlewareController,
    userController.search,
  ); // register

  // daily
  router.get(
    "/manager/index",
    dailyController.middlewareDailyController,
    dailyController.dailyPage,
  );
  router.get(
    "/manager/listRecharge",
    dailyController.middlewareDailyController,
    dailyController.listRecharge,
  );
  router.get(
    "/manager/listWithdraw",
    dailyController.middlewareDailyController,
    dailyController.listWithdraw,
  );
  router.get(
    "/manager/members",
    dailyController.middlewareDailyController,
    dailyController.listMeber,
  );
  router.get(
    "/manager/profileMember",
    dailyController.middlewareDailyController,
    dailyController.profileMember,
  );
  router.get(
    "/manager/settings",
    dailyController.middlewareDailyController,
    dailyController.settingPage,
  );
  router.get(
    "/manager/gifts",
    dailyController.middlewareDailyController,
    dailyController.giftPage,
  );
  router.get(
    "/manager/support",
    dailyController.middlewareDailyController,
    dailyController.support,
  );
  router.get(
    "/manager/member/info/:phone",
    dailyController.middlewareDailyController,
    dailyController.pageInfo,
  );

  router.post(
    "/manager/member/info/:phone",
    dailyController.middlewareDailyController,
    dailyController.userInfo,
  );
  router.post(
    "/manager/member/listRecharge/:phone",
    dailyController.middlewareDailyController,
    dailyController.listRechargeMem,
  );
  router.post(
    "/manager/member/listWithdraw/:phone",
    dailyController.middlewareDailyController,
    dailyController.listWithdrawMem,
  );
  router.post(
    "/manager/member/redenvelope/:phone",
    dailyController.middlewareDailyController,
    dailyController.listRedenvelope,
  );
  router.post(
    "/manager/member/bet/:phone",
    dailyController.middlewareDailyController,
    dailyController.listBet,
  );

  router.post(
    "/manager/settings/list",
    dailyController.middlewareDailyController,
    dailyController.settings,
  );
  router.post(
    "/manager/createBonus",
    dailyController.middlewareDailyController,
    dailyController.createBonus,
  );
  router.post(
    "/manager/listRedenvelops",
    dailyController.middlewareDailyController,
    dailyController.listRedenvelops,
  );

  router.post(
    "/manager/listRecharge",
    dailyController.middlewareDailyController,
    dailyController.listRechargeP,
  );
  router.post(
    "/manager/listWithdraw",
    dailyController.middlewareDailyController,
    dailyController.listWithdrawP,
  );

  router.post(
    "/api/webapi/statistical",
    dailyController.middlewareDailyController,
    dailyController.statistical,
  );
  router.post(
    "/manager/infoCtv",
    dailyController.middlewareDailyController,
    dailyController.infoCtv,
  ); // get info account
  router.post(
    "/manager/infoCtv/select",
    dailyController.middlewareDailyController,
    dailyController.infoCtv2,
  ); // get info account
  router.post(
    "/api/webapi/manager/listMember",
    dailyController.middlewareDailyController,
    dailyController.listMember,
  ); // get info account

  router.post(
    "/api/webapi/manager/buff",
    dailyController.middlewareDailyController,
    dailyController.buffMoney,
  ); // get info account

  // admin
  router.get(
    "/admin/manager/index",
    adminController.middlewareAdminController,
    adminController.adminPage,
  ); // get info account
  router.get(
    "/admin/manager/index/3",
    adminController.middlewareAdminController,
    adminController.adminPage3,
  ); // get info account
  router.get(
    "/admin/manager/index/5",
    adminController.middlewareAdminController,
    adminController.adminPage5,
  ); // get info account
  router.get(
    "/admin/manager/index/10",
    adminController.middlewareAdminController,
    adminController.adminPage10,
  ); // get info account

  router.get(
    "/admin/manager/5d",
    adminController.middlewareAdminController,
    adminController.adminPage5d,
  ); // get info account
  router.get(
    "/admin/manager/k3",
    adminController.middlewareAdminController,
    adminController.adminPageK3,
  ); // get info account

  router.get(
    "/admin/manager/members",
    adminController.middlewareAdminController,
    adminController.membersPage,
  ); // get info account
  router.get(
    "/admin/manager/subordinate",
    adminController.middlewareAdminController,
    adminController.subordinatePage,
  ); // subordinate detail page
  router.get(
    "/admin/manager/createBonus",
    adminController.middlewareAdminController,
    adminController.giftPage,
  ); // get info account
  router.get(
    "/admin/manager/ctv",
    adminController.middlewareAdminController,
    adminController.ctvPage,
  ); // get info account
  router.get(
    "/admin/manager/ctv/profile/:phone",
    adminController.middlewareAdminController,
    adminController.ctvProfilePage,
  ); // get info account

  router.get(
    "/admin/manager/settings",
    adminController.middlewareAdminController,
    adminController.settings,
  ); // get info account
  router.get(
    "/admin/manager/listRedenvelops",
    adminController.middlewareAdminController,
    adminController.listRedenvelops,
  ); // get info account
  router.post(
    "/admin/manager/infoCtv",
    adminController.middlewareAdminController,
    adminController.infoCtv,
  ); // get info account
  router.post(
    "/admin/manager/infoCtv/select",
    adminController.middlewareAdminController,
    adminController.infoCtv2,
  ); // get info account
  router.post(
    "/admin/manager/settings/bank",
    adminController.middlewareAdminController,
    adminController.settingBank,
  ); // get info account
  router.post(
    "/admin/manager/settings/cskh",
    adminController.middlewareAdminController,
    adminController.settingCskh,
  ); // get info account
  router.post(
    "/admin/manager/settings/buff",
    adminController.middlewareAdminController,
    adminController.settingbuff,
  ); // get info account
  router.post(
    "/admin/manager/create/ctv",
    adminController.middlewareAdminController,
    adminController.register,
  ); // get info account
  router.post(
    "/admin/manager/settings/get",
    adminController.middlewareAdminController,
    adminController.settingGet,
  ); // get info account
  router.post(
    "/admin/manager/createBonus",
    adminController.middlewareAdminController,
    adminController.createBonus,
  ); // get info account

  router.post(
    "/admin/member/listRecharge/:phone",
    adminController.middlewareAdminController,
    adminController.listRechargeMem,
  );
  router.post(
    "/admin/member/listWithdraw/:phone",
    adminController.middlewareAdminController,
    adminController.listWithdrawMem,
  );
  router.post(
    "/admin/member/redenvelope/:phone",
    adminController.middlewareAdminController,
    adminController.listRedenvelope,
  );
  router.post(
    "/admin/member/bet/:phone",
    adminController.middlewareAdminController,
    adminController.listBet,
  );

  router.get(
    "/admin/manager/recharge",
    adminController.middlewareAdminController,
    adminController.rechargePage,
  ); // get info account
  router.get(
    "/admin/manager/withdraw",
    adminController.middlewareAdminController,
    adminController.withdraw,
  ); // get info account
  // router.get('/admin/manager/level', adminController.middlewareAdminController, adminController.level); // get info account
  router.get(
    "/admin/manager/levelSetting",
    adminController.middlewareAdminController,
    adminController.levelSetting,
  );
  router.get(
    "/admin/manager/CreatedSalaryRecord",
    adminController.middlewareAdminController,
    adminController.CreatedSalaryRecord,
  );
  router.get(
    "/admin/manager/DailySalaryEligibility",
    adminController.middlewareAdminController,
    adminController.DailySalaryEligibility,
  );
  // Old routes removed - migrated to newfinance pages
  router.get(
    "/admin/manager/statistical",
    adminController.middlewareAdminController,
    adminController.statistical,
  ); // get info account
  router.get(
    "/admin/member/info/:id",
    adminController.middlewareAdminController,
    adminController.infoMember,
  );
  router.get(
    "/api/webapi/admin/getLevelInfo",
    adminController.middlewareAdminController,
    adminController.getLevelInfo,
  );
  router.get(
    "/api/webapi/admin/getSalary",
    adminController.middlewareAdminController,
    adminController.getSalary,
  );
  router.post(
    "/api/webapi/admin/member/updateBank",
    adminController.middlewareAdminController,
    adminController.updateBank,
  );

  router.get(
    "/api/webapi/admin/listCheckSalaryEligibility",
    adminController.middlewareAdminController,
    adminController.listCheckSalaryEligibility,
  );

  router.post(
    "/api/webapi/admin/updateLevel",
    adminController.middlewareAdminController,
    adminController.updateLevel,
  ); // get info account
  router.post(
    "/api/webapi/admin/CreatedSalary",
    adminController.middlewareAdminController,
    adminController.CreatedSalary,
  ); // get info account
  router.post(
    "/api/webapi/admin/listMember",
    adminController.middlewareAdminController,
    adminController.listMember,
  ); // get info account
  router.post(
    "/api/webapi/admin/listctv",
    adminController.middlewareAdminController,
    adminController.listCTV,
  ); // get info account
  router.post(
    "/api/webapi/admin/withdraw",
    adminController.middlewareAdminController,
    adminController.handlWithdraw,
  ); // get info account
  router.post(
    "/api/webapi/admin/recharge",
    adminController.middlewareAdminController,
    adminController.recharge,
  ); // get info account
  router.post(
    "/api/webapi/admin/rechargeDuyet",
    adminController.middlewareAdminController,
    adminController.rechargeDuyet,
  ); // get info account
  router.post(
    "/api/webapi/admin/member/info",
    adminController.middlewareAdminController,
    adminController.userInfo,
  ); // get info account
  router.post(
    "/api/webapi/admin/statistical",
    adminController.middlewareAdminController,
    adminController.statistical2,
  ); // get info account
  router.get(
    "/api/webapi/admin/recharge/pending",
    adminController.middlewareAdminController,
    paymentController.browseRechargeRecord,
  ); // get info account
  router.post(
    "/api/webapi/admin/recharge/status",
    adminController.middlewareAdminController,
    paymentController.setRechargeStatus,
  ); // get info account

  router.post(
    "/api/webapi/admin/banned",
    adminController.middlewareAdminController,
    adminController.banned,
  ); // get info account

  router.post(
    "/api/webapi/admin/totalJoin",
    adminController.middlewareAdminController,
    adminController.totalJoin,
  ); // get info account
  router.post(
    "/api/webapi/admin/change",
    adminController.middlewareAdminController,
    adminController.changeAdmin,
  ); // get info account
  router.post(
    "/api/webapi/admin/profileUser",
    adminController.middlewareAdminController,
    adminController.profileUser,
  ); // get info account

  // admin 5d
  router.post(
    "/api/webapi/admin/5d/listOrders",
    adminController.middlewareAdminController,
    adminController.listOrderOld,
  ); // get info account
  router.post(
    "/api/webapi/admin/k3/listOrders",
    adminController.middlewareAdminController,
    adminController.listOrderOldK3,
  ); // get info account
  router.post(
    "/api/webapi/admin/5d/editResult",
    adminController.middlewareAdminController,
    adminController.editResult,
  ); // get info account
  router.post(
    "/api/webapi/admin/k3/editResult",
    adminController.middlewareAdminController,
    adminController.editResult2,
  ); // get info account

  // Website Settings Routes
  // Pages
  router.get("/admin/manager/setting/banner", adminController.middlewareAdminController, websiteDesignController.bannerUpdate);
  router.get("/admin/manager/setting/category-banner", adminController.middlewareAdminController, websiteDesignController.categoryBanner);
  router.get("/admin/manager/setting/activity-banner", adminController.middlewareAdminController, websiteDesignController.activityBanner);
  router.get("/admin/manager/setting/custom-activity-banner", adminController.middlewareAdminController, websiteDesignController.customActivityBanner);
  router.get("/admin/manager/setting/website", adminController.middlewareAdminController, websiteDesignController.websiteSetting);
  router.get("/admin/manager/setting/commission", adminController.middlewareAdminController, websiteDesignController.commissionSetting);
  router.get("/admin/manager/setting/deposit-bonus", adminController.middlewareAdminController, websiteDesignController.depositBonus);
  router.get("/admin/manager/setting/invite-bonus", adminController.middlewareAdminController, websiteDesignController.inviteBonus);
  router.get("/admin/manager/setting/bot-prediction", adminController.middlewareAdminController, websiteDesignController.botPrediction);
  router.get("/admin/manager/setting/user-wallet", adminController.middlewareAdminController, websiteDesignController.userWallet);
  router.get("/admin/manager/setting/welcome-message", adminController.middlewareAdminController, websiteDesignController.welcomeMessage);
  router.get("/admin/manager/setting/web-message", adminController.middlewareAdminController, websiteDesignController.webMessage);
  router.get("/admin/manager/setting/currency-lang", adminController.middlewareAdminController, websiteDesignController.currencyLang);
  router.get("/admin/manager/setting/css-editor", adminController.middlewareAdminController, websiteDesignController.cssEditor);

  // APIs
  // Category Banner
  router.get("/api/admin/setting/category-banner/list", adminController.middlewareAdminController, websiteDesignController.apiCategoryBannerList);
  router.post("/api/admin/setting/category-banner/create", adminController.middlewareAdminController, imageUpload.single("banner_image"), websiteDesignController.apiCategoryBannerCreate);
  router.post("/api/admin/setting/category-banner/delete/:id", adminController.middlewareAdminController, websiteDesignController.apiCategoryBannerDelete);

  // Banner
  router.get("/api/admin/setting/banner/list", adminController.middlewareAdminController, websiteDesignController.apiBannerList);
  router.post("/api/admin/setting/banner/create", adminController.middlewareAdminController, imageUpload.single("banner_image"), websiteDesignController.apiBannerCreate);
  router.post("/api/admin/setting/banner/update/:id", adminController.middlewareAdminController, websiteDesignController.apiBannerUpdate);
  router.post("/api/admin/setting/banner/delete/:id", adminController.middlewareAdminController, websiteDesignController.apiBannerDelete);

  // Activity Banner
  router.get("/api/admin/setting/activity-banner/list", adminController.middlewareAdminController, websiteDesignController.apiActivityBannerList);
  router.post("/api/admin/setting/activity-banner/create", adminController.middlewareAdminController, imageUpload.single("image"), websiteDesignController.apiActivityBannerCreate);
  router.post("/api/admin/setting/activity-banner/update/:id", adminController.middlewareAdminController, websiteDesignController.apiActivityBannerUpdate);
  router.post("/api/admin/setting/activity-banner/delete/:id", adminController.middlewareAdminController, websiteDesignController.apiActivityBannerDelete);

  // Custom Banner
  router.get("/api/admin/setting/custom-banner/list", adminController.middlewareAdminController, websiteDesignController.apiCustomBannerList);
  router.post("/api/admin/setting/custom-banner/create", adminController.middlewareAdminController, imageUpload.single("cover_image"), websiteDesignController.apiCustomBannerCreate);
  router.post("/api/admin/setting/custom-banner/update/:id", adminController.middlewareAdminController, websiteDesignController.apiCustomBannerUpdate);
  router.post("/api/admin/setting/custom-banner/delete/:id", adminController.middlewareAdminController, websiteDesignController.apiCustomBannerDelete);

  // Website Settings
  router.get("/api/admin/setting/website/get", adminController.middlewareAdminController, websiteDesignController.apiSettingsGet);
  router.post("/api/admin/setting/website/save", adminController.middlewareAdminController, imageUpload.fields([{ name: 'website_logo', maxCount: 1 }, { name: 'favicon_logo', maxCount: 1 }]), websiteDesignController.apiSettingsSave);

  // Commission
  router.get("/api/admin/setting/commission/get", adminController.middlewareAdminController, websiteDesignController.apiCommissionGet);
  router.post("/api/admin/setting/commission/save", adminController.middlewareAdminController, websiteDesignController.apiCommissionSave);

  // Deposit Bonus
  router.get("/api/admin/setting/deposit-bonus/list", adminController.middlewareAdminController, websiteDesignController.apiDepositBonusList);
  router.post("/api/admin/setting/deposit-bonus/create", adminController.middlewareAdminController, websiteDesignController.apiDepositBonusCreate);
  router.post("/api/admin/setting/deposit-bonus/update/:id", adminController.middlewareAdminController, websiteDesignController.apiDepositBonusUpdate);
  router.post("/api/admin/setting/deposit-bonus/delete/:id", adminController.middlewareAdminController, websiteDesignController.apiDepositBonusDelete);

  // Invite Bonus
  router.get("/api/admin/setting/invite-bonus/list", adminController.middlewareAdminController, websiteDesignController.apiInviteTaskList);
  router.post("/api/admin/setting/invite-bonus/create", adminController.middlewareAdminController, websiteDesignController.apiInviteTaskCreate);
  router.post("/api/admin/setting/invite-bonus/update/:id", adminController.middlewareAdminController, websiteDesignController.apiInviteTaskUpdate);
  router.post("/api/admin/setting/invite-bonus/delete/:id", adminController.middlewareAdminController, websiteDesignController.apiInviteTaskDelete);

  // Welcome Message
  router.get("/api/admin/setting/welcome-message/get", adminController.middlewareAdminController, websiteDesignController.apiWelcomeMessageGet);
  router.post("/api/admin/setting/welcome-message/save", adminController.middlewareAdminController, websiteDesignController.apiWelcomeMessageSave);

  // Currency & Language
  router.get("/api/admin/setting/currency-lang/list", adminController.middlewareAdminController, websiteDesignController.apiLangCurrencyList);
  router.post("/api/admin/setting/currency-lang/create", adminController.middlewareAdminController, imageUpload.single("flag"), websiteDesignController.apiLangCurrencyCreate);
  router.post("/api/admin/setting/currency-lang/update/:id", adminController.middlewareAdminController, websiteDesignController.apiLangCurrencyUpdate);
  router.post("/api/admin/setting/currency-lang/delete/:id", adminController.middlewareAdminController, websiteDesignController.apiLangCurrencyDelete);
  router.post("/api/admin/setting/currency-lang/set-default/:id", adminController.middlewareAdminController, websiteDesignController.apiLangCurrencySetDefault);

  // User Wallet
  router.get("/api/admin/setting/user-wallet/search", adminController.middlewareAdminController, websiteDesignController.apiUserSearch);
  router.post("/api/admin/setting/user-wallet/update-balance/:id", adminController.middlewareAdminController, websiteDesignController.apiUserUpdateBalance);

  // ============== NEW FINANCE ROUTES ==============
  // Page routes
  router.get(
    "/admin/manager/newfinance/upi",
    adminController.middlewareAdminController,
    adminController.newupi,
  );
  router.get(
    "/admin/manager/newfinance/usdt",
    adminController.middlewareAdminController,
    adminController.newusdt,
  );
  router.get(
    "/admin/manager/newfinance/usdtrate",
    adminController.middlewareAdminController,
    adminController.newusdtrate,
  );
  router.get(
    "/admin/manager/newfinance/depositupdate",
    adminController.middlewareAdminController,
    adminController.newdepositupdate,
  );
  router.get(
    "/admin/manager/newfinance/withdrawal",
    adminController.middlewareAdminController,
    adminController.newwithdrawl,
  );
  router.get(
    "/admin/manager/newfinance/withdrawalaccepted",
    adminController.middlewareAdminController,
    adminController.newwidthdrawalaccepted,
  );
  router.get(
    "/admin/manager/newfinance/withdrawalrejected",
    adminController.middlewareAdminController,
    adminController.newwithdrawalrejected,
  );
  router.get(
    "/admin/manager/newfinance/updategateway",
    adminController.middlewareAdminController,
    adminController.newupdategetway,
  );
  router.get(
    "/admin/manager/newfinance/paymentgateway",
    adminController.middlewareAdminController,
    adminController.newpaymentgetway,
  );
  router.get(
    "/admin/manager/newfinance/withdrawalrules",
    adminController.middlewareAdminController,
    adminController.newwithdrawlrules,
  );

  // Payment Gateway API routes
  router.get(
    "/api/admin/newfinance/gateways",
    adminController.middlewareAdminController,
    adminController.getPaymentGateways,
  );
  router.post(
    "/api/admin/newfinance/gateways/save",
    adminController.middlewareAdminController,
    adminController.savePaymentGateway,
  );
  router.post(
    "/api/admin/newfinance/gateways/delete",
    adminController.middlewareAdminController,
    adminController.deletePaymentGateway,
  );
  router.post(
    "/api/admin/newfinance/gateways/update-status",
    adminController.middlewareAdminController,
    adminController.updateGatewayStatus,
  );


  // UPI Management API routes
  router.get(
    "/api/admin/newfinance/upi/list",
    adminController.middlewareAdminController,
    adminController.getUPIList,
  );
  router.post(
    "/api/admin/newfinance/upi/add",
    adminController.middlewareAdminController,
    adminController.addUPI,
  );
  router.post(
    "/api/admin/newfinance/upi/delete",
    adminController.middlewareAdminController,
    adminController.deleteUPI,
  );
  router.post(
    "/api/admin/newfinance/upi/set-active",
    adminController.middlewareAdminController,
    adminController.setActiveUPI,
  );
  router.get(
    "/api/admin/newfinance/upi/images",
    adminController.middlewareAdminController,
    adminController.getUPIImages,
  );
  router.post(
    "/api/admin/newfinance/upi/upload",
    adminController.middlewareAdminController,
    upiImageUpload.single("image"),
    adminController.uploadUPIImage,
  );
  router.post(
    "/api/admin/newfinance/upi/image/delete",
    adminController.middlewareAdminController,
    adminController.deleteUPIImage,
  );
  router.post(
    "/api/admin/newfinance/upi/image/set-active",
    adminController.middlewareAdminController,
    adminController.setActiveImage,
  );
  // ================================================

  // USDT Management API routes
  router.get(
    "/api/admin/newfinance/usdt/list",
    adminController.middlewareAdminController,
    adminController.getUSDTList,
  );
  router.post(
    "/api/admin/newfinance/usdt/add",
    adminController.middlewareAdminController,
    adminController.addUSDT,
  );
  router.post(
    "/api/admin/newfinance/usdt/delete",
    adminController.middlewareAdminController,
    adminController.deleteUSDT,
  );
  router.post(
    "/api/admin/newfinance/usdt/set-active",
    adminController.middlewareAdminController,
    adminController.setActiveUSDT,
  );
  router.get(
    "/api/admin/newfinance/usdt/images",
    adminController.middlewareAdminController,
    adminController.getUSDTImages,
  );
  router.post(
    "/api/admin/newfinance/usdt/upload",
    adminController.middlewareAdminController,
    usdtImageUpload.single("image"),
    adminController.uploadUSDTImage,
  );
  router.post(
    "/api/admin/newfinance/usdt/image/delete",
    adminController.middlewareAdminController,
    adminController.deleteUSDTImage,
  );
  router.post(
    "/api/admin/newfinance/usdt/image/set-active",
    adminController.middlewareAdminController,
    adminController.setActiveUSDTImage,
  );
  router.get(
    "/api/admin/newfinance/usdt/rate",
    adminController.middlewareAdminController,
    adminController.getUSDTRate,
  );
  router.post(
    "/api/admin/newfinance/usdt/rate",
    adminController.middlewareAdminController,
    adminController.setUSDTRate,
  );
  router.get(
    "/admin/api/withdrawal-rules",
    adminController.middlewareAdminController,
    adminController.getWithdrawalRules,
  );
  router.post(
    "/admin/api/withdrawal-rules",
    adminController.middlewareAdminController,
    adminController.saveWithdrawalRules,
  );

  return app.use("/", router);
};

const routes = {
  initWebRouter,
};

export default routes;
