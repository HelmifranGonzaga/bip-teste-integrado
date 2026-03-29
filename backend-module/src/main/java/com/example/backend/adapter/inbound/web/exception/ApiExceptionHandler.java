package com.example.backend.adapter.inbound.web.exception;

import com.example.backend.domain.exception.DomainException;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);
    private static final Map<String, String> FIELD_LABELS = Map.of(
            "nome", "Nome",
            "descricao", "Descrição",
            "valor", "Valor",
            "ativo", "Status",
            "fromId", "Benefício de origem",
            "toId", "Benefício de destino",
            "amount", "Valor da transferência"
    );

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiErrorResponse> handleDomainException(DomainException ex) {
        String correlationId = MDC.get("correlationId");
        log.warn("Domain exception: [{}] {}", ex.getCode(), ex.getMessage());
        return ResponseEntity
                .status(ex.getHttpStatus())
                .body(new ApiErrorResponse(ex.getCode(), ex.getMessage(), correlationId));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ErrorCode.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(IllegalStateException ex) {
        return buildError(HttpStatus.CONFLICT, ErrorCode.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> formatFieldError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.joining("; "));
        return buildError(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex) {
        log.error("Unexpected error", ex);
        String correlationId = MDC.get("correlationId");
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiErrorResponse(
                        ErrorCode.INTERNAL_ERROR, "Erro interno no servidor", correlationId));
    }

    private ResponseEntity<ApiErrorResponse> buildError(HttpStatus status, String code, String message) {
        String correlationId = MDC.get("correlationId");
        return ResponseEntity
                .status(status)
                .body(new ApiErrorResponse(code, message, correlationId));
    }

    private String formatFieldError(String field, String message) {
        String fieldLabel = FIELD_LABELS.getOrDefault(field, field);
        return fieldLabel + ": " + message;
    }
}

