package com.example.backend.domain.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends DomainException {

    public UserNotFoundException(Long id) {
        super(
                "USER_NOT_FOUND",
                "Usuário não encontrado: " + id,
                HttpStatus.NOT_FOUND.value());
    }

    public UserNotFoundException(String username) {
        super(
                "USER_NOT_FOUND",
                "Usuário não encontrado: " + username,
                HttpStatus.NOT_FOUND.value());
    }
}
