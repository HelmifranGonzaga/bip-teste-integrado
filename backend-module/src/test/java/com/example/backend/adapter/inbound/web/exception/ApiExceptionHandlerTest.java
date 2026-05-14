package com.example.backend.adapter.inbound.web.exception;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.example.backend.domain.exception.DomainException;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

class ApiExceptionHandlerTest {

    private final ApiExceptionHandler handler = new ApiExceptionHandler();

    @Test
    void shouldHandleIllegalArgumentException() {
        IllegalArgumentException ex = new IllegalArgumentException("Invalid argument");

        ResponseEntity<ApiErrorResponse> response = handler.handleBadRequest(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("Invalid argument", body.message());
        assertEquals("BAD_REQUEST", body.code());
    }

    @Test
    void shouldHandleIllegalStateException() {
        IllegalStateException ex = new IllegalStateException("Invalid state");

        ResponseEntity<ApiErrorResponse> response = handler.handleConflict(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("Invalid state", body.message());
        assertEquals("CONFLICT", body.code());
    }

    @Test
    void shouldHandleResourceNotFoundException() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Not found");

        ResponseEntity<ApiErrorResponse> response = handler.handleNotFound(ex);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("Not found", body.message());
        assertEquals("NOT_FOUND", body.code());
    }

    @Test
    void shouldHandleDomainException() {
        DomainException ex = new DomainException("MY_ERROR", "Domain error message", 400);

        ResponseEntity<ApiErrorResponse> response = handler.handleDomainException(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("MY_ERROR", body.code());
        assertEquals("Domain error message", body.message());
    }

    @Test
    void shouldHandleMethodArgumentNotValidException() {
        FieldError fieldError = new FieldError("objectName", "nome", "Nome é obrigatório");
        BindingResult bindingResult = org.mockito.Mockito.mock(BindingResult.class);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null, bindingResult);

        ResponseEntity<ApiErrorResponse> response = handler.handleValidation(ex);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("VALIDATION_ERROR", body.code());
        assertEquals("Nome: Nome é obrigatório", body.message());
    }

    @Test
    void shouldHandleObjectOptimisticLockingFailureException() {
        ObjectOptimisticLockingFailureException ex =
                new ObjectOptimisticLockingFailureException("Resource", 1L, new RuntimeException("lock"));

        ResponseEntity<ApiErrorResponse> response = handler.handleOptimisticLock(ex);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("OPTIMISTIC_LOCK", body.code());
        assertTrue(body.message().contains("alterado por outro usuário"));
    }

    @Test
    void shouldHandleGenericException() {
        Exception ex = new RuntimeException("Unexpected error");

        ResponseEntity<ApiErrorResponse> response = handler.handleUnexpected(ex);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        ApiErrorResponse body = response.getBody();
        assertNotNull(body);
        assertEquals("INTERNAL_ERROR", body.code());
        assertEquals("Erro interno no servidor", body.message());
    }
}
