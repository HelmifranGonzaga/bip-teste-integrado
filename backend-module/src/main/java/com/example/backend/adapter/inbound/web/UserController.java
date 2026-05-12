package com.example.backend.adapter.inbound.web;

import com.example.backend.adapter.inbound.web.dto.PasswordResetResponse;
import com.example.backend.adapter.inbound.web.dto.UserRequest;
import com.example.backend.adapter.inbound.web.dto.UserResponse;
import com.example.backend.adapter.inbound.web.dto.UserUpdateRequest;
import com.example.backend.adapter.inbound.web.exception.ResourceNotFoundException;
import com.example.backend.application.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/usuarios")
@Tag(name = "Usuários", description = "API para gerenciamento de usuários do sistema")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Listar usuários", description = "Retorna todos os usuários cadastrados")
    @GetMapping
    public List<UserResponse> list() {
        return userService.listAll();
    }

    @Operation(summary = "Buscar usuário por ID")
    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        try {
            return userService.getById(id);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

    @Operation(summary = "Criar novo usuário")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@Valid @RequestBody UserRequest request) {
        return userService.create(request);
    }

    @Operation(summary = "Atualizar usuário")
    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        try {
            return userService.update(id, request);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

    @Operation(summary = "Excluir usuário")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        try {
            userService.delete(id);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

    @Operation(summary = "Obter usuário autenticado atual")
    @GetMapping("/me")
    public UserResponse me() {
        return userService.getCurrentUser();
    }

    @Operation(summary = "Ativar/desativar usuário")
    @PatchMapping("/{id}/ativo")
    public UserResponse toggleActive(@PathVariable Long id) {
        try {
            return userService.toggleActive(id);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

    @Operation(summary = "Gerar nova senha aleatória para usuário")
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<PasswordResetResponse> resetPassword(@PathVariable Long id) {
        try {
            String newPassword = userService.resetPassword(id);
            return ResponseEntity.ok(new PasswordResetResponse(newPassword));
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException(e.getMessage());
        } catch (Exception e) {
            throw new IllegalStateException("Erro ao redefinir senha: " + e.getMessage(), e);
        }
    }
}
