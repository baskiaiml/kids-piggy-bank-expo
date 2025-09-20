package com.piggybank.repository;

import com.piggybank.entity.KidBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface KidBalanceRepository extends JpaRepository<KidBalance, Long> {

    /**
     * Find kid balance by user ID and kid ID
     */
    Optional<KidBalance> findByUserIdAndKidId(Long userId, Long kidId);

    /**
     * Find all kid balances for a user
     */
    List<KidBalance> findByUserIdOrderByLastUpdatedDesc(Long userId);

    /**
     * Check if kid balance exists for a user and kid
     */
    boolean existsByUserIdAndKidId(Long userId, Long kidId);

    /**
     * Get total balances across all kids for a user
     */
    @Query("SELECT " +
            "COALESCE(SUM(kb.charityBalance), 0) as totalCharity, " +
            "COALESCE(SUM(kb.spendBalance), 0) as totalSpend, " +
            "COALESCE(SUM(kb.savingsBalance), 0) as totalSavings, " +
            "COALESCE(SUM(kb.investmentBalance), 0) as totalInvestment, " +
            "COALESCE(SUM(kb.totalBalance), 0) as grandTotal " +
            "FROM KidBalance kb WHERE kb.userId = :userId")
    Object[] getTotalBalancesForUser(@Param("userId") Long userId);

    /**
     * Get balance for a specific component across all kids for a user
     */
    @Query("SELECT COALESCE(SUM(kb.charityBalance), 0) FROM KidBalance kb WHERE kb.userId = :userId")
    BigDecimal getTotalCharityBalance(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(kb.spendBalance), 0) FROM KidBalance kb WHERE kb.userId = :userId")
    BigDecimal getTotalSpendBalance(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(kb.savingsBalance), 0) FROM KidBalance kb WHERE kb.userId = :userId")
    BigDecimal getTotalSavingsBalance(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(kb.investmentBalance), 0) FROM KidBalance kb WHERE kb.userId = :userId")
    BigDecimal getTotalInvestmentBalance(@Param("userId") Long userId);
}
