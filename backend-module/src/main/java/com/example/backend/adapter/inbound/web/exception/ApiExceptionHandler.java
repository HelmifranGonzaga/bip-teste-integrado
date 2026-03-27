package com.example.backend.adapter.inbound.web.exception;

import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(IllegalArgumentException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "BAD_REQUEST", ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleConflict(IllegalStateException ex) {
        return buildError(HttpStatus.CONFLICT, "CONFLICT", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> formatFieldError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.joining("; "));
        return buildError(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", message);
    }

    private ResponseEntity<ApiErrorResponse> buildError(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status).body(new ApiErrorResponse(code, message));
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
