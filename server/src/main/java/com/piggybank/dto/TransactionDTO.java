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
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
    
    private LocalDateTime transactionDate;
    
    // Constructors
    public TransactionDTO() {}
    
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
}
