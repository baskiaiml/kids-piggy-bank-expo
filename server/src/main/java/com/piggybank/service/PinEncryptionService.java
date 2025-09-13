package com.piggybank.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PinEncryptionService {
    private final PasswordEncoder passwordEncoder;
    
    public PinEncryptionService() {
        this.passwordEncoder = new BCryptPasswordEncoder(12);
    }
    
    public String encryptPin(String pin) {
        if (pin == null || pin.trim().isEmpty()) {
            throw new IllegalArgumentException("PIN cannot be null or empty");
        }
        if (!pin.matches("\\d{4}")) {
            throw new IllegalArgumentException("PIN must be exactly 4 digits");
        }
        return passwordEncoder.encode(pin);
    }
    
    public boolean verifyPin(String pin, String encryptedPin) {
        if (pin == null || encryptedPin == null) {
            return false;
        }
        return passwordEncoder.matches(pin, encryptedPin);
    }
    
    public boolean isValidPinFormat(String pin) {
        return pin != null && pin.matches("\\d{4}");
    }
}
