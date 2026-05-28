import connection from "../config/connectDB.js";
import settingsModel from "../models/settingsModel.js";
import path from "path";
import fs from "fs";

const timeNow = new Date().toISOString();

// ==================== PAGE RENDERS ====================

// Banner Update Page
const bannerUpdate = async (req, res) => {
  try {
    const banners = await settingsModel.banners.getAll();
    return res.render("manage/setting/banner_update.ejs", { banners });
  } catch (error) {
    return res.render("manage/setting/banner_update.ejs", { banners: [] });
  }
};

// Category Banner Update Page
const categoryBanner = async (req, res) => {
  try {
    const banners = await settingsModel.categoryBanners.getAll();
    return res.render("manage/setting/category_banner.ejs", { banners });
  } catch (error) {
    return res.render("manage/setting/category_banner.ejs", { banners: [] });
  }
};

// Activity Banner Page
const activityBanner = async (req, res) => {
  try {
    const banners = await settingsModel.activityBanners.getAll();
    return res.render("manage/setting/activity_banner.ejs", { banners });
  } catch (error) {
    return res.render("manage/setting/activity_banner.ejs", { banners: [] });
  }
};

// Category Banner APIs
const apiCategoryBannerList = async (req, res) => {
  try {
    const { category } = req.query;
    const banners = category
      ? await settingsModel.categoryBanners.getByCategory(category)
      : await settingsModel.categoryBanners.getAll();
    return res.json({ status: true, data: banners });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiCategoryBannerCreate = async (req, res) => {
  try {
    const { category, banner_name, redirect_url } = req.body;
    if (!category) return res.json({ status: false, message: "Category is required" });
    let banner_image = "";
    if (req.file) {
      banner_image = req.protocol + "://" + req.get("host") + "/assets/png/" + req.file.filename;
    } else {
      return res.json({ status: false, message: "Banner image is required" });
    }
    await settingsModel.categoryBanners.create({ category, banner_name, banner_image, redirect_url });
    return res.json({ status: true, message: "Category banner uploaded successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiCategoryBannerDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.categoryBanners.delete(id);
    return res.json({ status: true, message: "Category banner deleted successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Custom Activity Banner Page
const customActivityBanner = async (req, res) => {
  try {
    const banners = await settingsModel.customBanners.getAll();
    return res.render("manage/setting/custom_activity_banner.ejs", { banners });
  } catch (error) {
    return res.render("manage/setting/custom_activity_banner.ejs", { banners: [] });
  }
};

// Website Setting Page
const websiteSetting = async (req, res) => {
  try {
    const settings = await settingsModel.siteSettings.getAll();
    return res.render("manage/setting/website_setting.ejs", { settings });
  } catch (error) {
    return res.render("manage/setting/website_setting.ejs", { settings: {} });
  }
};

// Commission Setting Page
const commissionSetting = async (req, res) => {
  try {
    const levels = await settingsModel.commissions.getAll();
    return res.render("manage/setting/commission_setting.ejs", { levels });
  } catch (error) {
    return res.render("manage/setting/commission_setting.ejs", { levels: [] });
  }
};

// Deposit Bonus Setting Page
const depositBonus = async (req, res) => {
  try {
    const bonuses = await settingsModel.depositBonuses.getAll();
    return res.render("manage/setting/deposit_bonus.ejs", { bonuses });
  } catch (error) {
    return res.render("manage/setting/deposit_bonus.ejs", { bonuses: [] });
  }
};

// Invite Bonus Setting Page
const inviteBonus = async (req, res) => {
  try {
    const tasks = await settingsModel.inviteTasks.getAll();
    return res.render("manage/setting/invite_bonus.ejs", { tasks });
  } catch (error) {
    return res.render("manage/setting/invite_bonus.ejs", { tasks: [] });
  }
};

// Bot Prediction Page
const botPrediction = async (req, res) => {
  return res.render("manage/setting/bot_prediction.ejs");
};

// User Wallet Management Page
const userWallet = async (req, res) => {
  try {
    const users = await settingsModel.users.getAll();
    return res.render("manage/setting/user_wallet.ejs", { users });
  } catch (error) {
    return res.render("manage/setting/user_wallet.ejs", { users: [] });
  }
};

// Site Welcome Message Page
const welcomeMessage = async (req, res) => {
  try {
    const message = await settingsModel.welcomeMessage.get();
    return res.render("manage/setting/welcome_message.ejs", { message });
  } catch (error) {
    return res.render("manage/setting/welcome_message.ejs", { message: null });
  }
};

// Site Web Message Page
const webMessage = async (req, res) => {
  return res.render("manage/setting/web_message.ejs");
};

// Currency & Language Page
const currencyLang = async (req, res) => {
  try {
    const languages = await settingsModel.langCurrency.getAll();
    return res.render("manage/setting/currency_lang.ejs", { languages });
  } catch (error) {
    return res.render("manage/setting/currency_lang.ejs", { languages: [] });
  }
};

// CSS Editor Page
const cssEditor = async (req, res) => {
  return res.render("manage/setting/css_editor.ejs");
};

// ==================== API HANDLERS ====================

// Banner APIs
const apiBannerList = async (req, res) => {
  try {
    const banners = await settingsModel.banners.getAll();
    return res.json({ status: true, data: banners });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiBannerCreate = async (req, res) => {
  try {
    const { redirect_url, position } = req.body;
    let banner_image = "";
    if (req.file) {
      banner_image = req.protocol + "://" + req.get("host") + "/assets/png/" + req.file.filename;
    }
    await settingsModel.banners.create({ banner_image, redirect_url, position });
    return res.json({ status: true, message: "Banner created successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiBannerUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { redirect_url, position, is_active } = req.body;
    await settingsModel.banners.update(id, { redirect_url, position, is_active });
    return res.json({ status: true, message: "Banner updated successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiBannerDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.banners.delete(id);
    return res.json({ status: true, message: "Banner deleted successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Activity Banner APIs
const apiActivityBannerList = async (req, res) => {
  try {
    const banners = await settingsModel.activityBanners.getAll();
    return res.json({ status: true, data: banners });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiActivityBannerCreate = async (req, res) => {
  try {
    const { banner_id, title, jump_type, redirect_url, content } = req.body;
    let image_url = "";
    if (req.file) {
      image_url = req.protocol + "://" + req.get("host") + "/assets/png/" + req.file.filename;
    }
    await settingsModel.activityBanners.create({ banner_id, title, image_url, jump_type, redirect_url, content });
    return res.json({ status: true, message: "Activity banner created successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiActivityBannerUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, jump_type, redirect_url, content, is_active } = req.body;
    await settingsModel.activityBanners.update(id, { title, image_url, jump_type, redirect_url, content, is_active });
    return res.json({ status: true, message: "Activity banner updated successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiActivityBannerDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.activityBanners.delete(id);
    return res.json({ status: true, message: "Activity banner deleted successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Custom Banner APIs
const apiCustomBannerList = async (req, res) => {
  try {
    const banners = await settingsModel.customBanners.getAll();
    return res.json({ status: true, data: banners });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiCustomBannerCreate = async (req, res) => {
  try {
    const { banner_id, title, description, jump_type, content_type, content } = req.body;
    let cover_url = "";
    if (req.file) {
      cover_url = req.protocol + "://" + req.get("host") + "/assets/png/" + req.file.filename;
    }
    await settingsModel.customBanners.create({ banner_id, title, description, jump_type, content_type, content, cover_url });
    return res.json({ status: true, message: "Custom banner created successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiCustomBannerUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await settingsModel.customBanners.update(id, data);
    return res.json({ status: true, message: "Custom banner updated successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiCustomBannerDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.customBanners.delete(id);
    return res.json({ status: true, message: "Custom banner deleted successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Site Settings APIs
const apiSettingsGet = async (req, res) => {
  try {
    const settings = await settingsModel.siteSettings.getAll();
    return res.json({ status: true, data: settings });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiSettingsSave = async (req, res) => {
  try {
    const settings = req.body;
    // Handle file uploads for logo and favicon
    if (req.files) {
      if (req.files.website_logo) {
        settings.website_logo = req.protocol + "://" + req.get("host") + "/assets/png/" + req.files.website_logo[0].filename;
      }
      if (req.files.favicon_logo) {
        settings.favicon_logo = req.protocol + "://" + req.get("host") + "/assets/png/" + req.files.favicon_logo[0].filename;
      }
    }
    await settingsModel.siteSettings.setMultiple(settings);
    return res.json({ status: true, message: "Settings saved successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Commission APIs
const apiCommissionGet = async (req, res) => {
  try {
    const levels = await settingsModel.commissions.getAll();
    return res.json({ status: true, data: levels });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiCommissionSave = async (req, res) => {
  try {
    const { levels } = req.body;
    await settingsModel.commissions.updateAll(levels);
    return res.json({ status: true, message: "Commission levels saved successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Deposit Bonus APIs
const apiDepositBonusList = async (req, res) => {
  try {
    const bonuses = await settingsModel.depositBonuses.getAll();
    return res.json({ status: true, data: bonuses });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiDepositBonusCreate = async (req, res) => {
  try {
    const data = req.body;
    await settingsModel.depositBonuses.create(data);
    return res.json({ status: true, message: "Deposit bonus created successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiDepositBonusUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await settingsModel.depositBonuses.update(id, data);
    return res.json({ status: true, message: "Deposit bonus updated successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiDepositBonusDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.depositBonuses.delete(id);
    return res.json({ status: true, message: "Deposit bonus deleted successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Invite Task APIs
const apiInviteTaskList = async (req, res) => {
  try {
    const tasks = await settingsModel.inviteTasks.getAll();
    return res.json({ status: true, data: tasks });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiInviteTaskCreate = async (req, res) => {
  try {
    const data = req.body;
    await settingsModel.inviteTasks.create(data);
    return res.json({ status: true, message: "Invite task created successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiInviteTaskUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await settingsModel.inviteTasks.update(id, data);
    return res.json({ status: true, message: "Invite task updated successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiInviteTaskDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.inviteTasks.delete(id);
    return res.json({ status: true, message: "Invite task deleted successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Welcome Message APIs
const apiWelcomeMessageGet = async (req, res) => {
  try {
    const message = await settingsModel.welcomeMessage.get();
    return res.json({ status: true, data: message });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiWelcomeMessageSave = async (req, res) => {
  try {
    const data = req.body;
    await settingsModel.welcomeMessage.save(data);
    return res.json({ status: true, message: "Welcome message saved successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// Language & Currency APIs
const apiLangCurrencyList = async (req, res) => {
  try {
    const languages = await settingsModel.langCurrency.getAll();
    return res.json({ status: true, data: languages });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiLangCurrencyCreate = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.flag_url = req.protocol + "://" + req.get("host") + "/assets/png/" + req.file.filename;
    }
    await settingsModel.langCurrency.create(data);
    return res.json({ status: true, message: "Language/Currency created successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiLangCurrencyUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await settingsModel.langCurrency.update(id, data);
    return res.json({ status: true, message: "Language/Currency updated successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiLangCurrencyDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.langCurrency.delete(id);
    return res.json({ status: true, message: "Language/Currency deleted successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiLangCurrencySetDefault = async (req, res) => {
  try {
    const { id } = req.params;
    await settingsModel.langCurrency.setDefault(id);
    return res.json({ status: true, message: "Default language set successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

// User Wallet APIs
const apiUserSearch = async (req, res) => {
  try {
    const { query } = req.query;
    const users = query ? await settingsModel.users.search(query) : await settingsModel.users.getAll();
    return res.json({ status: true, data: users });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const apiUserUpdateBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, remark } = req.body;
    await settingsModel.users.updateBalance(id, amount, type, remark);
    return res.json({ status: true, message: "Balance updated successfully" });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

const websiteDesignController = {
  // Page renders
  bannerUpdate,
  categoryBanner,
  activityBanner,
  customActivityBanner,
  websiteSetting,
  commissionSetting,
  depositBonus,
  inviteBonus,
  botPrediction,
  userWallet,
  welcomeMessage,
  webMessage,
  currencyLang,
  cssEditor,
  // Category Banner APIs
  apiCategoryBannerList,
  apiCategoryBannerCreate,
  apiCategoryBannerDelete,
  // Banner APIs
  apiBannerList,
  apiBannerCreate,
  apiBannerUpdate,
  apiBannerDelete,
  // Activity Banner APIs
  apiActivityBannerList,
  apiActivityBannerCreate,
  apiActivityBannerUpdate,
  apiActivityBannerDelete,
  // Custom Banner APIs
  apiCustomBannerList,
  apiCustomBannerCreate,
  apiCustomBannerUpdate,
  apiCustomBannerDelete,
  // Site Settings APIs
  apiSettingsGet,
  apiSettingsSave,
  // Commission APIs
  apiCommissionGet,
  apiCommissionSave,
  // Deposit Bonus APIs
  apiDepositBonusList,
  apiDepositBonusCreate,
  apiDepositBonusUpdate,
  apiDepositBonusDelete,
  // Invite Task APIs
  apiInviteTaskList,
  apiInviteTaskCreate,
  apiInviteTaskUpdate,
  apiInviteTaskDelete,
  // Welcome Message APIs
  apiWelcomeMessageGet,
  apiWelcomeMessageSave,
  // Language & Currency APIs
  apiLangCurrencyList,
  apiLangCurrencyCreate,
  apiLangCurrencyUpdate,
  apiLangCurrencyDelete,
  apiLangCurrencySetDefault,
  // User Wallet APIs
  apiUserSearch,
  apiUserUpdateBalance,
};

export default websiteDesignController;
