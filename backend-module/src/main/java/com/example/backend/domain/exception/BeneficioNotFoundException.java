package com.example.backend.domain.exception;

import org.springframework.http.HttpStatus;

/**
 * Beneficio não encontrado (404 Not Found).
 */
public class BeneficioNotFoundException extends DomainException {

    public BeneficioNotFoundException(Long id) {
        super(
                "BENEFICIO_NOT_FOUND",
                "Benefício com ID " + id + " não encontrado",
                HttpStatus.NOT_FOUND.value());
    }
}
