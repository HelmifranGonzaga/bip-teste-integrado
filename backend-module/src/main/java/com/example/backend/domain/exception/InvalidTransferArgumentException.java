package com.example.backend.domain.exception;

import org.springframework.http.HttpStatus;

/**
 * Argumentos inválidos para operação (400 Bad Request).
 */
public class InvalidTransferArgumentException extends DomainException {

    public InvalidTransferArgumentException(String reason) {
        super(
                "INVALID_TRANSFER_ARGUMENT",
                "Argumentos de transferência inválidos: " + reason,
                HttpStatus.BAD_REQUEST.value());
    }
}
