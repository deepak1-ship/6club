-- UPI Management Tables
-- Run this single command to create both tables

CREATE TABLE IF NOT EXISTS new_upi_ids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  upi_id VARCHAR(100) NOT NULL,
  is_active TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS new_upi_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(500) NOT NULL,
  is_active TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
