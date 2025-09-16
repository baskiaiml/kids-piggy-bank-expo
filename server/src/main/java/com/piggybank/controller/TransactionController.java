package com.piggybank.controller;

import com.piggybank.dto.KidDetailsDTO;
import com.piggybank.dto.TransactionDTO;
import com.piggybank.entity.Transaction;
import com.piggybank.service.JwtTokenService;
import com.piggybank.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    /**
     * Process a deposit transaction
     */
    @PostMapping("/deposit")
    public ResponseEntity<?> processDeposit(@RequestHeader("Authorization") String authHeader,
                                          @Valid @RequestBody TransactionDTO transactionDTO) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            String phoneNumber = jwtTokenService.getPhoneNumberFromToken(token);
            
            logger.debug("Processing deposit for user: {}, kid: {}, amount: {}", 
                        userId, transactionDTO.getKidId(), transactionDTO.getAmount());
            
            Transaction transaction = transactionService.processDeposit(userId, transactionDTO, phoneNumber);
            
            return ResponseEntity.ok(new ApiResponse(true, "Deposit processed successfully", 
                new TransactionResponse(transaction)));
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid deposit data: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error processing deposit: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to process deposit: " + e.getMessage()));
        }
    }
    
    /**
     * Process a withdrawal transaction
     */
    @PostMapping("/withdraw")
    public ResponseEntity<?> processWithdrawal(@RequestHeader("Authorization") String authHeader,
                                             @Valid @RequestBody TransactionDTO transactionDTO) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            String phoneNumber = jwtTokenService.getPhoneNumberFromToken(token);
            
            logger.debug("Processing withdrawal for user: {}, kid: {}, component: {}, amount: {}", 
                        userId, transactionDTO.getKidId(), transactionDTO.getWithdrawalComponent(), transactionDTO.getAmount());
            
            Transaction transaction = transactionService.processWithdrawal(userId, transactionDTO, phoneNumber);
            
            return ResponseEntity.ok(new ApiResponse(true, "Withdrawal processed successfully", 
                new TransactionResponse(transaction)));
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid withdrawal data: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error processing withdrawal: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to process withdrawal: " + e.getMessage()));
        }
    }
    
    /**
     * Get kid details with balances and recent transactions
     */
    @GetMapping("/kid/{kidId}")
    public ResponseEntity<?> getKidDetails(@RequestHeader("Authorization") String authHeader,
                                         @PathVariable Long kidId) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            
            logger.debug("Getting kid details for user: {}, kid: {}", userId, kidId);
            
            KidDetailsDTO kidDetails = transactionService.getKidDetails(userId, kidId);
            
            return ResponseEntity.ok(new ApiResponse(true, "Kid details retrieved successfully", kidDetails));
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid kid details request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error getting kid details: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to get kid details: " + e.getMessage()));
        }
    }
    
    /**
     * Get available balance for a specific component
     */
    @GetMapping("/balance/{kidId}/{component}")
    public ResponseEntity<?> getAvailableBalance(@RequestHeader("Authorization") String authHeader,
                                               @PathVariable Long kidId,
                                               @PathVariable String component) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            
            logger.debug("Getting balance for user: {}, kid: {}, component: {}", userId, kidId, component);
            
            Transaction.ComponentType componentType = Transaction.ComponentType.valueOf(component.toUpperCase());
            BigDecimal balance = transactionService.getAvailableBalance(userId, kidId, componentType);
            
            return ResponseEntity.ok(new ApiResponse(true, "Balance retrieved successfully", 
                new BalanceResponse(component, balance)));
            
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid balance request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error getting balance: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to get balance: " + e.getMessage()));
        }
    }
    
    // Inner classes for API responses
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
        
        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
        
        public ApiResponse(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }
        
        // Getters and Setters
        public boolean isSuccess() {
            return success;
        }
        
        public void setSuccess(boolean success) {
            this.success = success;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public Object getData() {
            return data;
        }
        
        public void setData(Object data) {
            this.data = data;
        }
    }
    
    public static class TransactionResponse {
        private Long transactionId;
        private String transactionType;
        private BigDecimal totalAmount;
        private BigDecimal charityAmount;
        private BigDecimal spendAmount;
        private BigDecimal savingsAmount;
        private BigDecimal investmentAmount;
        private String description;
        
        public TransactionResponse(Transaction transaction) {
            this.transactionId = transaction.getId();
            this.transactionType = transaction.getTransactionType().toString();
            this.totalAmount = transaction.getTotalAmount();
            this.charityAmount = transaction.getCharityAmount();
            this.spendAmount = transaction.getSpendAmount();
            this.savingsAmount = transaction.getSavingsAmount();
            this.investmentAmount = transaction.getInvestmentAmount();
            this.description = transaction.getDescription();
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
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
    }
    
    public static class BalanceResponse {
        private String component;
        private BigDecimal balance;
        
        public BalanceResponse(String component, BigDecimal balance) {
            this.component = component;
            this.balance = balance;
        }
        
        // Getters and Setters
        public String getComponent() {
            return component;
        }
        
        public void setComponent(String component) {
            this.component = component;
        }
        
        public BigDecimal getBalance() {
            return balance;
        }
        
        public void setBalance(BigDecimal balance) {
            this.balance = balance;
        }
    }
}
