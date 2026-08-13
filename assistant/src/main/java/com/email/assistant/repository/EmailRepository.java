package com.email.assistant.repository;

import com.email.assistant.model.Email;
import com.email.assistant.model.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmailRepository extends JpaRepository<Email, Long> {

    // Get only the logged-in user's emails
    List<Email> findByUserOrderByCreatedAtDesc(User user);

    // Search tone only within logged-in user's emails
    List<Email> findByUserAndToneIgnoreCase(
            User user,
            String tone
    );

    // Search subject only within logged-in user's emails
    List<Email> findByUserAndSubjectContainingIgnoreCase(
            User user,
            String subject
    );
}