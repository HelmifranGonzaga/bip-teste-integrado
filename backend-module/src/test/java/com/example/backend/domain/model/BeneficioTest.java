package com.example.backend.domain.model;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class BeneficioTest {

    @Test
    void shouldSetAndGetProperties() {
        Beneficio beneficio = new Beneficio();
        
        beneficio.setId(1L);
        beneficio.setNome("Teste");
        beneficio.setDescricao("Descricao Teste");
        beneficio.setValor(new BigDecimal("100.00"));
        beneficio.setAtivo(false);
        beneficio.setVersion(1L);
        beneficio.setCnpj("12.ABC.345/01DE-35");

        assertEquals(1L, beneficio.getId());
        assertEquals("Teste", beneficio.getNome());
        assertEquals("Descricao Teste", beneficio.getDescricao());
        assertEquals(new BigDecimal("100.00"), beneficio.getValor());
        assertFalse(beneficio.getAtivo());
        assertEquals(1L, beneficio.getVersion());
        // CNPJ é persistido sem máscara e em caixa alta (requisito EF/ET).
        assertEquals("12ABC34501DE35", beneficio.getCnpj());
    }

    @Test
    void setCnpjShouldStripMaskAndUppercaseLetters() {
        Beneficio beneficio = new Beneficio();

        beneficio.setCnpj("12.abc.345/01de-35");

        assertEquals("12ABC34501DE35", beneficio.getCnpj());
    }

    @Test
    void setCnpjShouldStripMaskFromNumericClassicCnpj() {
        Beneficio beneficio = new Beneficio();

        beneficio.setCnpj("11.222.333/0001-81");

        assertEquals("11222333000181", beneficio.getCnpj());
    }

    @Test
    void setCnpjShouldAcceptAlreadyNormalizedValue() {
        Beneficio beneficio = new Beneficio();

        beneficio.setCnpj("12ABC34501DE35");

        assertEquals("12ABC34501DE35", beneficio.getCnpj());
    }

    @Test
    void setCnpjShouldNormalizeNullBlankAndPunctuationOnlyToNull() {
        Beneficio beneficio = new Beneficio();
        beneficio.setCnpj(null);
        assertNull(beneficio.getCnpj());

        beneficio.setCnpj("   ");
        assertNull(beneficio.getCnpj());

        // Apenas caracteres da máscara, sem alfanuméricos: trata como vazio
        beneficio.setCnpj("./-");
        assertNull(beneficio.getCnpj());
    }

    @Test
    void setCnpjShouldRejectValueLongerThan32CharsAfterNormalization() {
        Beneficio beneficio = new Beneficio();

        // 33 alfanuméricos, sem máscara → ainda excede o limite
        assertThrows(IllegalArgumentException.class, () -> beneficio.setCnpj("X".repeat(33)));
    }
}
