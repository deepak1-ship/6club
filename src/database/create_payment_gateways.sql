-- Payment Gateways Table
-- Run this SQL to create the new_payment_gateways table

CREATE TABLE IF NOT EXISTS `new_payment_gateways` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pay_name` VARCHAR(100) NOT NULL COMMENT 'Payment gateway name (e.g., bKash, PayTM)',
  `min_price` DECIMAL(15, 2) NOT NULL DEFAULT 100.00 COMMENT 'Minimum transaction amount',
  `max_price` DECIMAL(15, 2) NOT NULL DEFAULT 50000.00 COMMENT 'Maximum transaction amount',
  `bonus_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'Bonus percentage for deposits',
  `recharge_amounts` TEXT COMMENT 'Comma-separated recharge amount options',
  `gift_amounts` TEXT COMMENT 'Comma-separated gift amount options',
  `gateway_type` ENUM('automatic', 'manual') NOT NULL DEFAULT 'manual' COMMENT 'Gateway type: automatic or manual',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Active, 0 = Inactive',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default gateway
INSERT INTO `new_payment_gateways` (`pay_name`, `min_price`, `max_price`, `bonus_percent`, `recharge_amounts`, `gift_amounts`, `is_active`)
VALUES ('bKash', 100.00, 50000.00, 10.00, '10,20,30', '10,0,0', 1);

