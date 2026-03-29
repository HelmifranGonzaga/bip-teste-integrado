package com.example.backend.domain.exception;

import java.math.BigDecimal;
import org.springframework.http.HttpStatus;

/**
 * Saldo insuficiente para transferência (400 Bad Request).
 */
public class InsufficientBalanceException extends DomainException {

    public InsufficientBalanceException(BigDecimal requested, BigDecimal available) {
        super(
                "INSUFFICIENT_BALANCE",
                "Saldo insuficiente. Solicitado: " + requested + ", Disponível: " + available,
                HttpStatus.BAD_REQUEST.value());
    }
}
