package com.piggybank.service;

import com.piggybank.dto.KidBalanceDTO;
import com.piggybank.entity.Kid;
import com.piggybank.entity.KidBalance;
import com.piggybank.entity.Transaction;
import com.piggybank.repository.KidBalanceRepository;
import com.piggybank.repository.KidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class KidBalanceService {

    @Autowired
    private KidBalanceRepository kidBalanceRepository;

    @Autowired
    private KidRepository kidRepository;

    @Autowired
    private LoggingService loggingService;

    /**
     * Get or create kid balance for a user and kid
     */
    public KidBalance getOrCreateKidBalance(Long userId, Long kidId, String createdBy) {
        Optional<KidBalance> existingBalance = kidBalanceRepository.findByUserIdAndKidId(userId, kidId);

        if (existingBalance.isPresent()) {
            return existingBalance.get();
        }

        // Create new balance record
        KidBalance newBalance = new KidBalance(userId, kidId, createdBy);
        KidBalance savedBalance = kidBalanceRepository.save(newBalance);

        loggingService.logKidBalanceUpdate(userId, kidId, "Balance record created", createdBy);

        return savedBalance;
    }

    /**
     * Update kid balance after a transaction
     */
    public KidBalance updateBalance(Long userId, Long kidId, Transaction.ComponentType component,
            BigDecimal amount, boolean isDeposit, String updatedBy) {
        KidBalance balance = getOrCreateKidBalance(userId, kidId, updatedBy);

        // Update the balance
        balance.updateBalance(component, amount, isDeposit);
        balance.setUpdatedBy(updatedBy);

        KidBalance updatedBalance = kidBalanceRepository.save(balance);

        String action = isDeposit ? "Deposit" : "Withdrawal";
        loggingService.logKidBalanceUpdate(userId, kidId,
                String.format("%s %s: %s", action, component, amount), updatedBy);

        return updatedBalance;
    }

    /**
     * Update balance for deposit transaction (affects all components)
     */
    public KidBalance updateBalanceForDeposit(Long userId, Long kidId,
            BigDecimal charityAmount, BigDecimal spendAmount,
            BigDecimal savingsAmount, BigDecimal investmentAmount,
            String updatedBy) {
        KidBalance balance = getOrCreateKidBalance(userId, kidId, updatedBy);

        // Update all components
        balance.setCharityBalance(balance.getCharityBalance().add(charityAmount));
        balance.setSpendBalance(balance.getSpendBalance().add(spendAmount));
        balance.setSavingsBalance(balance.getSavingsBalance().add(savingsAmount));
        balance.setInvestmentBalance(balance.getInvestmentBalance().add(investmentAmount));
        balance.setUpdatedBy(updatedBy);

        KidBalance updatedBalance = kidBalanceRepository.save(balance);

        loggingService.logKidBalanceUpdate(userId, kidId,
                String.format("Deposit: Charity=%s, Spend=%s, Savings=%s, Investment=%s",
                        charityAmount, spendAmount, savingsAmount, investmentAmount),
                updatedBy);

        return updatedBalance;
    }

    /**
     * Get kid balance details with kid information
     */
    @Transactional(readOnly = true)
    public KidBalanceDTO getKidBalanceDetails(Long userId, Long kidId) {
        Optional<KidBalance> balanceOpt = kidBalanceRepository.findByUserIdAndKidId(userId, kidId);
        Optional<Kid> kidOpt = kidRepository.findByIdAndUserId(kidId, userId);

        if (kidOpt.isEmpty()) {
            throw new IllegalArgumentException("Kid not found");
        }

        Kid kid = kidOpt.get();

        if (balanceOpt.isEmpty()) {
            // Return zero balances if no balance record exists
            return new KidBalanceDTO(
                    kidId,
                    kid.getName(),
                    kid.getAge(),
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    null);
        }

        KidBalance balance = balanceOpt.get();
        return new KidBalanceDTO(
                kidId,
                kid.getName(),
                kid.getAge(),
                balance.getCharityBalance(),
                balance.getSpendBalance(),
                balance.getSavingsBalance(),
                balance.getInvestmentBalance(),
                balance.getTotalBalance(),
                balance.getLastUpdated());
    }

    /**
     * Get all kid balances for a user
     */
    @Transactional(readOnly = true)
    public List<KidBalanceDTO> getAllKidBalances(Long userId) {
        List<KidBalance> balances = kidBalanceRepository.findByUserIdOrderByLastUpdatedDesc(userId);
        List<KidBalanceDTO> balanceDTOs = new ArrayList<>();

        for (KidBalance balance : balances) {
            Optional<Kid> kidOpt = kidRepository.findByIdAndUserId(balance.getKidId(), userId);
            if (kidOpt.isPresent()) {
                Kid kid = kidOpt.get();
                balanceDTOs.add(new KidBalanceDTO(
                        balance.getKidId(),
                        kid.getName(),
                        kid.getAge(),
                        balance.getCharityBalance(),
                        balance.getSpendBalance(),
                        balance.getSavingsBalance(),
                        balance.getInvestmentBalance(),
                        balance.getTotalBalance(),
                        balance.getLastUpdated()));
            }
        }

        return balanceDTOs;
    }

    /**
     * Get total balances across all kids for a user
     */
    @Transactional(readOnly = true)
    public KidBalanceDTO getTotalBalancesForUser(Long userId) {
        Object[] totals = kidBalanceRepository.getTotalBalancesForUser(userId);

        BigDecimal totalCharity = (BigDecimal) totals[0];
        BigDecimal totalSpend = (BigDecimal) totals[1];
        BigDecimal totalSavings = (BigDecimal) totals[2];
        BigDecimal totalInvestment = (BigDecimal) totals[3];
        BigDecimal grandTotal = (BigDecimal) totals[4];

        return new KidBalanceDTO(
                null, // No specific kid ID for totals
                "Total",
                null, // No age for totals
                totalCharity,
                totalSpend,
                totalSavings,
                totalInvestment,
                grandTotal,
                null);
    }

    /**
     * Get available balance for a specific component
     */
    @Transactional(readOnly = true)
    public BigDecimal getAvailableBalance(Long userId, Long kidId, Transaction.ComponentType component) {
        Optional<KidBalance> balanceOpt = kidBalanceRepository.findByUserIdAndKidId(userId, kidId);

        if (balanceOpt.isEmpty()) {
            return BigDecimal.ZERO;
        }

        KidBalance balance = balanceOpt.get();

        return switch (component) {
            case CHARITY -> balance.getCharityBalance();
            case SPEND -> balance.getSpendBalance();
            case SAVINGS -> balance.getSavingsBalance();
            case INVESTMENT -> balance.getInvestmentBalance();
        };
    }

    // Setter methods for dependency injection
    public void setKidBalanceRepository(KidBalanceRepository kidBalanceRepository) {
        this.kidBalanceRepository = kidBalanceRepository;
    }

    public void setKidRepository(KidRepository kidRepository) {
        this.kidRepository = kidRepository;
    }

    public void setLoggingService(LoggingService loggingService) {
        this.loggingService = loggingService;
    }
}
