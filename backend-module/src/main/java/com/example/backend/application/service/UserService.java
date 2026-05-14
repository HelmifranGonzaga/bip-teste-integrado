package com.example.backend.application.service;

import com.example.backend.adapter.inbound.web.dto.UserRequest;
import com.example.backend.adapter.inbound.web.dto.UserResponse;
import com.example.backend.adapter.inbound.web.dto.UserUpdateRequest;
import com.example.backend.adapter.outbound.persistence.UsuarioJpaRepository;
import com.example.backend.domain.exception.UserNotFoundException;
import com.example.ejb.Usuario;
import java.security.SecureRandom;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private static final List<String> VALID_ROLES = List.of("USER", "ADMIN");
    private static final String PASSWORD_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    private static final int PASSWORD_LENGTH = 12;

    private final UsuarioJpaRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UsuarioJpaRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    public UserResponse create(UserRequest request) {
        if (repository.findByUsername(request.username()).isPresent()) {
            throw new IllegalArgumentException("Username já existe: " + request.username());
        }
        String role = request.role();
        if (role != null && !role.isBlank() && !VALID_ROLES.contains(role.toUpperCase())) {
            throw new IllegalArgumentException("Role inválida: " + role + ". Valores permitidos: " + VALID_ROLES);
        }
        Usuario usuario = new Usuario();
        usuario.setUsername(request.username());
        usuario.setPassword(passwordEncoder.encode(request.password()));
        usuario.setNome(request.nome());
        usuario.setRole(role != null && !role.isBlank() ? role.toUpperCase() : "USER");
        usuario.setAtivo(true);
        Usuario saved = repository.save(usuario);
        log.info("Created user: {}", saved.getUsername());
        return toResponse(saved);
    }

    @Transactional
    public UserResponse update(Long id, UserUpdateRequest request) {
        if (request.username() == null || request.username().isBlank()) {
            throw new IllegalArgumentException("Username não pode ser vazio");
        }
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        repository.findByUsername(request.username()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalArgumentException("Username já está em uso: " + request.username());
            }
        });
        usuario.setUsername(request.username());
        if (request.password() != null && !request.password().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.password()));
        }
        if (request.nome() != null) {
            usuario.setNome(request.nome());
        }
        String role = request.role();
        if (role != null && !role.isBlank()) {
            if (!VALID_ROLES.contains(role.toUpperCase())) {
                throw new IllegalArgumentException("Role inválida: " + role);
            }
            usuario.setRole(role.toUpperCase());
        }
        Usuario saved = repository.save(usuario);
        log.info("Updated user: {}", saved.getUsername());
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        repository.deleteById(id);
        log.info("Deleted user: {}", id);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.findByUsername(username)
                .map(this::toResponse)
                .orElseThrow(() -> new UserNotFoundException(username));
    }

    @Transactional
    public UserResponse toggleActive(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        Boolean current = usuario.getAtivo();
        usuario.setAtivo(current == null || !current);
        Usuario saved = repository.save(usuario);
        log.info("Toggled active for user {}: {}", saved.getUsername(), saved.getAtivo());
        return toResponse(saved);
    }

    @Transactional
    public String resetPassword(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID do usuário não pode ser nulo");
        }
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        if (usuario.getPassword() == null) {
            throw new IllegalStateException("Usuário sem senha cadastrada: " + id);
        }
        String newPassword = generateSecurePassword();
        usuario.setPassword(passwordEncoder.encode(newPassword));
        repository.save(usuario);
        log.info("Password reset for user: {}", usuario.getUsername());
        return newPassword;
    }

    private String generateSecurePassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            sb.append(PASSWORD_CHARS.charAt(random.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }

    private UserResponse toResponse(Usuario usuario) {
        return new UserResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getNome(),
                usuario.getRole(),
                usuario.getAtivo(),
                usuario.getVersion());
    }
}
