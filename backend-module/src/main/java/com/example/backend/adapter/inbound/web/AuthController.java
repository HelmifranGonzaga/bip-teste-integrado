package com.example.backend.adapter.inbound.web;

import com.example.backend.application.service.AuthService;
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

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticação", description = "Endpoints de autenticação JWT")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Login", description = "Autentica usuário e retorna JWT token")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        String token = authService.authenticate(request.username(), request.password());
        return new LoginResponse(token, "Bearer", authService.getExpirationSeconds());
    }

    public record LoginRequest(
            @NotBlank(message = "Username é obrigatório") String username,
            @NotBlank(message = "Password é obrigatório") String password
    ) {}

    public record LoginResponse(String accessToken, String tokenType, long expiresIn) {}
}
