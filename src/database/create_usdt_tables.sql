-- USDT Management Tables
-- Run this single command to create both tables

CREATE TABLE IF NOT EXISTS new_usdt_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  wallet_address VARCHAR(100) NOT NULL,
  network_type VARCHAR(20) DEFAULT 'TRC20',
  is_active TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS new_usdt_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  is_active TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
