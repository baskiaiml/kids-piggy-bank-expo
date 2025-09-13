package com.piggybank.controller;

import com.piggybank.response.AuthResponse;
import com.piggybank.request.LoginRequest;
import com.piggybank.request.SignupRequest;
import com.piggybank.entity.User;
import com.piggybank.service.JwtTokenService;
import com.piggybank.service.LoggingService;
import com.piggybank.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Autowired
    private LoggingService loggingService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        logger.info("Signup request received for phone number: {}", request.getPhoneNumber());
        
        try {
            if (!request.getPin().equals(request.getConfirmPin())) {
                logger.warn("Signup failed - PIN mismatch for phone number: {}", request.getPhoneNumber());
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "PIN and confirm PIN do not match"));
            }
            
            User user = userService.registerUser(request.getPhoneNumber(), request.getPin());
            String token = jwtTokenService.generateToken(user.getId(), user.getPhoneNumber());
            
            // Log successful registration
            loggingService.logUserRegistration(request.getPhoneNumber(), user.getId());
            loggingService.logJwtTokenGenerated(request.getPhoneNumber(), user.getId());
            
            logger.info("User registered successfully with ID: {}", user.getId());
            
            return ResponseEntity.ok(new AuthResponse(
                true, "Account created successfully!", token, user.getId(), user.getPhoneNumber()));
                
        } catch (IllegalArgumentException e) {
            logger.error("Signup failed for phone number: {} - {}", request.getPhoneNumber(), e.getMessage());
            return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during signup for phone number: {}", request.getPhoneNumber(), e);
            return ResponseEntity.internalServerError()
                .body(new AuthResponse(false, "Registration failed. Please try again."));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login request received for phone number: {}", request.getPhoneNumber());
        
        try {
            User user = userService.authenticateUser(request.getPhoneNumber(), request.getPin());
            String token = jwtTokenService.generateToken(user.getId(), user.getPhoneNumber());
            
            // Log successful login
            loggingService.logUserLogin(request.getPhoneNumber(), user.getId(), true);
            loggingService.logJwtTokenGenerated(request.getPhoneNumber(), user.getId());
            
            logger.info("User login successful for ID: {}", user.getId());
            
            return ResponseEntity.ok(new AuthResponse(
                true, "Login successful!", token, user.getId(), user.getPhoneNumber()));
                
        } catch (IllegalArgumentException e) {
            logger.warn("Login failed for phone number: {} - {}", request.getPhoneNumber(), e.getMessage());
            loggingService.logUserLogin(request.getPhoneNumber(), null, false);
            return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error during login for phone number: {}", request.getPhoneNumber(), e);
            return ResponseEntity.internalServerError()
                .body(new AuthResponse(false, "Login failed. Please try again."));
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        logger.debug("Token validation request received");
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("Token validation failed - Invalid authorization header");
                return ResponseEntity.badRequest().body(new AuthResponse(false, "Invalid token"));
            }
            
            String token = authHeader.substring(7);
            String phoneNumber = jwtTokenService.getPhoneNumberFromToken(token);
            Long userId = jwtTokenService.getUserIdFromToken(token);
            
            // Log successful token validation
            loggingService.logJwtTokenValidation(phoneNumber, true);
            
            logger.debug("Token validation successful for user: {}", phoneNumber);
            
            return ResponseEntity.ok(new AuthResponse(true, "Token is valid", token, userId, phoneNumber));
            
        } catch (Exception e) {
            logger.warn("Token validation failed: {}", e.getMessage());
            loggingService.logJwtTokenValidation("unknown", false);
            return ResponseEntity.badRequest().body(new AuthResponse(false, "Invalid token"));
        }
    }
}
