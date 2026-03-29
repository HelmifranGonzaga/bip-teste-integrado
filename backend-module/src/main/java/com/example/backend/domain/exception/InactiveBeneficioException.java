package com.example.backend.domain.exception;

import org.springframework.http.HttpStatus;

/**
 * Benefício inativo não pode fazer transferências (400 Bad Request).
 */
public class InactiveBeneficioException extends DomainException {

    public InactiveBeneficioException(Long beneficioId, String operation) {
        super(
                "INACTIVE_BENEFICIO",
                "Benefício " + beneficioId + " inativo. Operação não permitida: " + operation,
                HttpStatus.BAD_REQUEST.value());
    }
}
