package com.example.backend.adapter.inbound.web.exception;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
}
