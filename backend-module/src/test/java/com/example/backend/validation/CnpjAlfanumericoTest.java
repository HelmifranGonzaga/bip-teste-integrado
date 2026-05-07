package com.example.backend.validation;

import static org.junit.jupiter.api.Assertions.*;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class CnpjAlfanumericoTest {

    private record CnpjHolder(@ValidCnpjAlfanumerico String cnpj) {}

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        factory.close();
    }

    @Test
    void normalize_stripsPunctuationAndUppercases() {
        assertEquals("12ABC34501DE35", CnpjAlfanumerico.normalize(" 12.aBc-345/01de*35 "));
    }

    @Test
    void isValid_acceptsClassicNumericWithValidDv() {
        assertTrue(CnpjAlfanumerico.isValid("11.222.333/0001-81"));
        assertTrue(CnpjAlfanumerico.isValid("00000000000191"));
    }

    @Test
    void isValid_acceptsAlphanumericWithValidDv() {
        assertTrue(CnpjAlfanumerico.isValid("12.ABC.345/01DE-35"));
    }

    @Test
    void isValid_rejectsWrongLength() {
        assertFalse(CnpjAlfanumerico.isValid("123456789012"));
    }

    @Test
    void isValid_rejectsLetterInDvPositions() {
        assertFalse(CnpjAlfanumerico.isValid("12.ABC.345/01DE-3A"));
    }

    @Test
    void isValid_rejectsWrongDv() {
        assertFalse(CnpjAlfanumerico.isValid("12.ABC.345/01DE-99"));
    }

    @Test
    void isValid_rejectsRegexOnlyNoDv() {
        assertFalse(CnpjAlfanumerico.isValid("12.ABC.678/0001-95"));
    }

    @Test
    void isValid_rejectsSpecialCharsOutsideMask() {
        // Asterisco no meio: a normalização antiga aceitava (engolia o caractere).
        // Agora deve rejeitar — atende ao requisito EF/ET "Não permitir caracteres
        // especiais (exceto máscara)".
        assertFalse(CnpjAlfanumerico.isValid("12.AB*C.345/01DE-35"));
        assertFalse(CnpjAlfanumerico.isValid("12@ABC34501DE35"));
        assertFalse(CnpjAlfanumerico.isValid("12.ÁBC.345/01DE-35"));
        assertFalse(CnpjAlfanumerico.isValid("12_ABC_345_01DE_35"));
    }

    @Test
    void isValid_rejectsNullValue() {
        assertFalse(CnpjAlfanumerico.isValid(null));
    }

    @Test
    void beanValidation_nullAndBlankPass() {
        assertTrue(validator.validate(new CnpjHolder(null)).isEmpty());
        assertTrue(validator.validate(new CnpjHolder("")).isEmpty());
        assertTrue(validator.validate(new CnpjHolder("   ")).isEmpty());
    }

    @Test
    void beanValidation_invalidDvFails() {
        Set<ConstraintViolation<CnpjHolder>> violations = validator.validate(new CnpjHolder("12.ABC.345/01DE-99"));
        assertFalse(violations.isEmpty());
    }

    @Test
    void beanValidation_validMaskedPasses() {
        assertTrue(validator.validate(new CnpjHolder("12.ABC.345/01DE-35")).isEmpty());
    }

    @Test
    void beanValidation_rejectsSpecialCharsOutsideMask() {
        Set<ConstraintViolation<CnpjHolder>> violations =
                validator.validate(new CnpjHolder("12.AB*C.345/01DE-35"));
        assertFalse(violations.isEmpty());
    }
}
