package com.example.backend.domain.exception;

/**
 * Base exception para erros de domínio.
 * Todas as exceções de negócio devem herdar desta.
 */
public class DomainException extends RuntimeException {

    private final String code;
    private final int httpStatus;

    public DomainException(String code, String message, int httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public String getCode() {
        return code;
    }

    public int getHttpStatus() {
        return httpStatus;
    }
}
