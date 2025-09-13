package com.piggybank.repository;

import com.piggybank.entity.Kid;
import com.piggybank.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KidRepository extends JpaRepository<Kid, Long> {
    List<Kid> findByUser(User user);
    List<Kid> findByUserId(Long userId);
} 