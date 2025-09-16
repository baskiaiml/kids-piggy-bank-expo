package com.piggybank.entity;

import jakarta.persistence.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "kid_id", nullable = false)
    private Long kidId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;
    
    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;
    
    @Column(name = "charity_amount", precision = 10, scale = 2)
    private BigDecimal charityAmount;
    
    @Column(name = "spend_amount", precision = 10, scale = 2)
    private BigDecimal spendAmount;
    
    @Column(name = "savings_amount", precision = 10, scale = 2)
    private BigDecimal savingsAmount;
    
    @Column(name = "investment_amount", precision = 10, scale = 2)
    private BigDecimal investmentAmount;
    
    @Column(name = "charity_percentage", precision = 5, scale = 2)
    private BigDecimal charityPercentage;
    
    @Column(name = "spend_percentage", precision = 5, scale = 2)
    private BigDecimal spendPercentage;
    
    @Column(name = "savings_percentage", precision = 5, scale = 2)
    private BigDecimal savingsPercentage;
    
    @Column(name = "investment_percentage", precision = 5, scale = 2)
    private BigDecimal investmentPercentage;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "withdrawal_component")
    private ComponentType withdrawalComponent;
    
    @Column(name = "withdrawal_amount", precision = 10, scale = 2)
    private BigDecimal withdrawalAmount;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_by", nullable = false)
    private String createdBy;
    
    // Enums
    public enum TransactionType {
        DEPOSIT, WITHDRAWAL
    }
    
    public enum ComponentType {
        CHARITY, SPEND, SAVINGS, INVESTMENT
    }
    
    // Constructors
    public Transaction() {}
    
    public Transaction(Long userId, Long kidId, TransactionType transactionType, 
                      BigDecimal totalAmount, String description, String createdBy) {
        this.userId = userId;
        this.kidId = kidId;
        this.transactionType = transactionType;
        this.totalAmount = totalAmount;
        this.description = description;
        this.createdBy = createdBy;
        this.transactionDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
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
    
    public Long getKidId() {
        return kidId;
    }
    
    public void setKidId(Long kidId) {
        this.kidId = kidId;
    }
    
    public TransactionType getTransactionType() {
        return transactionType;
    }
    
    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }
    
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public BigDecimal getCharityAmount() {
        return charityAmount;
    }
    
    public void setCharityAmount(BigDecimal charityAmount) {
        this.charityAmount = charityAmount;
    }
    
    public BigDecimal getSpendAmount() {
        return spendAmount;
    }
    
    public void setSpendAmount(BigDecimal spendAmount) {
        this.spendAmount = spendAmount;
    }
    
    public BigDecimal getSavingsAmount() {
        return savingsAmount;
    }
    
    public void setSavingsAmount(BigDecimal savingsAmount) {
        this.savingsAmount = savingsAmount;
    }
    
    public BigDecimal getInvestmentAmount() {
        return investmentAmount;
    }
    
    public void setInvestmentAmount(BigDecimal investmentAmount) {
        this.investmentAmount = investmentAmount;
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
    
    public ComponentType getWithdrawalComponent() {
        return withdrawalComponent;
    }
    
    public void setWithdrawalComponent(ComponentType withdrawalComponent) {
        this.withdrawalComponent = withdrawalComponent;
    }
    
    public BigDecimal getWithdrawalAmount() {
        return withdrawalAmount;
    }
    
    public void setWithdrawalAmount(BigDecimal withdrawalAmount) {
        this.withdrawalAmount = withdrawalAmount;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
