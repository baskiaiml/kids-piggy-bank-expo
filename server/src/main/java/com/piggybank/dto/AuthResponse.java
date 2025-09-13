package com.piggybank.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private Long userId;
    private String phoneNumber;
    
    public AuthResponse() {}
    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    public AuthResponse(boolean success, String message, String token, Long userId, String phoneNumber) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.phoneNumber = phoneNumber;
    }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
