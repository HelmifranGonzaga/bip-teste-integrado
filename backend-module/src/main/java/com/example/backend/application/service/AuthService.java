package com.example.backend.application.service;

import com.example.backend.adapter.inbound.web.security.JwtProvider;
import com.example.backend.adapter.outbound.persistence.UsuarioJpaRepository;
import com.example.ejb.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioJpaRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AuthService(UsuarioJpaRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    public String authenticate(String username, String password) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuário ou senha inválidos"));

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new IllegalStateException("Usuário inativo");
        }

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new IllegalArgumentException("Usuário ou senha inválidos");
        }

        return jwtProvider.generateToken(usuario.getUsername(), usuario.getRole());
    }

    public long getExpirationSeconds() {
        return jwtProvider.getExpirationSeconds();
    }
}
