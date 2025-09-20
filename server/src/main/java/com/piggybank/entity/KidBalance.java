package com.piggybank.entity;

import jakarta.persistence.*;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kid_balances")
@Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
public class KidBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "kid_id", nullable = false)
    private Long kidId;

    @Column(name = "charity_balance", precision = 10, scale = 2, nullable = false)
    private BigDecimal charityBalance;

    @Column(name = "spend_balance", precision = 10, scale = 2, nullable = false)
    private BigDecimal spendBalance;

    @Column(name = "savings_balance", precision = 10, scale = 2, nullable = false)
    private BigDecimal savingsBalance;

    @Column(name = "investment_balance", precision = 10, scale = 2, nullable = false)
    private BigDecimal investmentBalance;

    @Column(name = "total_balance", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalBalance;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "updated_by", nullable = false)
    private String updatedBy;

    // Constructors
    public KidBalance() {
    }

    public KidBalance(Long userId, Long kidId, String createdBy) {
        this.userId = userId;
        this.kidId = kidId;
        this.charityBalance = BigDecimal.ZERO;
        this.spendBalance = BigDecimal.ZERO;
        this.savingsBalance = BigDecimal.ZERO;
        this.investmentBalance = BigDecimal.ZERO;
        this.totalBalance = BigDecimal.ZERO;
        this.createdBy = createdBy;
        this.updatedBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
        // Recalculate total balance
        this.totalBalance = this.charityBalance
                .add(this.spendBalance)
                .add(this.savingsBalance)
                .add(this.investmentBalance);
    }

    // Helper method to update balances
    public void updateBalance(Transaction.ComponentType component, BigDecimal amount, boolean isDeposit) {
        BigDecimal change = isDeposit ? amount : amount.negate();

        switch (component) {
            case CHARITY:
                this.charityBalance = this.charityBalance.add(change);
                break;
            case SPEND:
                this.spendBalance = this.spendBalance.add(change);
                break;
            case SAVINGS:
                this.savingsBalance = this.savingsBalance.add(change);
                break;
            case INVESTMENT:
                this.investmentBalance = this.investmentBalance.add(change);
                break;
        }

        // Update total balance
        this.totalBalance = this.charityBalance
                .add(this.spendBalance)
                .add(this.savingsBalance)
                .add(this.investmentBalance);
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

    public BigDecimal getCharityBalance() {
        return charityBalance;
    }

    public void setCharityBalance(BigDecimal charityBalance) {
        this.charityBalance = charityBalance;
    }

    public BigDecimal getSpendBalance() {
        return spendBalance;
    }

    public void setSpendBalance(BigDecimal spendBalance) {
        this.spendBalance = spendBalance;
    }

    public BigDecimal getSavingsBalance() {
        return savingsBalance;
    }

    public void setSavingsBalance(BigDecimal savingsBalance) {
        this.savingsBalance = savingsBalance;
    }

    public BigDecimal getInvestmentBalance() {
        return investmentBalance;
    }

    public void setInvestmentBalance(BigDecimal investmentBalance) {
        this.investmentBalance = investmentBalance;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
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
