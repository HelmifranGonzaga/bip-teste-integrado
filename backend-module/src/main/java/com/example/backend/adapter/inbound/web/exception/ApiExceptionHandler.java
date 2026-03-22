package com.example.backend.adapter.inbound.web.exception;

import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final String MESSAGE = "message";

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
            MESSAGE, ex.getMessage(),
            "code", "NOT_FOUND"
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
            MESSAGE, ex.getMessage(),
            "code", "BAD_REQUEST"
        ));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
            MESSAGE, ex.getMessage(),
            "code", "CONFLICT"
        ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> formatFieldError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(Map.of(
            MESSAGE, message,
            "code", "VALIDATION_ERROR"
        ));
    }

    private String formatFieldError(String field, String message) {
        String fieldLabel = switch (field) {
            case "nome" -> "Nome";
            case "descricao" -> "Descrição";
            case "valor" -> "Valor";
            case "ativo" -> "Status";
            case "fromId" -> "Benefício de origem";
            case "toId" -> "Benefício de destino";
            case "amount" -> "Valor da transferência";
            default -> field;
        };
        return fieldLabel + ": " + message;
    }
}
