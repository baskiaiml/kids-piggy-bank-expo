-- Use the piggy_bank database
USE `piggy_bank`;

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `phone_number` VARCHAR(20) NOT NULL UNIQUE,
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
