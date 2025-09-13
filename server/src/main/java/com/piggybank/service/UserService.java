package com.piggybank.service;

import com.piggybank.entity.User;
import com.piggybank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PinEncryptionService pinEncryptionService;

    public User registerUser(String phoneNumber, String pin) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        if (!pinEncryptionService.isValidPinFormat(pin)) {
            throw new IllegalArgumentException("PIN must be exactly 4 digits");
        }
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new IllegalArgumentException("User with this phone number already exists");
        }

        String encryptedPin = pinEncryptionService.encryptPin(pin);
        User user = new User(phoneNumber, encryptedPin);
        // Removed user.setCreatedAt(LocalDateTime.now()); - handled by AuditableEntity
        return userRepository.save(user);
    }

    public User authenticateUser(String phoneNumber, String pin) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }
        if (!pinEncryptionService.isValidPinFormat(pin)) {
            throw new IllegalArgumentException("Invalid PIN format");
        }

        Optional<User> userOptional = userRepository.findByPhoneNumber(phoneNumber);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOptional.get();
        if (!pinEncryptionService.verifyPin(pin, user.getPinHash())) {
            throw new IllegalArgumentException("Invalid PIN");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        return user;
    }
}