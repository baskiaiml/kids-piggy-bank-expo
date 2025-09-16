package com.piggybank.repository;

import com.piggybank.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    
    /**
     * Find user settings by user ID
     */
    Optional<UserSettings> findByUserId(Long userId);
    
    /**
     * Check if user settings exist for a user
     */
    boolean existsByUserId(Long userId);
    
    /**
     * Delete user settings by user ID
     */
    void deleteByUserId(Long userId);
    
    /**
     * Get user settings with validation that percentages sum to 100%
     */
    @Query("SELECT us FROM UserSettings us WHERE us.userId = :userId " +
           "AND (us.charityPercentage + us.spendPercentage + us.savingsPercentage + us.investmentPercentage) = 100.00")
    Optional<UserSettings> findValidSettingsByUserId(@Param("userId") Long userId);
}
