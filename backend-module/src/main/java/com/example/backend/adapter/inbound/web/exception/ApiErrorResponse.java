package com.example.backend.adapter.inbound.web.exception;

import java.time.OffsetDateTime;

/**
 * Resultado padrão de erro em APIs.
 * Inclui timestamp e correlationId para rastreamento.
 */
public record ApiErrorResponse(
        String code,
        String message,
        OffsetDateTime timestamp,
        String correlationId) {

    public ApiErrorResponse(String code, String message, String correlationId) {
        this(code, message, OffsetDateTime.now(), correlationId);
    }
}