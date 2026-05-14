package com.example.backend.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.example.backend.domain.exception.UserNotFoundException;
import com.example.ejb.Usuario;
import com.example.backend.adapter.outbound.persistence.UsuarioJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceToggleActiveTest {

    @Mock
    private UsuarioJpaRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private Usuario user;

    @BeforeEach
    void setUp() {
        user = new Usuario();
        user.setId(1L);
        user.setUsername("joao");
        user.setPassword("encoded");
        user.setNome("João Silva");
        user.setRole("USER");
        user.setAtivo(true);
    }

    @Test
    void toggleActive_turnsTrueToFalse() {
        when(repository.findById(1L)).thenReturn(Optional.of(user));
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = userService.toggleActive(1L);

        assertThat(result.ativo()).isFalse();
    }

    @Test
    void toggleActive_turnsFalseToTrue() {
        user.setAtivo(false);
        when(repository.findById(1L)).thenReturn(Optional.of(user));
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = userService.toggleActive(1L);

        assertThat(result.ativo()).isTrue();
    }

    @Test
    void toggleActive_whenAtivoIsNull_togglesToTrue() {
        user.setAtivo(null);
        when(repository.findById(1L)).thenReturn(Optional.of(user));
        when(repository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        var result = userService.toggleActive(1L);

        assertThat(result.ativo()).isTrue();
    }

    @Test
    void toggleActive_userNotFound_throwsUserNotFoundException() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.toggleActive(99L))
                .isInstanceOf(UserNotFoundException.class);
    }
}