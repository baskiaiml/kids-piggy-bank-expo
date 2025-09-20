package com.piggybank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class KidBalanceDTO {

    private Long kidId;
    private String kidName;
    private Integer kidAge;
    private BigDecimal charityBalance;
    private BigDecimal spendBalance;
    private BigDecimal savingsBalance;
    private BigDecimal investmentBalance;
    private BigDecimal totalBalance;
    private LocalDateTime lastUpdated;

    // Constructors
    public KidBalanceDTO() {
    }

    public KidBalanceDTO(Long kidId, String kidName, Integer kidAge,
            BigDecimal charityBalance, BigDecimal spendBalance,
            BigDecimal savingsBalance, BigDecimal investmentBalance,
            BigDecimal totalBalance, LocalDateTime lastUpdated) {
        this.kidId = kidId;
        this.kidName = kidName;
        this.kidAge = kidAge;
        this.charityBalance = charityBalance;
        this.spendBalance = spendBalance;
        this.savingsBalance = savingsBalance;
        this.investmentBalance = investmentBalance;
        this.totalBalance = totalBalance;
        this.lastUpdated = lastUpdated;
    }

    // Getters and Setters
    public Long getKidId() {
        return kidId;
    }

    public void setKidId(Long kidId) {
        this.kidId = kidId;
    }

    public String getKidName() {
        return kidName;
    }

    public void setKidName(String kidName) {
        this.kidName = kidName;
    }

    public Integer getKidAge() {
        return kidAge;
    }

    public void setKidAge(Integer kidAge) {
        this.kidAge = kidAge;
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
}
