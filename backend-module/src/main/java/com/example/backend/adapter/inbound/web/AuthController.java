package com.example.backend.adapter.inbound.web;

import com.example.backend.adapter.inbound.web.security.JwtProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Auth Controller.
 * Fornece endpoints para autenticação JWT.
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticação", description = "Endpoints de autenticação JWT")
public class AuthController {

    private final JwtProvider jwtProvider;

    public AuthController(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Login", description = "Gera JWT token para acesso aos endpoints protegidos")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        // Por agora: aceita qualquer username e retorna um token
        String token = jwtProvider.generateToken(request.username());
        return new LoginResponse(token, "Bearer", jwtProvider.getExpirationSeconds());
    }

    public record LoginRequest(@NotBlank(message = "Username é obrigatório") String username) {}

    public record LoginResponse(String accessToken, String tokenType, long expiresIn) {}
}
