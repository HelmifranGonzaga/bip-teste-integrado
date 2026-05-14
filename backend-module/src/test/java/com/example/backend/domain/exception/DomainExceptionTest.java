package com.example.backend.domain.exception;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class DomainExceptionTest {

    @Test
    void shouldCreateBeneficioNotFoundException() {
        BeneficioNotFoundException ex = new BeneficioNotFoundException(42L);

        assertEquals("BENEFICIO_NOT_FOUND", ex.getCode());
        assertEquals("Benefício com ID 42 não encontrado", ex.getMessage());
        assertEquals(HttpStatus.NOT_FOUND.value(), ex.getHttpStatus());
    }

    @Test
    void shouldCreateInactiveBeneficioException() {
        InactiveBeneficioException ex = new InactiveBeneficioException(1L, "TRANSFER");

        assertEquals("INACTIVE_BENEFICIO", ex.getCode());
        assertTrue(ex.getMessage().contains("1"));
        assertTrue(ex.getMessage().contains("TRANSFER"));
        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getHttpStatus());
    }

    @Test
    void shouldCreateInsufficientBalanceException() {
        InsufficientBalanceException ex = new InsufficientBalanceException(
                new BigDecimal("500.00"), new BigDecimal("100.00"));

        assertEquals("INSUFFICIENT_BALANCE", ex.getCode());
        assertTrue(ex.getMessage().contains("500"));
        assertTrue(ex.getMessage().contains("100"));
        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getHttpStatus());
    }

    @Test
    void shouldCreateInvalidTransferArgumentException() {
        InvalidTransferArgumentException ex = new InvalidTransferArgumentException("fromId equals toId");

        assertEquals("INVALID_TRANSFER_ARGUMENT", ex.getCode());
        assertTrue(ex.getMessage().contains("fromId equals toId"));
        assertEquals(HttpStatus.BAD_REQUEST.value(), ex.getHttpStatus());
    }

    @Test
    void shouldBeInstanceOfDomainException() {
        assertInstanceOf(DomainException.class, new BeneficioNotFoundException(1L));
        assertInstanceOf(DomainException.class, new InactiveBeneficioException(1L, "TEST"));
        assertInstanceOf(DomainException.class, new InsufficientBalanceException(BigDecimal.ONE, BigDecimal.ZERO));
        assertInstanceOf(DomainException.class, new InvalidTransferArgumentException("reason"));
    }
}
