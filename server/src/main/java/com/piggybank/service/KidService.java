package com.piggybank.service;

import com.piggybank.entity.Kid;
import com.piggybank.entity.User;
import com.piggybank.repository.KidRepository;
import com.piggybank.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KidService {
    
    @Autowired
    private KidRepository kidRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Kid> getKidsByUserId(Long userId) {
        return kidRepository.findByUserId(userId);
    }
    
    public Kid addKid(Long userId, String name, Integer age) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        
        User user = userOpt.get();
        Kid kid = new Kid(name, age, user);
        return kidRepository.save(kid);
    }
    
    public Kid updateKid(Long kidId, String name, Integer age) {
        Optional<Kid> kidOpt = kidRepository.findById(kidId);
        if (kidOpt.isEmpty()) {
            throw new IllegalArgumentException("Kid not found");
        }
        
        Kid kid = kidOpt.get();
        if (name != null) {
            kid.setName(name);
        }
        if (age != null) {
            kid.setAge(age);
        }
        
        return kidRepository.save(kid);
    }
    
    public void deleteKid(Long kidId) {
        if (!kidRepository.existsById(kidId)) {
            throw new IllegalArgumentException("Kid not found");
        }
        kidRepository.deleteById(kidId);
    }
    
    public Optional<Kid> getKidById(Long kidId) {
        return kidRepository.findById(kidId);
    }
} 