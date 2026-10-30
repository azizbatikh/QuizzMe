package com.quizzme.auth.application;

import com.quizzme.auth.api.AuthResponse;
import com.quizzme.auth.api.RegisterRequest;
import com.quizzme.auth.domain.UserAccount;
import com.quizzme.auth.infrastructure.UserAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.util.Locale;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userAccountRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Password must not exceed 72 UTF-8 bytes"
            );
        }

        UserAccount account = userAccountRepository.save(
            new UserAccount(email, passwordEncoder.encode(request.password()))
        );
        return new AuthResponse(account.getId(), account.getEmail());
    }

    @Transactional(readOnly = true)
    public AuthResponse getAuthResponse(String email) {
        UserAccount account = userAccountRepository.findByEmail(normalizeEmail(email))
            .orElseThrow(() -> new IllegalStateException("Authenticated account was not found"));
        return new AuthResponse(account.getId(), account.getEmail());
    }

    public static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
