package com.piggybank.controller;

import com.piggybank.dto.UserSettingsDTO;
import com.piggybank.entity.UserSettings;
import com.piggybank.service.JwtTokenService;
import com.piggybank.service.UserSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {
    
    private static final Logger logger = LoggerFactory.getLogger(SettingsController.class);
    
    @Autowired
    private UserSettingsService userSettingsService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    /**
     * Get user settings
     */
    @GetMapping
    public ResponseEntity<?> getUserSettings(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            String phoneNumber = jwtTokenService.getPhoneNumberFromToken(token);
            
            logger.debug("Getting settings for user: {}", userId);
            
            Optional<UserSettings> settings = userSettingsService.getSettingsByUserId(userId);
            
            if (settings.isPresent()) {
                UserSettingsDTO settingsDTO = new UserSettingsDTO(
                    settings.get().getCharityPercentage(),
                    settings.get().getSpendPercentage(),
                    settings.get().getSavingsPercentage(),
                    settings.get().getInvestmentPercentage(),
                    settings.get().getSavingsMonthlyWithdrawalLimit(),
                    settings.get().getInvestmentMonthlyWithdrawalLimit()
                );
                
                return ResponseEntity.ok(new ApiResponse(true, "Settings retrieved successfully", settingsDTO));
            } else {
                // Return default settings
                UserSettings defaultSettings = userSettingsService.getDefaultSettings(userId, phoneNumber);
                UserSettingsDTO defaultDTO = new UserSettingsDTO(
                    defaultSettings.getCharityPercentage(),
                    defaultSettings.getSpendPercentage(),
                    defaultSettings.getSavingsPercentage(),
                    defaultSettings.getInvestmentPercentage(),
                    defaultSettings.getSavingsMonthlyWithdrawalLimit(),
                    defaultSettings.getInvestmentMonthlyWithdrawalLimit()
                );
                
                return ResponseEntity.ok(new ApiResponse(true, "Default settings retrieved", defaultDTO));
            }
            
        } catch (Exception e) {
            logger.error("Error getting user settings: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to get settings: " + e.getMessage()));
        }
    }
    
    /**
     * Create or update user settings
     */
    @PostMapping
    public ResponseEntity<?> saveSettings(@RequestHeader("Authorization") String authHeader,
                                        @Valid @RequestBody UserSettingsDTO settingsDTO) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            String phoneNumber = jwtTokenService.getPhoneNumberFromToken(token);
            
            logger.debug("Saving settings for user: {}", userId);
            
            UserSettings savedSettings = userSettingsService.saveOrUpdateSettings(userId, settingsDTO, phoneNumber);
            
            UserSettingsDTO responseDTO = new UserSettingsDTO(
                savedSettings.getCharityPercentage(),
                savedSettings.getSpendPercentage(),
                savedSettings.getSavingsPercentage(),
                savedSettings.getInvestmentPercentage(),
                savedSettings.getSavingsMonthlyWithdrawalLimit(),
                savedSettings.getInvestmentMonthlyWithdrawalLimit()
            );
            
            return ResponseEntity.ok(new ApiResponse(true, "Settings saved successfully", responseDTO));
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid settings data: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error saving user settings: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to save settings: " + e.getMessage()));
        }
    }
    
    /**
     * Delete user settings
     */
    @DeleteMapping
    public ResponseEntity<?> deleteSettings(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            
            logger.debug("Deleting settings for user: {}", userId);
            
            userSettingsService.deleteSettings(userId);
            
            return ResponseEntity.ok(new ApiResponse(true, "Settings deleted successfully"));
            
        } catch (Exception e) {
            logger.error("Error deleting user settings: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to delete settings: " + e.getMessage()));
        }
    }
    
    /**
     * Check if user has valid settings
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateSettings(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            
            boolean hasValidSettings = userSettingsService.hasValidSettings(userId);
            
            return ResponseEntity.ok(new ApiResponse(true, "Settings validation completed", hasValidSettings));
            
        } catch (Exception e) {
            logger.error("Error validating user settings: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to validate settings: " + e.getMessage()));
        }
    }
    
    // Inner class for API responses
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
        
        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
        
        public ApiResponse(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }
        
        // Getters and Setters
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public Object getData() {
            return data;
        }
        
        public void setData(Object data) {
            this.data = data;
        }
    }
}
