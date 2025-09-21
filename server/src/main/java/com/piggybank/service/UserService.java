package com.piggybank.service;

import com.piggybank.entity.User;
import com.piggybank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String phoneNumber, String name, String pin) {
        // Check if user already exists
        if (userRepository.findByPhoneNumber(phoneNumber).isPresent()) {
            throw new IllegalArgumentException("User with this phone number already exists");
        }

        // Validate phone number format (basic validation)
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }

        // Validate name format
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }

        if (name.length() < 3 || name.length() > 35) {
            throw new IllegalArgumentException("Name must be between 3 and 35 characters");
        }

        if (!name.matches("^[a-zA-Z0-9._-]+$")) {
            throw new IllegalArgumentException("Name can only contain letters, numbers, underscore, hyphen, and dot");
        }

        // Validate PIN format
        if (pin == null || pin.length() != 4 || !pin.matches("\\d{4}")) {
            throw new IllegalArgumentException("PIN must be exactly 4 digits");
        }

        // Encrypt PIN using BCrypt
        String encryptedPin = passwordEncoder.encode(pin);

        User user = new User(phoneNumber, name, encryptedPin);
        return userRepository.save(user);
    }

    public User authenticateUser(String phoneNumber, String pin) {
        Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid phone number or PIN");
        }

        User user = userOpt.get();

        // Verify PIN using BCrypt
        if (!passwordEncoder.matches(pin, user.getPinHash())) {
            throw new IllegalArgumentException("Invalid phone number or PIN");
        }

        // Update last login time
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return user;
    }
}