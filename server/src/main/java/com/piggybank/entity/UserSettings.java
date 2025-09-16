package com.piggybank.entity;

import jakarta.persistence.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
public class UserSettings {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "charity_percentage", precision = 5, scale = 2, nullable = false)
    private BigDecimal charityPercentage;
    
    @Column(name = "spend_percentage", precision = 5, scale = 2, nullable = false)
    private BigDecimal spendPercentage;
    
    @Column(name = "savings_percentage", precision = 5, scale = 2, nullable = false)
    private BigDecimal savingsPercentage;
    
    @Column(name = "investment_percentage", precision = 5, scale = 2, nullable = false)
    private BigDecimal investmentPercentage;
    
    @Column(name = "savings_monthly_withdrawal_limit", nullable = false)
    private Integer savingsMonthlyWithdrawalLimit;
    
    @Column(name = "investment_monthly_withdrawal_limit", nullable = false)
    private Integer investmentMonthlyWithdrawalLimit;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by", nullable = false)
    private String createdBy;
    
    @Column(name = "updated_by", nullable = false)
    private String updatedBy;
    
    // Constructors
    public UserSettings() {}
    
    public UserSettings(Long userId, BigDecimal charityPercentage, BigDecimal spendPercentage, 
                      BigDecimal savingsPercentage, BigDecimal investmentPercentage,
                      Integer savingsMonthlyWithdrawalLimit, Integer investmentMonthlyWithdrawalLimit,
                      String createdBy) {
        this.userId = userId;
        this.charityPercentage = charityPercentage;
        this.spendPercentage = spendPercentage;
        this.savingsPercentage = savingsPercentage;
        this.investmentPercentage = investmentPercentage;
        this.savingsMonthlyWithdrawalLimit = savingsMonthlyWithdrawalLimit;
        this.investmentMonthlyWithdrawalLimit = investmentMonthlyWithdrawalLimit;
        this.createdBy = createdBy;
        this.updatedBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getUpdatedBy() {
        return updatedBy;
    }
    
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
