package com.example.backend.adapter.inbound.web.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * JWT Provider para geração e validação de tokens.
 * Segue prática de produção: chave secreta vem de environment.
 */
@Component
public class JwtProvider {

    private final SecretKey secretKey;
    private final long expirationTime;

    public JwtProvider(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.expiration:3600000}") long expirationTime) {
        validateSecret(secret);
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationTime = expirationTime;
    }

    private void validateSecret(String secret) {
        if (!StringUtils.hasText(secret)) {
            throw new IllegalStateException("JWT secret is required (property: app.security.jwt.secret)");
        }
        if (secret.length() < 64) {
            throw new IllegalStateException("JWT secret must be at least 64 characters long");
        }
        if (secret.toLowerCase().contains("change-me")) {
            throw new IllegalStateException("JWT secret contains insecure default marker");
        }
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    public long getExpirationSeconds() {
        return TimeUnit.MILLISECONDS.toSeconds(expirationTime);
    }

    public String extractUsername(String token) {
        try {
            Claims claims = parseToken(token);
            return claims.getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
