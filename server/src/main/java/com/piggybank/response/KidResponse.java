package com.piggybank.response;

import com.piggybank.entity.Kid;
import java.time.LocalDateTime;

public class KidResponse {
    private Long id;
    private String name;
    private Integer age;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private String createdBy;
    private String lastModifiedBy;
    
    public KidResponse() {}
    
    public KidResponse(Kid kid) {
        this.id = kid.getId();
        this.name = kid.getName();
        this.age = kid.getAge();
        this.createdDate = kid.getCreatedDate();
        this.lastModifiedDate = kid.getLastModifiedDate();
        this.createdBy = kid.getCreatedBy();
        this.lastModifiedBy = kid.getLastModifiedBy();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }
} 