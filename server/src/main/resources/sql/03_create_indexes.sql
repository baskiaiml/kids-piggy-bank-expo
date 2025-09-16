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
