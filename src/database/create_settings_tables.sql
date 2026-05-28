-- Website Settings Tables
-- Run this SQL file to create all required tables

-- Site Banners Table
CREATE TABLE IF NOT EXISTS site_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  banner_image VARCHAR(500) NOT NULL,
  redirect_url VARCHAR(500),
  position INT DEFAULT 0,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Banners Table
CREATE TABLE IF NOT EXISTS activity_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  banner_id VARCHAR(50) UNIQUE,
  title VARCHAR(255),
  image_url VARCHAR(500),
  jump_type ENUM('internal', 'external') DEFAULT 'internal',
  redirect_url VARCHAR(500),
  content TEXT,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom Activity Banners Table
CREATE TABLE IF NOT EXISTS custom_activity_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  banner_id VARCHAR(50) UNIQUE,
  title VARCHAR(255),
  description TEXT,
  jump_type ENUM('internal', 'external') DEFAULT 'internal',
  content_type ENUM('image', 'html', 'json') DEFAULT 'image',
  content TEXT,
  cover_url VARCHAR(500),
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings Table (Key-Value Store)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('bet_allowed', '1'),
  ('min_deposit', '100'),
  ('max_deposit', '100000'),
  ('min_withdrawal', '200'),
  ('max_withdrawal', '50000'),
  ('register_bonus', '0'),
  ('app_download_url', ''),
  ('telegram_active', '0'),
  ('telegram_link', ''),
  ('website_name', '6Club'),
  ('website_logo', ''),
  ('favicon_logo', '')
ON DUPLICATE KEY UPDATE setting_key = setting_key;

-- Commission Levels Table
CREATE TABLE IF NOT EXISTS commission_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level INT UNIQUE NOT NULL,
  commission_percent DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default 6 levels
INSERT INTO commission_levels (level, commission_percent) VALUES
  (1, 5.00), (2, 3.00), (3, 1.00), (4, 0.50), (5, 0.30), (6, 0.10)
ON DUPLICATE KEY UPDATE level = level;

-- Deposit Bonuses Table
CREATE TABLE IF NOT EXISTS deposit_bonuses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recharge_amount DECIMAL(10,2) NOT NULL,
  reward_amount DECIMAL(10,2) NOT NULL,
  validity_days INT DEFAULT 7,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invite Tasks Table (up to 13 tasks)
CREATE TABLE IF NOT EXISTS invite_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_number INT UNIQUE NOT NULL,
  task_people INT NOT NULL,
  recharge_amount DECIMAL(10,2) NOT NULL,
  task_amount DECIMAL(10,2) NOT NULL,
  is_active TINYINT DEFAULT 1
);

-- Welcome Messages Table
CREATE TABLE IF NOT EXISTS welcome_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  popup_title VARCHAR(255),
  popup_heading VARCHAR(255),
  announcement TEXT,
  body_message TEXT,
  telegram_text VARCHAR(255),
  reward_text VARCHAR(255),
  vip_link VARCHAR(500),
  is_active TINYINT DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Languages & Currencies Table
CREATE TABLE IF NOT EXISTS languages_currencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lang_code VARCHAR(10) NOT NULL,
  lang_name VARCHAR(100),
  flag_url VARCHAR(500),
  currency_code VARCHAR(10),
  currency_symbol VARCHAR(10),
  currency_name VARCHAR(100),
  is_default TINYINT DEFAULT 0,
  is_active TINYINT DEFAULT 1
);

-- Insert default language
INSERT INTO languages_currencies (lang_code, lang_name, flag_url, currency_code, currency_symbol, currency_name, is_default, is_active) VALUES
  ('en', 'English', '/images/flags/en.png', 'INR', '₹', 'Indian Rupee', 1, 1)
ON DUPLICATE KEY UPDATE lang_code = lang_code;

-- Category Banners Table
CREATE TABLE IF NOT EXISTS category_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  banner_name VARCHAR(255) DEFAULT '',
  banner_image VARCHAR(500) NOT NULL,
  redirect_url VARCHAR(500) DEFAULT '',
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add banner_name to existing category_banners table (run if table already exists)
ALTER TABLE category_banners ADD COLUMN IF NOT EXISTS banner_name VARCHAR(255) DEFAULT '' AFTER category;
