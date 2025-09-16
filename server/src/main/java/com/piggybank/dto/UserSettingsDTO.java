package com.piggybank.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UserSettingsDTO {
    
    @NotNull(message = "Charity percentage is required")
    @DecimalMin(value = "0.00", message = "Charity percentage must be at least 0%")
    @DecimalMax(value = "100.00", message = "Charity percentage must be at most 100%")
    private BigDecimal charityPercentage;
    
    @NotNull(message = "Spend percentage is required")
    @DecimalMin(value = "0.00", message = "Spend percentage must be at least 0%")
    @DecimalMax(value = "100.00", message = "Spend percentage must be at most 100%")
    private BigDecimal spendPercentage;
    
    @NotNull(message = "Savings percentage is required")
    @DecimalMin(value = "0.00", message = "Savings percentage must be at least 0%")
    @DecimalMax(value = "100.00", message = "Savings percentage must be at most 100%")
    private BigDecimal savingsPercentage;
    
    @NotNull(message = "Investment percentage is required")
    @DecimalMin(value = "0.00", message = "Investment percentage must be at least 0%")
    @DecimalMax(value = "100.00", message = "Investment percentage must be at most 100%")
    private BigDecimal investmentPercentage;
    
    @NotNull(message = "Savings monthly withdrawal limit is required")
    @Min(value = 0, message = "Savings monthly withdrawal limit must be at least 0")
    @Max(value = 10, message = "Savings monthly withdrawal limit must be at most 10")
    private Integer savingsMonthlyWithdrawalLimit;
    
    @NotNull(message = "Investment monthly withdrawal limit is required")
    @Min(value = 0, message = "Investment monthly withdrawal limit must be at least 0")
    @Max(value = 10, message = "Investment monthly withdrawal limit must be at most 10")
    private Integer investmentMonthlyWithdrawalLimit;
    
    // Constructors
    public UserSettingsDTO() {}
    
    public UserSettingsDTO(BigDecimal charityPercentage, BigDecimal spendPercentage, 
                          BigDecimal savingsPercentage, BigDecimal investmentPercentage,
                          Integer savingsMonthlyWithdrawalLimit, Integer investmentMonthlyWithdrawalLimit) {
        this.charityPercentage = charityPercentage;
        this.spendPercentage = spendPercentage;
        this.savingsPercentage = savingsPercentage;
        this.investmentPercentage = investmentPercentage;
        this.savingsMonthlyWithdrawalLimit = savingsMonthlyWithdrawalLimit;
        this.investmentMonthlyWithdrawalLimit = investmentMonthlyWithdrawalLimit;
    }
    
    // Getters and Setters
    public BigDecimal getCharityPercentage() {
        return charityPercentage;
    }
    
    public void setCharityPercentage(BigDecimal charityPercentage) {
        this.charityPercentage = charityPercentage;
    }
    
    public BigDecimal getSpendPercentage() {
        return spendPercentage;
    }
    
    public void setSpendPercentage(BigDecimal spendPercentage) {
        this.spendPercentage = spendPercentage;
    }
    
    public BigDecimal getSavingsPercentage() {
        return savingsPercentage;
    }
    
    public void setSavingsPercentage(BigDecimal savingsPercentage) {
        this.savingsPercentage = savingsPercentage;
    }
    
    public BigDecimal getInvestmentPercentage() {
        return investmentPercentage;
    }
    
    public void setInvestmentPercentage(BigDecimal investmentPercentage) {
        this.investmentPercentage = investmentPercentage;
    }
    
    public Integer getSavingsMonthlyWithdrawalLimit() {
        return savingsMonthlyWithdrawalLimit;
    }
    
    public void setSavingsMonthlyWithdrawalLimit(Integer savingsMonthlyWithdrawalLimit) {
        this.savingsMonthlyWithdrawalLimit = savingsMonthlyWithdrawalLimit;
    }
    
    public Integer getInvestmentMonthlyWithdrawalLimit() {
        return investmentMonthlyWithdrawalLimit;
    }
    
    public void setInvestmentMonthlyWithdrawalLimit(Integer investmentMonthlyWithdrawalLimit) {
        this.investmentMonthlyWithdrawalLimit = investmentMonthlyWithdrawalLimit;
    }
}
