-- Use the piggy_bank database
USE `piggy_bank`;

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `phone_number` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(35) NOT NULL,
    `pin_hash` VARCHAR(255) NOT NULL,
    `last_login` DATETIME NULL,
    `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_modified_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` VARCHAR(255) NULL,
    `last_modified_by` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_users_phone_number` (`phone_number`),
    INDEX `idx_users_last_login` (`last_login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create kids table
CREATE TABLE IF NOT EXISTS `kids` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `age` INT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_modified_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by` VARCHAR(255) NULL,
    `last_modified_by` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_kids_user_id` (`user_id`),
    INDEX `idx_kids_name` (`name`),
    INDEX `idx_kids_age` (`age`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit tables for Hibernate Envers
-- Users audit table
CREATE TABLE IF NOT EXISTS `users_aud` (
    `id` BIGINT NOT NULL,
    `rev` INT NOT NULL,
    `revtype` TINYINT NULL,
    `phone_number` VARCHAR(20) NULL,
    `pin_hash` VARCHAR(255) NULL,
    `last_login` DATETIME NULL,
    `created_date` DATETIME NULL,
    `last_modified_date` DATETIME NULL,
    `created_by` VARCHAR(255) NULL,
    `last_modified_by` VARCHAR(255) NULL,
    PRIMARY KEY (`id`, `rev`),
    INDEX `idx_users_aud_rev` (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kids audit table
CREATE TABLE IF NOT EXISTS `kids_aud` (
    `id` BIGINT NOT NULL,
    `rev` INT NOT NULL,
    `revtype` TINYINT NULL,
    `name` VARCHAR(100) NULL,
    `age` INT NULL,
    `user_id` BIGINT NULL,
    `created_date` DATETIME NULL,
    `last_modified_date` DATETIME NULL,
    `created_by` VARCHAR(255) NULL,
    `last_modified_by` VARCHAR(255) NULL,
    PRIMARY KEY (`id`, `rev`),
    INDEX `idx_kids_aud_rev` (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create revision info table for Hibernate Envers
CREATE TABLE IF NOT EXISTS `revinfo` (
    `rev` INT NOT NULL AUTO_INCREMENT,
    `revtstmp` BIGINT NULL,
    PRIMARY KEY (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create user_settings table
CREATE TABLE IF NOT EXISTS `user_settings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `charity_percentage` DECIMAL(5,2) NOT NULL,
    `spend_percentage` DECIMAL(5,2) NOT NULL,
    `savings_percentage` DECIMAL(5,2) NOT NULL,
    `investment_percentage` DECIMAL(5,2) NOT NULL,
    `savings_monthly_withdrawal_limit` INT NOT NULL,
    `investment_monthly_withdrawal_limit` INT NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    `created_by` VARCHAR(255) NOT NULL,
    `updated_by` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_settings_user_id` (`user_id`),
    CONSTRAINT `fk_user_settings_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create transactions table
CREATE TABLE IF NOT EXISTS `transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `kid_id` BIGINT NOT NULL,
    `transaction_type` ENUM('DEPOSIT','WITHDRAWAL') NOT NULL,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `charity_amount` DECIMAL(10,2) DEFAULT NULL,
    `spend_amount` DECIMAL(10,2) DEFAULT NULL,
    `savings_amount` DECIMAL(10,2) DEFAULT NULL,
    `investment_amount` DECIMAL(10,2) DEFAULT NULL,
    `charity_percentage` DECIMAL(5,2) DEFAULT NULL,
    `spend_percentage` DECIMAL(5,2) DEFAULT NULL,
    `savings_percentage` DECIMAL(5,2) DEFAULT NULL,
    `investment_percentage` DECIMAL(5,2) DEFAULT NULL,
    `withdrawal_component` ENUM('CHARITY','SPEND','SAVINGS','INVESTMENT') DEFAULT NULL,
    `withdrawal_amount` DECIMAL(10,2) DEFAULT NULL,
    `description` VARCHAR(500) DEFAULT NULL,
    `transaction_date` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL,
    `created_by` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_transactions_user_kid` (`user_id`, `kid_id`),
    KEY `idx_transactions_date` (`transaction_date`),
    KEY `idx_transactions_type` (`transaction_type`),
    CONSTRAINT `fk_transactions_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_transactions_kid_id` FOREIGN KEY (`kid_id`) REFERENCES `kids` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create kid_balances table
CREATE TABLE IF NOT EXISTS `kid_balances` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `kid_id` BIGINT NOT NULL,
    `charity_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `spend_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `savings_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `investment_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `total_balance` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `last_updated` DATETIME NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    `created_by` VARCHAR(255) NOT NULL,
    `updated_by` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_kid_balances_user_kid` (`user_id`, `kid_id`),
    KEY `idx_kid_balances_user_id` (`user_id`),
    KEY `idx_kid_balances_kid_id` (`kid_id`),
    KEY `idx_kid_balances_last_updated` (`last_updated`),
    CONSTRAINT `fk_kid_balances_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_kid_balances_kid_id` FOREIGN KEY (`kid_id`) REFERENCES `kids` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit tables for new entities
-- User settings audit table
CREATE TABLE IF NOT EXISTS `user_settings_aud` (
    `id` BIGINT NOT NULL,
    `rev` INT NOT NULL,
    `revtype` TINYINT NULL,
    `user_id` BIGINT NULL,
    `charity_percentage` DECIMAL(5,2) NULL,
    `spend_percentage` DECIMAL(5,2) NULL,
    `savings_percentage` DECIMAL(5,2) NULL,
    `investment_percentage` DECIMAL(5,2) NULL,
    `savings_monthly_withdrawal_limit` INT NULL,
    `investment_monthly_withdrawal_limit` INT NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    PRIMARY KEY (`id`, `rev`),
    INDEX `idx_user_settings_aud_rev` (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions audit table
CREATE TABLE IF NOT EXISTS `transactions_aud` (
    `id` BIGINT NOT NULL,
    `rev` INT NOT NULL,
    `revtype` TINYINT NULL,
    `user_id` BIGINT NULL,
    `kid_id` BIGINT NULL,
    `transaction_type` ENUM('DEPOSIT','WITHDRAWAL') NULL,
    `total_amount` DECIMAL(10,2) NULL,
    `charity_amount` DECIMAL(10,2) NULL,
    `spend_amount` DECIMAL(10,2) NULL,
    `savings_amount` DECIMAL(10,2) NULL,
    `investment_amount` DECIMAL(10,2) NULL,
    `charity_percentage` DECIMAL(5,2) NULL,
    `spend_percentage` DECIMAL(5,2) NULL,
    `savings_percentage` DECIMAL(5,2) NULL,
    `investment_percentage` DECIMAL(5,2) NULL,
    `withdrawal_component` ENUM('CHARITY','SPEND','SAVINGS','INVESTMENT') NULL,
    `withdrawal_amount` DECIMAL(10,2) NULL,
    `description` VARCHAR(500) NULL,
    `transaction_date` DATETIME NULL,
    `created_at` DATETIME NULL,
    `created_by` VARCHAR(255) NULL,
    PRIMARY KEY (`id`, `rev`),
    INDEX `idx_transactions_aud_rev` (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Kid balances audit table
CREATE TABLE IF NOT EXISTS `kid_balances_aud` (
    `id` BIGINT NOT NULL,
    `rev` INT NOT NULL,
    `revtype` TINYINT NULL,
    `user_id` BIGINT NULL,
    `kid_id` BIGINT NULL,
    `charity_balance` DECIMAL(10,2) NULL,
    `spend_balance` DECIMAL(10,2) NULL,
    `savings_balance` DECIMAL(10,2) NULL,
    `investment_balance` DECIMAL(10,2) NULL,
    `total_balance` DECIMAL(10,2) NULL,
    `last_updated` DATETIME NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL,
    `created_by` VARCHAR(255) NULL,
    `updated_by` VARCHAR(255) NULL,
    PRIMARY KEY (`id`, `rev`),
    INDEX `idx_kid_balances_aud_rev` (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
