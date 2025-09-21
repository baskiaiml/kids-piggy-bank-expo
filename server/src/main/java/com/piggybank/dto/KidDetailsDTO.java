package com.piggybank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class KidDetailsDTO {

    private Long kidId;
    private String kidName;
    private Integer kidAge;
    private BigDecimal totalCharityAmount;
    private BigDecimal totalSpendAmount;
    private BigDecimal totalSavingsAmount;
    private BigDecimal totalInvestmentAmount;
    private BigDecimal totalBalance;
    private List<TransactionSummaryDTO> recentTransactions;

    // Constructors
    public KidDetailsDTO() {
    }

    public KidDetailsDTO(Long kidId, String kidName, Integer kidAge,
            BigDecimal totalCharityAmount, BigDecimal totalSpendAmount,
            BigDecimal totalSavingsAmount, BigDecimal totalInvestmentAmount) {
        this.kidId = kidId;
        this.kidName = kidName;
        this.kidAge = kidAge;
        this.totalCharityAmount = totalCharityAmount;
        this.totalSpendAmount = totalSpendAmount;
        this.totalSavingsAmount = totalSavingsAmount;
        this.totalInvestmentAmount = totalInvestmentAmount;
        this.totalBalance = totalCharityAmount.add(totalSpendAmount)
                .add(totalSavingsAmount)
                .add(totalInvestmentAmount);
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

    public BigDecimal getTotalCharityAmount() {
        return totalCharityAmount;
    }

    public void setTotalCharityAmount(BigDecimal totalCharityAmount) {
        this.totalCharityAmount = totalCharityAmount;
    }

    public BigDecimal getTotalSpendAmount() {
        return totalSpendAmount;
    }

    public void setTotalSpendAmount(BigDecimal totalSpendAmount) {
        this.totalSpendAmount = totalSpendAmount;
    }

    public BigDecimal getTotalSavingsAmount() {
        return totalSavingsAmount;
    }

    public void setTotalSavingsAmount(BigDecimal totalSavingsAmount) {
        this.totalSavingsAmount = totalSavingsAmount;
    }

    public BigDecimal getTotalInvestmentAmount() {
        return totalInvestmentAmount;
    }

    public void setTotalInvestmentAmount(BigDecimal totalInvestmentAmount) {
        this.totalInvestmentAmount = totalInvestmentAmount;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public List<TransactionSummaryDTO> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionSummaryDTO> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    // Inner class for transaction summary
    public static class TransactionSummaryDTO {
        private Long transactionId;
        private String transactionType;
        private BigDecimal amount;
        private String component;
        private String description;
        private LocalDateTime transactionDate;

        // Component amounts for deposits
        private BigDecimal charityAmount;
        private BigDecimal spendAmount;
        private BigDecimal savingsAmount;
        private BigDecimal investmentAmount;

        // Withdrawal component for withdrawals
        private String withdrawalComponent;

        // Constructors
        public TransactionSummaryDTO() {
        }

        public TransactionSummaryDTO(Long transactionId, String transactionType,
                BigDecimal amount, String component,
                String description, LocalDateTime transactionDate) {
            this.transactionId = transactionId;
            this.transactionType = transactionType;
            this.amount = amount;
            this.component = component;
            this.description = description;
            this.transactionDate = transactionDate;
        }

        // Getters and Setters
        public Long getTransactionId() {
            return transactionId;
        }

        public void setTransactionId(Long transactionId) {
            this.transactionId = transactionId;
        }

        public String getTransactionType() {
            return transactionType;
        }

        public void setTransactionType(String transactionType) {
            this.transactionType = transactionType;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getComponent() {
            return component;
        }

        public void setComponent(String component) {
            this.component = component;
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

        // Withdrawal component getter and setter
        public String getWithdrawalComponent() {
            return withdrawalComponent;
        }

        public void setWithdrawalComponent(String withdrawalComponent) {
            this.withdrawalComponent = withdrawalComponent;
        }
    }
}
