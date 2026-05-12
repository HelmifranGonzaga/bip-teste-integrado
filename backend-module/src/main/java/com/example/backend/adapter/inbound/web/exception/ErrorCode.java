package com.example.backend.adapter.inbound.web.exception;

/**
 * Códigos de erro padrão da aplicação
 * Deve corresponder aos ErrorType do frontend
 */
public final class ErrorCode {
    private ErrorCode() {}

    public static final String BAD_REQUEST = "BAD_REQUEST";
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String NOT_FOUND = "NOT_FOUND";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    public static final String FORBIDDEN = "FORBIDDEN";
    public static final String CONFLICT = "CONFLICT";
    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";
    public static final String CONNECTION_ERROR = "CONNECTION_ERROR";
    public static final String OPTIMISTIC_LOCK = "OPTIMISTIC_LOCK";
}
