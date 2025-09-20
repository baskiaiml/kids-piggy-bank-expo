package com.piggybank.controller;

import com.piggybank.dto.KidBalanceDTO;
import com.piggybank.service.JwtTokenService;
import com.piggybank.service.KidBalanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/balances")
@CrossOrigin(origins = "*")
public class KidBalanceController {

    private static final Logger logger = LoggerFactory.getLogger(KidBalanceController.class);

    @Autowired
    private KidBalanceService kidBalanceService;

    @Autowired
    private JwtTokenService jwtTokenService;

    /**
     * Get balance details for a specific kid
     */
    @GetMapping("/kid/{kidId}")
    public ResponseEntity<?> getKidBalance(@RequestHeader("Authorization") String authHeader,
            @PathVariable Long kidId) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);

            logger.debug("Getting balance for user: {}, kid: {}", userId, kidId);

            KidBalanceDTO balance = kidBalanceService.getKidBalanceDetails(userId, kidId);

            return ResponseEntity.ok(new ApiResponse(true, "Balance retrieved successfully", balance));

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid balance request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Error getting kid balance: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Failed to get balance: " + e.getMessage()));
        }
    }

    /**
     * Get all kid balances for a user
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllKidBalances(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);

            logger.debug("Getting all balances for user: {}", userId);

            List<KidBalanceDTO> balances = kidBalanceService.getAllKidBalances(userId);

            return ResponseEntity.ok(new ApiResponse(true, "Balances retrieved successfully", balances));

        } catch (Exception e) {
            logger.error("Error getting all kid balances: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to get balances: " + e.getMessage()));
        }
    }

    /**
     * Get total balances across all kids for a user
     */
    @GetMapping("/totals")
    public ResponseEntity<?> getTotalBalances(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtTokenService.getUserIdFromToken(token);

            logger.debug("Getting total balances for user: {}", userId);

            KidBalanceDTO totals = kidBalanceService.getTotalBalancesForUser(userId);

            return ResponseEntity.ok(new ApiResponse(true, "Total balances retrieved successfully", totals));

        } catch (Exception e) {
            logger.error("Error getting total balances: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to get total balances: " + e.getMessage()));
        }
    }

    // Inner class for API responses
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
}
