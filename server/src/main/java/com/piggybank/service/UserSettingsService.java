package com.piggybank.service;

import com.piggybank.dto.UserSettingsDTO;
import com.piggybank.entity.UserSettings;
import com.piggybank.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@Transactional
public class UserSettingsService {
    
    @Autowired
    private UserSettingsRepository userSettingsRepository;
    
    @Autowired
    private LoggingService loggingService;
    
    /**
     * Create or update user settings
     */
    public UserSettings saveOrUpdateSettings(Long userId, UserSettingsDTO settingsDTO, String createdBy) {
        // Validate that percentages sum to 100%
        BigDecimal totalPercentage = settingsDTO.getCharityPercentage()
                .add(settingsDTO.getSpendPercentage())
                .add(settingsDTO.getSavingsPercentage())
                .add(settingsDTO.getInvestmentPercentage());
        
        if (totalPercentage.compareTo(new BigDecimal("100.00")) != 0) {
            throw new IllegalArgumentException("Total percentage must equal 100%. Current total: " + totalPercentage + "%");
        }
        
        // Check if settings already exist
        Optional<UserSettings> existingSettings = userSettingsRepository.findByUserId(userId);
        
        UserSettings settings;
        if (existingSettings.isPresent()) {
            // Update existing settings
            settings = existingSettings.get();
            settings.setCharityPercentage(settingsDTO.getCharityPercentage());
            settings.setSpendPercentage(settingsDTO.getSpendPercentage());
            settings.setSavingsPercentage(settingsDTO.getSavingsPercentage());
            settings.setInvestmentPercentage(settingsDTO.getInvestmentPercentage());
            settings.setSavingsMonthlyWithdrawalLimit(settingsDTO.getSavingsMonthlyWithdrawalLimit());
            settings.setInvestmentMonthlyWithdrawalLimit(settingsDTO.getInvestmentMonthlyWithdrawalLimit());
            settings.setUpdatedBy(createdBy);
            
            loggingService.logUserSettingsUpdate(userId, createdBy, "Settings updated");
        } else {
            // Create new settings
            settings = new UserSettings(
                userId,
                settingsDTO.getCharityPercentage(),
                settingsDTO.getSpendPercentage(),
                settingsDTO.getSavingsPercentage(),
                settingsDTO.getInvestmentPercentage(),
                settingsDTO.getSavingsMonthlyWithdrawalLimit(),
                settingsDTO.getInvestmentMonthlyWithdrawalLimit(),
                createdBy
            );
            
            loggingService.logUserSettingsUpdate(userId, createdBy, "Settings created");
        }
        
        return userSettingsRepository.save(settings);
    }
    
    /**
     * Get user settings by user ID
     */
    @Transactional(readOnly = true)
    public Optional<UserSettings> getSettingsByUserId(Long userId) {
        return userSettingsRepository.findByUserId(userId);
    }
    
    /**
     * Check if user has valid settings
     */
    @Transactional(readOnly = true)
    public boolean hasValidSettings(Long userId) {
        return userSettingsRepository.findValidSettingsByUserId(userId).isPresent();
    }
    
    /**
     * Get default settings if user doesn't have any
     */
    @Transactional(readOnly = true)
    public UserSettings getDefaultSettings(Long userId, String createdBy) {
        UserSettingsDTO defaultDTO = new UserSettingsDTO(
            new BigDecimal("25.00"), // 25% charity
            new BigDecimal("25.00"), // 25% spend
            new BigDecimal("25.00"), // 25% savings
            new BigDecimal("25.00"), // 25% investment
            2, // 2 withdrawals per month for savings
            2  // 2 withdrawals per month for investment
        );
        
        return saveOrUpdateSettings(userId, defaultDTO, createdBy);
    }
    
    /**
     * Delete user settings
     */
    public void deleteSettings(Long userId) {
        userSettingsRepository.deleteByUserId(userId);
        loggingService.logUserSettingsUpdate(userId, "system", "Settings deleted");
    }
    
    // Setter methods for dependency injection
    public void setUserSettingsRepository(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }
    
    public void setLoggingService(LoggingService loggingService) {
        this.loggingService = loggingService;
    }
}
