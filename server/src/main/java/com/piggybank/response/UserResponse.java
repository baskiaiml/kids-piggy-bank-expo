package com.piggybank.response;

import com.piggybank.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class UserResponse {
    private Long id;
    private String phoneNumber;
    private LocalDateTime lastLogin;
    private List<KidResponse> kids;
    
    public UserResponse() {}
    
    public UserResponse(User user) {
        this.id = user.getId();
        this.phoneNumber = user.getPhoneNumber();
        this.lastLogin = user.getLastLogin();
        if (user.getKids() != null) {
            this.kids = user.getKids().stream()
                .map(KidResponse::new)
                .collect(Collectors.toList());
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public List<KidResponse> getKids() { return kids; }
    public void setKids(List<KidResponse> kids) { this.kids = kids; }
} 