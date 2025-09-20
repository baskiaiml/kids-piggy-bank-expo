-- Use the piggy_bank database
USE `piggy_bank`;

-- Additional indexes for performance optimization
-- Note: Most indexes are already created in the table creation script
-- This script adds only the composite indexes that weren't created initially

-- Composite index for kids by user and age
CREATE INDEX `idx_kids_user_age` ON `kids` (`user_id`, `age`);

-- Index for audit tables revision lookups
CREATE INDEX `idx_users_aud_rev` ON `users_aud` (`rev`);
CREATE INDEX `idx_kids_aud_rev` ON `kids_aud` (`rev`);

-- Index for revision timestamp queries
CREATE INDEX `idx_revinfo_revtstmp` ON `revinfo` (`revtstmp`);

-- Additional indexes for new tables
CREATE INDEX `idx_user_settings_created_at` ON `user_settings` (`created_at`);
CREATE INDEX `idx_transactions_withdrawal_component` ON `transactions` (`withdrawal_component`);
CREATE INDEX `idx_transactions_created_at` ON `transactions` (`created_at`);
CREATE INDEX `idx_kid_balances_total_balance` ON `kid_balances` (`total_balance`);
CREATE INDEX `idx_user_settings_aud_rev` ON `user_settings_aud` (`rev`);
CREATE INDEX `idx_transactions_aud_rev` ON `transactions_aud` (`rev`);
CREATE INDEX `idx_kid_balances_aud_rev` ON `kid_balances_aud` (`rev`);
