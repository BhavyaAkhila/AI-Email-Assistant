package com.email.assistant.service;

import com.email.assistant.dto.EmailDTO;
import com.email.assistant.model.Email;
import com.email.assistant.model.User;
import com.email.assistant.repository.EmailRepository;
import com.email.assistant.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private final EmailRepository emailRepository;
    private final UserRepository userRepository;

    public EmailService(
            EmailRepository emailRepository,
            UserRepository userRepository) {

        this.emailRepository = emailRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // SAVE EMAIL
    // =====================================================

    public Email saveEmail(EmailDTO dto) {

        // Get logged-in user
        User user = getLoggedInUser();

        // Create new email
        Email email = new Email();

        email.setPrompt(dto.getPrompt());
        email.setSubject(dto.getSubject());
        email.setGeneratedEmail(
                dto.getGeneratedEmail()
        );
        email.setTone(dto.getTone());
        email.setLength(dto.getLength());

        // IMPORTANT:
        // Connect email with logged-in user
        email.setUser(user);

        return emailRepository.save(email);
    }


    // =====================================================
    // GET ALL EMAILS
    // =====================================================

    public List<Email> getAllEmails() {

        User user = getLoggedInUser();

        // Only return this user's emails
        return emailRepository
                .findByUserOrderByCreatedAtDesc(user);
    }


    // =====================================================
    // GET EMAIL BY ID
    // =====================================================

    public Email getEmailById(Long id) {

        User user = getLoggedInUser();

        return emailRepository
                .findById(id)
                .filter(email ->
                        email.getUser() != null &&
                        email.getUser()
                                .getId()
                                .equals(user.getId())
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Email not found"
                        )
                );
    }


    // =====================================================
    // SEARCH BY TONE
    // =====================================================

    public List<Email> searchByTone(String tone) {

        User user = getLoggedInUser();

        // Search only this user's emails
        return emailRepository
                .findByUserAndToneIgnoreCase(
                        user,
                        tone
                );
    }


    // =====================================================
    // SEARCH BY SUBJECT
    // =====================================================

    public List<Email> searchBySubject(
            String subject) {

        User user = getLoggedInUser();

        // Search only this user's emails
        return emailRepository
                .findByUserAndSubjectContainingIgnoreCase(
                        user,
                        subject
                );
    }


    // =====================================================
    // UPDATE EMAIL
    // =====================================================

    public Email updateEmail(
            Long id,
            Email updated) {

        // getEmailById() also checks ownership
        Email existing =
                getEmailById(id);

        existing.setPrompt(
                updated.getPrompt()
        );

        existing.setSubject(
                updated.getSubject()
        );

        existing.setGeneratedEmail(
                updated.getGeneratedEmail()
        );

        existing.setTone(
                updated.getTone()
        );

        existing.setLength(
                updated.getLength()
        );

        return emailRepository.save(existing);
    }


    // =====================================================
    // UPDATE GENERATED EMAIL / REGENERATE
    // =====================================================

    public Email updateGeneratedEmail(
            Long id,
            String generatedEmail,
            String tone,
            String length) {

        // This checks that email belongs
        // to the logged-in user
        Email email =
                getEmailById(id);

        email.setGeneratedEmail(
                generatedEmail
        );

        email.setTone(tone);

        email.setLength(length);

        return emailRepository.save(email);
    }


    // =====================================================
    // DELETE EMAIL
    // =====================================================

    public void deleteEmail(Long id) {

        // This checks ownership
        Email email =
                getEmailById(id);

        emailRepository.delete(email);
    }


    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        // Check authentication
        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        // JwtAuthFilter stores the user's email
        // as authentication.getName()
        String emailAddress =
                authentication.getName();

        // Find user using email
        return userRepository
                .findByEmail(emailAddress)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        )
                );
    }
}