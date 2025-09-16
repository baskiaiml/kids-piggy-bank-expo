-- Use the piggy_bank database
USE `piggy_bank`;

-- Sample data for testing (optional)
-- Note: PINs are hashed using BCrypt, these are just examples
-- In real application, use proper password hashing

-- Sample users (PINs are: 1234, 5678, 9999)
-- Note: These are sample users for testing. Use different phone numbers for actual signup.
INSERT IGNORE INTO `users` (`phone_number`, `pin_hash`, `last_login`, `created_by`) VALUES
('+1111111111', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', NOW(), 'system'),
('+2222222222', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', NOW(), 'system'),
('+3333333333', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', NOW(), 'system');

-- Sample kids
INSERT IGNORE INTO `kids` (`name`, `age`, `user_id`, `created_by`) VALUES
('Emma', 8, 1, 'system'),
('Liam', 10, 1, 'system'),
('Sophia', 6, 2, 'system'),
('Noah', 12, 2, 'system'),
('Olivia', 9, 3, 'system');
