package com.email.assistant.controller;

import com.email.assistant.ai.GeminiService;
import com.email.assistant.dto.EmailDTO;
import com.email.assistant.model.Email;
import com.email.assistant.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "${frontend.url}")
public class AIController {

    private final GeminiService geminiService;
    private final EmailService emailService;

    public AIController(
            GeminiService geminiService,
            EmailService emailService) {

        this.geminiService = geminiService;
        this.emailService = emailService;
    }

    @PostMapping("/generate")
    public ResponseEntity<Email> generateEmail(
            @RequestBody Map<String, String> request) {

        String prompt = request.get("prompt");
        String tone = request.get("tone");
        String length = request.get("length");
        String subject = request.get("subject");

        String generatedEmail =
                geminiService.generateEmail(
                        prompt,
                        tone,
                        length
                );

        EmailDTO dto = new EmailDTO();

        dto.setPrompt(prompt);
        dto.setTone(tone);
        dto.setLength(length);
        dto.setGeneratedEmail(generatedEmail);

        if (subject == null || subject.isBlank()) {
            subject = "AI Generated Email";
        }

        dto.setSubject(subject);

        return ResponseEntity.ok(
                emailService.saveEmail(dto)
        );
    }

    @PostMapping("/save")
    public ResponseEntity<Email> saveEmail(
            @RequestBody EmailDTO dto) {

        return ResponseEntity.ok(
                emailService.saveEmail(dto)
        );
    }

    @PostMapping("/regenerate/{id}")
    public ResponseEntity<Email> regenerateEmail(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String prompt = request.get("prompt");
        String tone = request.get("tone");
        String length = request.get("length");

        String regeneratedEmail =
                geminiService.regenerateEmail(
                        prompt,
                        tone,
                        length
                );

        Email updatedEmail =
                emailService.updateGeneratedEmail(
                        id,
                        regeneratedEmail,
                        tone,
                        length
                );

        return ResponseEntity.ok(updatedEmail);
    }
}