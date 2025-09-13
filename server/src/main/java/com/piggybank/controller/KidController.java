package com.piggybank.controller;

import com.piggybank.entity.Kid;
import com.piggybank.service.JwtTokenService;
import com.piggybank.service.KidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kids")
@CrossOrigin(origins = "*")
public class KidController {
    
    @Autowired
    private KidService kidService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getKids(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<Kid> kids = kidService.getKidsByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("kids", kids);
            response.put("message", "Kids retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
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
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("kid", kid);
            response.put("message", "Kid added successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
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
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("kid", updatedKid);
            response.put("message", "Kid updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
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
            
            kidService.deleteKid(kidId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Kid deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
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