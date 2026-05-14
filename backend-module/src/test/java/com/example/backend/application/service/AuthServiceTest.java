package com.example.backend.application.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.backend.adapter.inbound.web.security.JwtProvider;
import com.example.backend.adapter.outbound.persistence.UsuarioJpaRepository;
import com.example.ejb.Usuario;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioJpaRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private AuthService authService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setUsername("joao");
        usuario.setPassword("encoded-password");
        usuario.setNome("João Silva");
        usuario.setRole("USER");
        usuario.setAtivo(true);
    }

    @Test
    void shouldAuthenticateSuccessfully() {
        when(usuarioRepository.findByUsername("joao")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("raw-password", "encoded-password")).thenReturn(true);
        when(jwtProvider.generateToken("joao", "USER")).thenReturn("jwt-token");

        String token = authService.authenticate("joao", "raw-password");

        assertEquals("jwt-token", token);
        verify(usuarioRepository).findByUsername("joao");
        verify(passwordEncoder).matches("raw-password", "encoded-password");
        verify(jwtProvider).generateToken("joao", "USER");
    }

    @Test
    void shouldThrowWhenUserNotFound() {
        when(usuarioRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.authenticate("unknown", "password"));
        assertTrue(ex.getMessage().contains("Usuário ou senha inválidos"));
    }

    @Test
    void shouldThrowWhenUserIsInactive() {
        usuario.setAtivo(false);
        when(usuarioRepository.findByUsername("joao")).thenReturn(Optional.of(usuario));

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> authService.authenticate("joao", "password"));
        assertEquals("Usuário inativo", ex.getMessage());
    }

    @Test
    void shouldThrowWhenPasswordDoesNotMatch() {
        when(usuarioRepository.findByUsername("joao")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.authenticate("joao", "wrong-password"));
        assertTrue(ex.getMessage().contains("Usuário ou senha inválidos"));
    }

    @Test
    void shouldGetExpirationSeconds() {
        when(jwtProvider.getExpirationSeconds()).thenReturn(3600L);

        long seconds = authService.getExpirationSeconds();

        assertEquals(3600L, seconds);
    }
}
