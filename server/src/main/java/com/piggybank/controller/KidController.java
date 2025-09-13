package com.piggybank.controller;

import com.piggybank.response.KidResponse;
import com.piggybank.entity.Kid;
import com.piggybank.service.JwtTokenService;
import com.piggybank.service.KidService;
import com.piggybank.service.LoggingService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/kids")
@CrossOrigin(origins = "*")
public class KidController {
    
    private static final Logger logger = LoggerFactory.getLogger(KidController.class);
    
    @Autowired
    private KidService kidService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Autowired
    private LoggingService loggingService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getKids(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<Kid> kids = kidService.getKidsByUserId(userId);
            
            // Convert to DTOs to avoid circular references
            List<KidResponse> kidResponses = kids.stream()
                .map(KidResponse::new)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("kids", kidResponses);
            response.put("message", "Kids retrieved successfully");
            
            logger.info("Retrieved {} kids for user ID: {}", kidResponses.size(), userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to retrieve kids: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> addKid(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody Map<String, Object> request) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            String name = (String) request.get("name");
            Integer age = (Integer) request.get("age");
            
            if (name == null || name.trim().isEmpty()) {
                throw new IllegalArgumentException("Name is required");
            }
            if (age == null || age < 1 || age > 21) {
                throw new IllegalArgumentException("Age must be between 1 and 21");
            }
            
            Kid kid = kidService.addKid(userId, name.trim(), age);
            KidResponse kidResponse = new KidResponse(kid);
            
            // Log the kid addition
            loggingService.logKidAdded("authenticated", userId, name.trim(), kid.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("kid", kidResponse);
            response.put("message", "Kid added successfully");
            
            logger.info("Kid '{}' added successfully for user ID: {}", name.trim(), userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to add kid: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{kidId}")
    public ResponseEntity<Map<String, Object>> updateKid(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long kidId,
            @Valid @RequestBody Map<String, Object> request) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            String name = (String) request.get("name");
            Integer age = (Integer) request.get("age");
            
            // Verify the kid belongs to the user
            Kid existingKid = kidService.getKidById(kidId)
                .orElseThrow(() -> new IllegalArgumentException("Kid not found"));
            
            if (!existingKid.getUser().getId().equals(userId)) {
                throw new IllegalArgumentException("Unauthorized access to kid");
            }
            
            Kid updatedKid = kidService.updateKid(kidId, name, age);
            KidResponse kidResponse = new KidResponse(updatedKid);
            
            // Log the kid update
            loggingService.logKidUpdated("authenticated", userId, updatedKid.getName(), kidId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("kid", kidResponse);
            response.put("message", "Kid updated successfully");
            
            logger.info("Kid '{}' updated successfully for user ID: {}", updatedKid.getName(), userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to update kid ID {}: {}", kidId, e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{kidId}")
    public ResponseEntity<Map<String, Object>> deleteKid(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long kidId) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            
            // Verify the kid belongs to the user
            Kid existingKid = kidService.getKidById(kidId)
                .orElseThrow(() -> new IllegalArgumentException("Kid not found"));
            
            if (!existingKid.getUser().getId().equals(userId)) {
                throw new IllegalArgumentException("Unauthorized access to kid");
            }
            
            String kidName = existingKid.getName();
            kidService.deleteKid(kidId);
            
            // Log the kid deletion
            loggingService.logKidDeleted("authenticated", userId, kidName, kidId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Kid deleted successfully");
            
            logger.info("Kid '{}' deleted successfully for user ID: {}", kidName, userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to delete kid ID {}: {}", kidId, e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    private Long extractUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid authorization header");
        }
        
        String token = authHeader.substring(7);
        return jwtTokenService.getUserIdFromToken(token);
    }
} 