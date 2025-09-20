package com.piggybank.service;

import com.piggybank.dto.KidDetailsDTO;
import com.piggybank.dto.TransactionDTO;
import com.piggybank.entity.Kid;
import com.piggybank.entity.Transaction;
import com.piggybank.entity.UserSettings;
import com.piggybank.repository.KidRepository;
import com.piggybank.repository.TransactionRepository;
import com.piggybank.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private KidRepository kidRepository;

    @Autowired
    private KidBalanceService kidBalanceService;

    @Autowired
    private LoggingService loggingService;

    /**
     * Process a deposit transaction
     */
    public Transaction processDeposit(Long userId, TransactionDTO transactionDTO, String createdBy) {
        // Get user settings
        UserSettings settings = getUserSettings(userId, createdBy);

        // Calculate component amounts based on percentages
        BigDecimal totalAmount = transactionDTO.getAmount();
        BigDecimal charityAmount = totalAmount.multiply(settings.getCharityPercentage()).divide(new BigDecimal("100"));
        BigDecimal spendAmount = totalAmount.multiply(settings.getSpendPercentage()).divide(new BigDecimal("100"));
        BigDecimal savingsAmount = totalAmount.multiply(settings.getSavingsPercentage()).divide(new BigDecimal("100"));
        BigDecimal investmentAmount = totalAmount.multiply(settings.getInvestmentPercentage())
                .divide(new BigDecimal("100"));

        // Create transaction
        Transaction transaction = new Transaction(
                userId,
                transactionDTO.getKidId(),
                Transaction.TransactionType.DEPOSIT,
                totalAmount,
                transactionDTO.getDescription(),
                createdBy);

        // Set component amounts and percentages
        transaction.setCharityAmount(charityAmount);
        transaction.setSpendAmount(spendAmount);
        transaction.setSavingsAmount(savingsAmount);
        transaction.setInvestmentAmount(investmentAmount);
        transaction.setCharityPercentage(settings.getCharityPercentage());
        transaction.setSpendPercentage(settings.getSpendPercentage());
        transaction.setSavingsPercentage(settings.getSavingsPercentage());
        transaction.setInvestmentPercentage(settings.getInvestmentPercentage());

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Update kid balance
        kidBalanceService.updateBalanceForDeposit(userId, transactionDTO.getKidId(),
                charityAmount, spendAmount, savingsAmount, investmentAmount, createdBy);

        loggingService.logTransaction(userId, transactionDTO.getKidId(), "DEPOSIT", totalAmount, createdBy);

        return savedTransaction;
    }

    /**
     * Process a withdrawal transaction
     */
    public Transaction processWithdrawal(Long userId, TransactionDTO transactionDTO, String createdBy) {
        // Validate withdrawal limits
        validateWithdrawalLimits(userId, transactionDTO.getKidId(), transactionDTO.getWithdrawalComponent());

        // Check available balance
        BigDecimal availableBalance = getAvailableBalance(userId, transactionDTO.getKidId(),
                transactionDTO.getWithdrawalComponent());
        if (availableBalance.compareTo(transactionDTO.getAmount()) < 0) {
            throw new IllegalArgumentException(
                    "Insufficient balance in " + transactionDTO.getWithdrawalComponent() + " component");
        }

        // Create withdrawal transaction
        Transaction transaction = new Transaction(
                userId,
                transactionDTO.getKidId(),
                Transaction.TransactionType.WITHDRAWAL,
                transactionDTO.getAmount(),
                transactionDTO.getDescription(),
                createdBy);

        transaction.setWithdrawalComponent(transactionDTO.getWithdrawalComponent());
        transaction.setWithdrawalAmount(transactionDTO.getAmount());

        Transaction savedTransaction = transactionRepository.save(transaction);

        // Update kid balance
        kidBalanceService.updateBalance(userId, transactionDTO.getKidId(),
                transactionDTO.getWithdrawalComponent(), transactionDTO.getAmount(), false, createdBy);

        loggingService.logTransaction(userId, transactionDTO.getKidId(), "WITHDRAWAL", transactionDTO.getAmount(),
                createdBy);

        return savedTransaction;
    }

    /**
     * Get kid details with balances and recent transactions
     */
    @Transactional(readOnly = true)
    public KidDetailsDTO getKidDetails(Long userId, Long kidId) {
        // Get kid information
        Optional<Kid> kidOpt = kidRepository.findByIdAndUserId(kidId, userId);
        if (kidOpt.isEmpty()) {
            throw new IllegalArgumentException("Kid not found");
        }

        Kid kid = kidOpt.get();

        // Get component balances from KidBalanceService
        BigDecimal charityBalance = kidBalanceService.getAvailableBalance(userId, kidId,
                Transaction.ComponentType.CHARITY);
        BigDecimal spendBalance = kidBalanceService.getAvailableBalance(userId, kidId, Transaction.ComponentType.SPEND);
        BigDecimal savingsBalance = kidBalanceService.getAvailableBalance(userId, kidId,
                Transaction.ComponentType.SAVINGS);
        BigDecimal investmentBalance = kidBalanceService.getAvailableBalance(userId, kidId,
                Transaction.ComponentType.INVESTMENT);

        // Create kid details DTO
        KidDetailsDTO kidDetails = new KidDetailsDTO(
                kidId,
                kid.getName(),
                kid.getAge(),
                charityBalance,
                spendBalance,
                savingsBalance,
                investmentBalance);

        // Get recent transactions (last 10)
        Pageable pageable = PageRequest.of(0, 10);
        Page<Transaction> transactions = transactionRepository.findByUserIdAndKidIdOrderByTransactionDateDesc(userId,
                kidId, pageable);

        List<KidDetailsDTO.TransactionSummaryDTO> recentTransactions = new ArrayList<>();
        for (Transaction transaction : transactions.getContent()) {
            String component = transaction.getTransactionType() == Transaction.TransactionType.DEPOSIT ? "ALL"
                    : transaction.getWithdrawalComponent().toString();

            BigDecimal amount = transaction.getTransactionType() == Transaction.TransactionType.DEPOSIT
                    ? transaction.getTotalAmount()
                    : transaction.getWithdrawalAmount();

            recentTransactions.add(new KidDetailsDTO.TransactionSummaryDTO(
                    transaction.getId(),
                    transaction.getTransactionType().toString(),
                    amount,
                    component,
                    transaction.getDescription(),
                    transaction.getTransactionDate()));
        }

        kidDetails.setRecentTransactions(recentTransactions);

        return kidDetails;
    }

    /**
     * Get available balance for a specific component
     */
    @Transactional(readOnly = true)
    public BigDecimal getAvailableBalance(Long userId, Long kidId, Transaction.ComponentType component) {
        return kidBalanceService.getAvailableBalance(userId, kidId, component);
    }

    /**
     * Validate withdrawal limits
     */
    private void validateWithdrawalLimits(Long userId, Long kidId, Transaction.ComponentType component) {
        if (component == Transaction.ComponentType.CHARITY || component == Transaction.ComponentType.SPEND) {
            // No limits for charity and spend
            return;
        }

        // Get user settings
        Optional<UserSettings> settingsOpt = userSettingsRepository.findByUserId(userId);
        if (settingsOpt.isEmpty()) {
            throw new IllegalArgumentException("User settings not found");
        }

        UserSettings settings = settingsOpt.get();

        // Get current month start
        LocalDateTime startOfMonth = YearMonth.now().atDay(1).atStartOfDay();

        // Check withdrawal limits for savings and investment
        if (component == Transaction.ComponentType.SAVINGS) {
            Long withdrawalsThisMonth = transactionRepository.countWithdrawalsThisMonth(userId, kidId, component,
                    startOfMonth);
            if (withdrawalsThisMonth >= settings.getSavingsMonthlyWithdrawalLimit()) {
                throw new IllegalArgumentException("Monthly withdrawal limit reached for Savings component. Limit: " +
                        settings.getSavingsMonthlyWithdrawalLimit());
            }
        } else if (component == Transaction.ComponentType.INVESTMENT) {
            Long withdrawalsThisMonth = transactionRepository.countWithdrawalsThisMonth(userId, kidId, component,
                    startOfMonth);
            if (withdrawalsThisMonth >= settings.getInvestmentMonthlyWithdrawalLimit()) {
                throw new IllegalArgumentException(
                        "Monthly withdrawal limit reached for Investment component. Limit: " +
                                settings.getInvestmentMonthlyWithdrawalLimit());
            }
        }
    }

    /**
     * Get user settings or create default if not exists
     */
    private UserSettings getUserSettings(Long userId, String createdBy) {
        Optional<UserSettings> settingsOpt = userSettingsRepository.findByUserId(userId);
        if (settingsOpt.isEmpty()) {
            // Create default settings
            UserSettingsService settingsService = new UserSettingsService();
            settingsService.setUserSettingsRepository(userSettingsRepository);
            settingsService.setLoggingService(loggingService);
            return settingsService.getDefaultSettings(userId, createdBy);
        }
        return settingsOpt.get();
    }

    // Setter methods for dependency injection
    public void setTransactionRepository(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public void setUserSettingsRepository(UserSettingsRepository userSettingsRepository) {
        this.userSettingsRepository = userSettingsRepository;
    }

    public void setKidRepository(KidRepository kidRepository) {
        this.kidRepository = kidRepository;
    }

    public void setLoggingService(LoggingService loggingService) {
        this.loggingService = loggingService;
    }

    public void setKidBalanceService(KidBalanceService kidBalanceService) {
        this.kidBalanceService = kidBalanceService;
    }
}
