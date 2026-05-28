import connection from "../config/connectDB.js";

const settingsModel = {
  // ==================== SITE BANNERS ====================
  banners: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM site_banners ORDER BY position ASC, id DESC"
      );
      return rows;
    },
    create: async (data) => {
      const { banner_image, redirect_url, position = 0 } = data;
      const [result] = await connection.execute(
        "INSERT INTO site_banners (banner_image, redirect_url, position) VALUES (?, ?, ?)",
        [banner_image, redirect_url || "", position]
      );
      return result;
    },
    update: async (id, data) => {
      const { redirect_url, position, is_active } = data;
      const [result] = await connection.execute(
        "UPDATE site_banners SET redirect_url = ?, position = ?, is_active = ? WHERE id = ?",
        [redirect_url, position, is_active, id]
      );
      return result;
    },
    delete: async (id) => {
      const [result] = await connection.execute(
        "DELETE FROM site_banners WHERE id = ?",
        [id]
      );
      return result;
    },
  },

  // ==================== ACTIVITY BANNERS ====================
  activityBanners: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM activity_banners ORDER BY id DESC"
      );
      return rows;
    },
    create: async (data) => {
      const { banner_id, title, image_url, jump_type, redirect_url, content } = data;
      const [result] = await connection.execute(
        `INSERT INTO activity_banners (banner_id, title, image_url, jump_type, redirect_url, content) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [banner_id, title, image_url, jump_type, redirect_url || "", content || ""]
      );
      return result;
    },
    update: async (id, data) => {
      const { title, image_url, jump_type, redirect_url, content, is_active } = data;
      const [result] = await connection.execute(
        `UPDATE activity_banners SET title = ?, image_url = ?, jump_type = ?, 
         redirect_url = ?, content = ?, is_active = ? WHERE id = ?`,
        [title, image_url, jump_type, redirect_url, content, is_active, id]
      );
      return result;
    },
    delete: async (id) => {
      const [result] = await connection.execute(
        "DELETE FROM activity_banners WHERE id = ?",
        [id]
      );
      return result;
    },
  },

  // ==================== CUSTOM ACTIVITY BANNERS ====================
  customBanners: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM custom_activity_banners ORDER BY id DESC"
      );
      return rows;
    },
    create: async (data) => {
      const { banner_id, title, description, jump_type, content_type, content, cover_url } = data;
      const [result] = await connection.execute(
        `INSERT INTO custom_activity_banners (banner_id, title, description, jump_type, content_type, content, cover_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [banner_id, title, description, jump_type, content_type, content, cover_url]
      );
      return result;
    },
    update: async (id, data) => {
      const { title, description, jump_type, content_type, content, cover_url, is_active } = data;
      const [result] = await connection.execute(
        `UPDATE custom_activity_banners SET title = ?, description = ?, jump_type = ?, 
         content_type = ?, content = ?, cover_url = ?, is_active = ? WHERE id = ?`,
        [title, description, jump_type, content_type, content, cover_url, is_active, id]
      );
      return result;
    },
    delete: async (id) => {
      const [result] = await connection.execute(
        "DELETE FROM custom_activity_banners WHERE id = ?",
        [id]
      );
      return result;
    },
  },

  // ==================== SITE SETTINGS ====================
  siteSettings: {
    getAll: async () => {
      const [rows] = await connection.execute("SELECT * FROM site_settings");
      const settings = {};
      rows.forEach((row) => {
        settings[row.setting_key] = row.setting_value;
      });
      return settings;
    },
    get: async (key) => {
      const [rows] = await connection.execute(
        "SELECT setting_value FROM site_settings WHERE setting_key = ?",
        [key]
      );
      return rows[0]?.setting_value || null;
    },
    set: async (key, value) => {
      const [result] = await connection.execute(
        `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, value, value]
      );
      return result;
    },
    setMultiple: async (settings) => {
      for (const [key, value] of Object.entries(settings)) {
        await connection.execute(
          `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE setting_value = ?`,
          [key, value, value]
        );
      }
      return true;
    },
  },

  // ==================== COMMISSION LEVELS ====================
  commissions: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM commission_levels ORDER BY level ASC"
      );
      return rows;
    },
    update: async (level, commission_percent) => {
      const [result] = await connection.execute(
        `INSERT INTO commission_levels (level, commission_percent) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE commission_percent = ?`,
        [level, commission_percent, commission_percent]
      );
      return result;
    },
    updateAll: async (levels) => {
      for (const { level, commission_percent } of levels) {
        await connection.execute(
          `INSERT INTO commission_levels (level, commission_percent) VALUES (?, ?)
           ON DUPLICATE KEY UPDATE commission_percent = ?`,
          [level, commission_percent, commission_percent]
        );
      }
      return true;
    },
  },

  // ==================== DEPOSIT BONUSES ====================
  depositBonuses: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM deposit_bonuses ORDER BY recharge_amount ASC"
      );
      return rows;
    },
    create: async (data) => {
      const { recharge_amount, reward_amount, validity_days } = data;
      const [result] = await connection.execute(
        "INSERT INTO deposit_bonuses (recharge_amount, reward_amount, validity_days) VALUES (?, ?, ?)",
        [recharge_amount, reward_amount, validity_days || 7]
      );
      return result;
    },
    update: async (id, data) => {
      const { recharge_amount, reward_amount, validity_days, is_active } = data;
      const [result] = await connection.execute(
        "UPDATE deposit_bonuses SET recharge_amount = ?, reward_amount = ?, validity_days = ?, is_active = ? WHERE id = ?",
        [recharge_amount, reward_amount, validity_days, is_active, id]
      );
      return result;
    },
    delete: async (id) => {
      const [result] = await connection.execute(
        "DELETE FROM deposit_bonuses WHERE id = ?",
        [id]
      );
      return result;
    },
  },

  // ==================== INVITE TASKS ====================
  inviteTasks: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM invite_tasks ORDER BY task_number ASC"
      );
      return rows;
    },
    create: async (data) => {
      const { task_number, task_people, recharge_amount, task_amount } = data;
      const [result] = await connection.execute(
        `INSERT INTO invite_tasks (task_number, task_people, recharge_amount, task_amount) 
         VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE 
         task_people = ?, recharge_amount = ?, task_amount = ?`,
        [task_number, task_people, recharge_amount, task_amount, task_people, recharge_amount, task_amount]
      );
      return result;
    },
    update: async (id, data) => {
      const { task_people, recharge_amount, task_amount, is_active } = data;
      const [result] = await connection.execute(
        "UPDATE invite_tasks SET task_people = ?, recharge_amount = ?, task_amount = ?, is_active = ? WHERE id = ?",
        [task_people, recharge_amount, task_amount, is_active, id]
      );
      return result;
    },
    delete: async (id) => {
      const [result] = await connection.execute(
        "DELETE FROM invite_tasks WHERE id = ?",
        [id]
      );
      return result;
    },
  },

  // ==================== WELCOME MESSAGES ====================
  welcomeMessage: {
    get: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM welcome_messages WHERE is_active = 1 LIMIT 1"
      );
      return rows[0] || null;
    },
    getAll: async () => {
      const [rows] = await connection.execute("SELECT * FROM welcome_messages ORDER BY id DESC");
      return rows;
    },
    save: async (data) => {
      const {
        popup_title, popup_heading, announcement, body_message,
        telegram_text, reward_text, vip_link, is_active = 1
      } = data;
      // First deactivate all, then insert/update
      await connection.execute("UPDATE welcome_messages SET is_active = 0");
      const [result] = await connection.execute(
        `INSERT INTO welcome_messages (popup_title, popup_heading, announcement, body_message, 
         telegram_text, reward_text, vip_link, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [popup_title, popup_heading, announcement, body_message, telegram_text, reward_text, vip_link, is_active]
      );
      return result;
    },
    update: async (id, data) => {
      const {
        popup_title, popup_heading, announcement, body_message,
        telegram_text, reward_text, vip_link, is_active
      } = data;
      const [result] = await connection.execute(
        `UPDATE welcome_messages SET popup_title = ?, popup_heading = ?, announcement = ?, 
         body_message = ?, telegram_text = ?, reward_text = ?, vip_link = ?, is_active = ? WHERE id = ?`,
        [popup_title, popup_heading, announcement, body_message, telegram_text, reward_text, vip_link, is_active, id]
      );
      return result;
    },
  },

  // ==================== LANGUAGES & CURRENCIES ====================
  langCurrency: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM languages_currencies ORDER BY is_default DESC, id ASC"
      );
      return rows;
    },
    create: async (data) => {
      const { lang_code, lang_name, flag_url, currency_code, currency_symbol, currency_name, is_default } = data;
      if (is_default) {
        await connection.execute("UPDATE languages_currencies SET is_default = 0");
      }
      const [result] = await connection.execute(
        `INSERT INTO languages_currencies (lang_code, lang_name, flag_url, currency_code, currency_symbol, currency_name, is_default) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [lang_code, lang_name, flag_url || "", currency_code, currency_symbol, currency_name, is_default ? 1 : 0]
      );
      return result;
    },
    update: async (id, data) => {
      const { lang_code, lang_name, flag_url, currency_code, currency_symbol, currency_name, is_default, is_active } = data;
      if (is_default) {
        await connection.execute("UPDATE languages_currencies SET is_default = 0");
      }
      const [result] = await connection.execute(
        `UPDATE languages_currencies SET lang_code = ?, lang_name = ?, flag_url = ?, 
         currency_code = ?, currency_symbol = ?, currency_name = ?, is_default = ?, is_active = ? WHERE id = ?`,
        [lang_code, lang_name, flag_url, currency_code, currency_symbol, currency_name, is_default ? 1 : 0, is_active, id]
      );
      return result;
    },
    delete: async (id) => {
      const [result] = await connection.execute(
        "DELETE FROM languages_currencies WHERE id = ?",
        [id]
      );
      return result;
    },
    setDefault: async (id) => {
      await connection.execute("UPDATE languages_currencies SET is_default = 0");
      const [result] = await connection.execute(
        "UPDATE languages_currencies SET is_default = 1 WHERE id = ?",
        [id]
      );
      return result;
    },
  },

  // ==================== CATEGORY BANNERS ====================
  categoryBanners: {
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT * FROM category_banners ORDER BY category ASC, id DESC"
      );
      return rows;
    },
    getByCategory: async (category) => {
      const [rows] = await connection.execute(
        "SELECT * FROM category_banners WHERE category = ? AND is_active = 1 ORDER BY id DESC",
        [category]
      );
      return rows;
    },
    create: async (data) => {
      const { category, banner_name = "", banner_image, redirect_url = "" } = data;
      const [result] = await connection.execute(
        "INSERT INTO category_banners (category, banner_name, banner_image, redirect_url) VALUES (?, ?, ?, ?)",
        [category, banner_name, banner_image, redirect_url]
      );
      return result;
    },
    delete: async (id) => {
      const [result] = await connection.execute(
        "DELETE FROM category_banners WHERE id = ?",
        [id]
      );
      return result;
    },
  },

  // ==================== USER WALLET (for search) ====================
  users: {
    search: async (query) => {
      const [rows] = await connection.execute(
        `SELECT id, phone, money, money_demo FROM users 
         WHERE id = ? OR phone LIKE ? LIMIT 50`,
        [query, `%${query}%`]
      );
      return rows;
    },
    getAll: async () => {
      const [rows] = await connection.execute(
        "SELECT id, phone, money, money_demo FROM users ORDER BY id DESC LIMIT 100"
      );
      return rows;
    },
    updateBalance: async (id, amount, type, remark) => {
      const operator = type === "add" ? "+" : "-";
      const [result] = await connection.execute(
        `UPDATE users SET money = money ${operator} ? WHERE id = ?`,
        [Math.abs(amount), id]
      );
      return result;
    },
  },
};

export default settingsModel;
