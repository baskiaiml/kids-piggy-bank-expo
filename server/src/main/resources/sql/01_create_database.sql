-- Create database for Kids Piggy Bank application
CREATE DATABASE IF NOT EXISTS `piggy_bank` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE `piggy_bank`;

-- Create user for the application (optional - for production)
-- CREATE USER IF NOT EXISTS 'piggybank_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON piggy_bank.* TO 'piggybank_user'@'localhost';
-- FLUSH PRIVILEGES;
