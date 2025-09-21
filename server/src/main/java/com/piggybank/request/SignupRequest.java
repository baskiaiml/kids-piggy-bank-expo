package com.piggybank.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SignupRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String phoneNumber;

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 35, message = "Name must be between 3 and 35 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Name can only contain letters, numbers, underscore, hyphen, and dot")
    private String name;

    @NotBlank(message = "PIN is required")
    @Pattern(regexp = "^\\d{4}$", message = "PIN must be exactly 4 digits")
    private String pin;

    @NotBlank(message = "Confirm PIN is required")
    @Pattern(regexp = "^\\d{4}$", message = "Confirm PIN must be exactly 4 digits")
    private String confirmPin;

    public SignupRequest() {
    }

    public SignupRequest(String phoneNumber, String name, String pin, String confirmPin) {
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.pin = pin;
        this.confirmPin = confirmPin;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getConfirmPin() {
        return confirmPin;
    }

    public void setConfirmPin(String confirmPin) {
        this.confirmPin = confirmPin;
    }
}
