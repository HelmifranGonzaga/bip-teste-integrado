package com.example.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validação de CNPJ alfanumérico (opcional: null ou em branco é válido).
 * Remove separadores, normaliza para maiúsculas ({@link java.util.Locale#ROOT}), exige 14 caracteres,
 * padrão {@code [A-Z0-9]{12}[0-9]{2}} e dígitos verificadores módulo 11 (alinhado ao frontend).
 */
public class ValidCnpjAlfanumericoValidator implements ConstraintValidator<ValidCnpjAlfanumerico, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }
        return CnpjAlfanumerico.isValid(value);
    }
}
