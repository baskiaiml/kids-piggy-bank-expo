package com.piggybank.dto;

import com.piggybank.entity.Transaction;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDTO {

    @NotNull(message = "Kid ID is required")
    private Long kidId;

    @NotNull(message = "Transaction type is required")
    private Transaction.TransactionType transactionType;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private Transaction.ComponentType withdrawalComponent;

    // Component amounts for deposits
    private BigDecimal charityAmount;
    private BigDecimal spendAmount;
    private BigDecimal savingsAmount;
    private BigDecimal investmentAmount;

    // Component percentages for deposits
    private BigDecimal charityPercentage;
    private BigDecimal spendPercentage;
    private BigDecimal savingsPercentage;
    private BigDecimal investmentPercentage;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private LocalDateTime transactionDate;

    // Constructors
    public TransactionDTO() {
    }

    public TransactionDTO(Long kidId, Transaction.TransactionType transactionType,
            BigDecimal amount, String description) {
        this.kidId = kidId;
        this.transactionType = transactionType;
        this.amount = amount;
        this.description = description;
    }

    // Getters and Setters
    public Long getKidId() {
        return kidId;
    }

    public void setKidId(Long kidId) {
        this.kidId = kidId;
    }

    public Transaction.TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(Transaction.TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Transaction.ComponentType getWithdrawalComponent() {
        return withdrawalComponent;
    }

    public void setWithdrawalComponent(Transaction.ComponentType withdrawalComponent) {
        this.withdrawalComponent = withdrawalComponent;
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

    // Component amounts getters and setters
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

    // Component percentages getters and setters
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
}
