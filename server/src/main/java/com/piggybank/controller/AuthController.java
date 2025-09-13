package com.piggybank.controller;

import com.piggybank.dto.AuthResponse;
import com.piggybank.dto.LoginRequest;
import com.piggybank.dto.SignupRequest;
import com.piggybank.entity.User;
import com.piggybank.service.JwtTokenService;
import com.piggybank.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        try {
            if (!request.getPin().equals(request.getConfirmPin())) {
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(false, "PIN and confirm PIN do not match"));
            }
            User user = userService.registerUser(request.getPhoneNumber(), request.getPin());
            String token = jwtTokenService.generateToken(user.getId(), user.getPhoneNumber());
            return ResponseEntity.ok(new AuthResponse(
                true, "Account created successfully!", token, user.getId(), user.getPhoneNumber()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new AuthResponse(false, "Registration failed. Please try again."));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.authenticateUser(request.getPhoneNumber(), request.getPin());
            String token = jwtTokenService.generateToken(user.getId(), user.getPhoneNumber());
            return ResponseEntity.ok(new AuthResponse(
                true, "Login successful!", token, user.getId(), user.getPhoneNumber()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new AuthResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new AuthResponse(false, "Login failed. Please try again."));
        }
    }
}
