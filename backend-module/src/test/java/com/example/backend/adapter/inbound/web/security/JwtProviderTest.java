package com.example.backend.adapter.inbound.web.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

class JwtProviderTest {

    private static final String VALID_SECRET = "aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789";

    @Test
    void shouldGenerateAndValidateToken() {
        JwtProvider provider = new JwtProvider(VALID_SECRET, 3600000L);

        String token = provider.generateToken("joao", "ADMIN");

        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("joao", provider.extractUsername(token));
        assertEquals("ADMIN", provider.extractRole(token));
    }

    @Test
    void shouldGenerateTokenWithDefaultRole() {
        JwtProvider provider = new JwtProvider(VALID_SECRET, 3600000L);

        String token = provider.generateToken("joao");

        assertNotNull(token);
        assertEquals("joao", provider.extractUsername(token));
        assertEquals("USER", provider.extractRole(token));
    }

    @Test
    void shouldRejectInvalidToken() {
        JwtProvider provider = new JwtProvider(VALID_SECRET, 3600000L);

        assertFalse(provider.validateToken("invalid-token"));
        assertNull(provider.extractUsername("invalid-token"));
        assertNull(provider.extractRole("invalid-token"));
    }

    @Test
    void shouldReturnNullWhenExtractingFromInvalidToken() {
        JwtProvider provider = new JwtProvider(VALID_SECRET, 3600000L);

        assertNull(provider.extractUsername("invalid-token"));
        assertNull(provider.extractRole("invalid-token"));
    }

    @Test
    void shouldGetExpirationSeconds() {
        JwtProvider provider = new JwtProvider(VALID_SECRET, 3600000L);

        assertEquals(3600L, provider.getExpirationSeconds());
    }

    @Test
    void shouldThrowWhenSecretIsNull() {
        assertThrows(IllegalStateException.class, () -> new JwtProvider(null, 3600000L));
    }

    @Test
    void shouldThrowWhenSecretIsEmpty() {
        assertThrows(IllegalStateException.class, () -> new JwtProvider("", 3600000L));
    }

    @Test
    void shouldThrowWhenSecretIsTooShort() {
        assertThrows(IllegalStateException.class, () -> new JwtProvider("short", 3600000L));
    }

    @Test
    void shouldThrowWhenSecretContainsChangeMe() {
        assertThrows(IllegalStateException.class,
                () -> new JwtProvider("change-me" + "x".repeat(60), 3600000L));
    }

    @Test
    void shouldExtractUsernameAndRoleFromGeneratedToken() {
        JwtProvider provider = new JwtProvider(VALID_SECRET, 3600000L);

        String token = provider.generateToken("maria", "USER");

        assertEquals("maria", provider.extractUsername(token));
        assertEquals("USER", provider.extractRole(token));
    }
}
