package com.piggybank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PinEncryptionService {
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public String encryptPin(String pin) {
        return passwordEncoder.encode(pin);
    }
    
    public boolean verifyPin(String rawPin, String encryptedPin) {
        return passwordEncoder.matches(rawPin, encryptedPin);
    }
}
