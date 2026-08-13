package com.email.assistant.controller;

import com.email.assistant.dto.EmailDTO;
import com.email.assistant.model.Email;
import com.email.assistant.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
@CrossOrigin(origins = "${frontend.url}")
public class EmailController {

    private final EmailService service;

    public EmailController(EmailService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Email> saveEmail(
            @RequestBody EmailDTO dto) {

        return ResponseEntity.ok(
                service.saveEmail(dto)
        );
    }

    @GetMapping
    public ResponseEntity<List<Email>> getAllEmails() {

        return ResponseEntity.ok(
                service.getAllEmails()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Email> getEmail(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getEmailById(id)
        );
    }

    @GetMapping("/tone/{tone}")
    public ResponseEntity<List<Email>> searchByTone(
            @PathVariable String tone) {

        return ResponseEntity.ok(
                service.searchByTone(tone)
        );
    }

    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<Email>> searchBySubject(
            @PathVariable String subject) {

        return ResponseEntity.ok(
                service.searchBySubject(subject)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Email> updateEmail(
            @PathVariable Long id,
            @RequestBody Email email) {

        return ResponseEntity.ok(
                service.updateEmail(id, email)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmail(
            @PathVariable Long id) {

        service.deleteEmail(id);

        return ResponseEntity.ok(
                "Email deleted successfully"
        );
    }
}