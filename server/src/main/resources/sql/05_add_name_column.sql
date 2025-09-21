-- Add name column to existing users table
-- This script should be run if you have an existing database without the name column

USE `piggy_bank`;

-- Add name column to users table
ALTER TABLE `users` 
ADD COLUMN `name` VARCHAR(35) NOT NULL DEFAULT 'User' AFTER `phone_number`;

-- Add index for name column for better performance
CREATE INDEX `idx_users_name` ON `users` (`name`);

-- Verify the changes
SELECT `id`, `phone_number`, `name`, `created_date` FROM `users` LIMIT 5;
