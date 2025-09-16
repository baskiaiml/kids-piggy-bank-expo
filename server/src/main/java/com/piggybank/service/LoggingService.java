package com.piggybank.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
public class LoggingService {

    private static final Logger logger = LoggerFactory.getLogger(LoggingService.class);
    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT");
    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY");

    public void logInfo(String message) {
        logger.info(message);
    }

    public void logError(String message, Throwable throwable) {
        logger.error(message, throwable);
    }

    public void logDebug(String message) {
        logger.debug(message);
    }

    public void logWarn(String message) {
        logger.warn(message);
    }

    // Audit logging methods
    public void logUserRegistration(String phoneNumber, Long userId) {
        MDC.put("event", "USER_REGISTRATION");
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("userId", userId.toString());
        MDC.put("timestamp", LocalDateTime.now().toString());

        auditLogger.info("User registered successfully");

        MDC.clear();
    }

    public void logUserLogin(String phoneNumber, Long userId, boolean success) {
        MDC.put("event", "USER_LOGIN");
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("userId", userId.toString());
        MDC.put("success", String.valueOf(success));
        MDC.put("timestamp", LocalDateTime.now().toString());

        if (success) {
            auditLogger.info("User login successful");
        } else {
            auditLogger.warn("User login failed");
        }

        MDC.clear();
    }

    public void logKidAdded(String phoneNumber, Long userId, String kidName, Long kidId) {
        MDC.put("event", "KID_ADDED");
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("userId", userId.toString());
        MDC.put("kidName", kidName);
        MDC.put("kidId", kidId.toString());
        MDC.put("timestamp", LocalDateTime.now().toString());

        auditLogger.info("Kid added successfully");

        MDC.clear();
    }

    public void logKidUpdated(String phoneNumber, Long userId, String kidName, Long kidId) {
        MDC.put("event", "KID_UPDATED");
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("userId", userId.toString());
        MDC.put("kidName", kidName);
        MDC.put("kidId", kidId.toString());
        MDC.put("timestamp", LocalDateTime.now().toString());

        auditLogger.info("Kid updated successfully");

        MDC.clear();
    }

    public void logKidDeleted(String phoneNumber, Long userId, String kidName, Long kidId) {
        MDC.put("event", "KID_DELETED");
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("userId", userId.toString());
        MDC.put("kidName", kidName);
        MDC.put("kidId", kidId.toString());
        MDC.put("timestamp", LocalDateTime.now().toString());

        auditLogger.info("Kid deleted successfully");

        MDC.clear();
    }

    // Security logging methods
    public void logSecurityEvent(String event, String details, String severity) {
        MDC.put("securityEvent", event);
        MDC.put("details", details);
        MDC.put("severity", severity);
        MDC.put("timestamp", LocalDateTime.now().toString());

        switch (severity.toUpperCase()) {
            case "HIGH":
                securityLogger.error("Security event: " + event + " - " + details);
                break;
            case "MEDIUM":
                securityLogger.warn("Security event: " + event + " - " + details);
                break;
            default:
                securityLogger.info("Security event: " + event + " - " + details);
        }

        MDC.clear();
    }

    public void logJwtTokenGenerated(String phoneNumber, Long userId) {
        MDC.put("event", "JWT_TOKEN_GENERATED");
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("userId", userId.toString());
        MDC.put("timestamp", LocalDateTime.now().toString());

        securityLogger.info("JWT token generated");

        MDC.clear();
    }

    public void logJwtTokenValidation(String phoneNumber, boolean success) {
        MDC.put("event", "JWT_TOKEN_VALIDATION");
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("success", String.valueOf(success));
        MDC.put("timestamp", LocalDateTime.now().toString());

        if (success) {
            securityLogger.info("JWT token validation successful");
        } else {
            securityLogger.warn("JWT token validation failed");
        }

        MDC.clear();
    }

    // API request logging
    public void logApiRequest(String method, String endpoint, String phoneNumber, int statusCode, long duration) {
        MDC.put("apiMethod", method);
        MDC.put("apiEndpoint", endpoint);
        MDC.put("phoneNumber", phoneNumber);
        MDC.put("statusCode", String.valueOf(statusCode));
        MDC.put("duration", String.valueOf(duration));
        MDC.put("timestamp", LocalDateTime.now().toString());

        logger.info("API Request: {} {} - Status: {} - Duration: {}ms", method, endpoint, statusCode, duration);

        MDC.clear();
    }
    
    /**
     * Log user settings operations
     */
    public void logUserSettingsUpdate(Long userId, String updatedBy, String action) {
        MDC.put("userId", String.valueOf(userId));
        MDC.put("updatedBy", updatedBy);
        MDC.put("action", action);
        MDC.put("timestamp", LocalDateTime.now().toString());
        
        logger.info("User Settings {}: User ID {} - Updated by {}", action, userId, updatedBy);
        
        MDC.clear();
    }
    
    /**
     * Log transaction operations
     */
    public void logTransaction(Long userId, Long kidId, String transactionType, BigDecimal amount, String createdBy) {
        MDC.put("userId", String.valueOf(userId));
        MDC.put("kidId", String.valueOf(kidId));
        MDC.put("transactionType", transactionType);
        MDC.put("amount", amount.toString());
        MDC.put("createdBy", createdBy);
        MDC.put("timestamp", LocalDateTime.now().toString());
        
        logger.info("Transaction {}: User ID {} - Kid ID {} - Amount {} - Created by {}", 
                   transactionType, userId, kidId, amount, createdBy);
        
        MDC.clear();
    }
}