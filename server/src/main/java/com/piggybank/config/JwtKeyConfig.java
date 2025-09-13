package com.piggybank.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Configuration
public class JwtKeyConfig {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Bean
    public SecretKey jwtSigningKey() {
        try {
            // Ensure we have a secure key for HS512 (minimum 512 bits = 64 bytes)
            byte[] keyBytes = ensureSecureKeyLength(jwtSecret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create JWT signing key", e);
        }
    }
    
    private byte[] ensureSecureKeyLength(String secret) throws NoSuchAlgorithmException {
        if (!StringUtils.hasText(secret)) {
            throw new IllegalArgumentException("JWT secret cannot be null or empty");
        }
        
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        
        // If the secret is already 64 bytes or more, use it directly
        if (secretBytes.length >= 64) {
            return secretBytes;
        }
        
        // For shorter secrets, use SHA-512 to create a secure 64-byte key
        MessageDigest digest = MessageDigest.getInstance("SHA-512");
        
        // Hash the secret multiple times to ensure we get a good distribution
        byte[] hash = secretBytes;
        for (int i = 0; i < 1000; i++) {
            hash = digest.digest(hash);
        }
        
        return hash;
    }
} 