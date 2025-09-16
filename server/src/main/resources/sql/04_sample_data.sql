-- Use the piggy_bank database
USE `piggy_bank`;

-- Sample data for testing (optional)
-- Note: PINs are hashed using BCrypt, these are just examples
-- In real application, use proper password hashing

-- Sample users (PINs are: 1234, 5678, 9999)
INSERT IGNORE INTO `users` (`phone_number`, `pin_hash`, `last_login`, `created_by`) VALUES
('+1234567890', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', NOW(), 'system'),
('+1987654321', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', NOW(), 'system'),
('+1555000123', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', NOW(), 'system');

-- Sample kids
INSERT IGNORE INTO `kids` (`name`, `age`, `user_id`, `created_by`) VALUES
('Emma', 8, 1, 'system'),
('Liam', 10, 1, 'system'),
('Sophia', 6, 2, 'system'),
('Noah', 12, 2, 'system'),
('Olivia', 9, 3, 'system');
