package com.piggybank.entity;

import com.piggybank.entity.base.AuditableEntity;
import jakarta.persistence.*;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import java.time.LocalDateTime;

@Entity
@Table(name = "kids")
@Audited
@AuditOverride(forClass = AuditableEntity.class)
public class Kid extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer age;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    public Kid() {}
    
    public Kid(String name, Integer age, User user) {
        this.name = name;
        this.age = age;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}