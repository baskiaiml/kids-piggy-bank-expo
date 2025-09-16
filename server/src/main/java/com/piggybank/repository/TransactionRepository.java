package com.piggybank.repository;

import com.piggybank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    /**
     * Find transactions by user ID and kid ID
     */
    List<Transaction> findByUserIdAndKidIdOrderByTransactionDateDesc(Long userId, Long kidId);
    
    /**
     * Find recent transactions by user ID and kid ID with pagination
     */
    Page<Transaction> findByUserIdAndKidIdOrderByTransactionDateDesc(Long userId, Long kidId, Pageable pageable);
    
    /**
     * Find transactions by user ID
     */
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);
    
    /**
     * Get total amount for a specific component for a kid
     */
    @Query("SELECT COALESCE(SUM(t.charityAmount), 0) FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId AND t.transactionType = 'DEPOSIT'")
    BigDecimal getTotalCharityAmount(@Param("userId") Long userId, @Param("kidId") Long kidId);
    
    @Query("SELECT COALESCE(SUM(t.spendAmount), 0) FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId AND t.transactionType = 'DEPOSIT'")
    BigDecimal getTotalSpendAmount(@Param("userId") Long userId, @Param("kidId") Long kidId);
    
    @Query("SELECT COALESCE(SUM(t.savingsAmount), 0) FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId AND t.transactionType = 'DEPOSIT'")
    BigDecimal getTotalSavingsAmount(@Param("userId") Long userId, @Param("kidId") Long kidId);
    
    @Query("SELECT COALESCE(SUM(t.investmentAmount), 0) FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId AND t.transactionType = 'DEPOSIT'")
    BigDecimal getTotalInvestmentAmount(@Param("userId") Long userId, @Param("kidId") Long kidId);
    
    /**
     * Get withdrawal amounts for a specific component for a kid
     */
    @Query("SELECT COALESCE(SUM(t.withdrawalAmount), 0) FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId AND t.transactionType = 'WITHDRAWAL' AND t.withdrawalComponent = :component")
    BigDecimal getTotalWithdrawalAmount(@Param("userId") Long userId, @Param("kidId") Long kidId, @Param("component") Transaction.ComponentType component);
    
    /**
     * Count withdrawals for a specific component in current month
     */
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId AND t.transactionType = 'WITHDRAWAL' AND t.withdrawalComponent = :component AND t.transactionDate >= :startOfMonth")
    Long countWithdrawalsThisMonth(@Param("userId") Long userId, @Param("kidId") Long kidId, @Param("component") Transaction.ComponentType component, @Param("startOfMonth") LocalDateTime startOfMonth);
    
    /**
     * Get available balance for a specific component for a kid
     */
    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'DEPOSIT' THEN t.charityAmount ELSE 0 END), 0) - " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'WITHDRAWAL' AND t.withdrawalComponent = 'CHARITY' THEN t.withdrawalAmount ELSE 0 END), 0) " +
           "FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId")
    BigDecimal getAvailableCharityBalance(@Param("userId") Long userId, @Param("kidId") Long kidId);
    
    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'DEPOSIT' THEN t.spendAmount ELSE 0 END), 0) - " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'WITHDRAWAL' AND t.withdrawalComponent = 'SPEND' THEN t.withdrawalAmount ELSE 0 END), 0) " +
           "FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId")
    BigDecimal getAvailableSpendBalance(@Param("userId") Long userId, @Param("kidId") Long kidId);
    
    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'DEPOSIT' THEN t.savingsAmount ELSE 0 END), 0) - " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'WITHDRAWAL' AND t.withdrawalComponent = 'SAVINGS' THEN t.withdrawalAmount ELSE 0 END), 0) " +
           "FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId")
    BigDecimal getAvailableSavingsBalance(@Param("userId") Long userId, @Param("kidId") Long kidId);
    
    @Query("SELECT " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'DEPOSIT' THEN t.investmentAmount ELSE 0 END), 0) - " +
           "COALESCE(SUM(CASE WHEN t.transactionType = 'WITHDRAWAL' AND t.withdrawalComponent = 'INVESTMENT' THEN t.withdrawalAmount ELSE 0 END), 0) " +
           "FROM Transaction t WHERE t.userId = :userId AND t.kidId = :kidId")
    BigDecimal getAvailableInvestmentBalance(@Param("userId") Long userId, @Param("kidId") Long kidId);
}
