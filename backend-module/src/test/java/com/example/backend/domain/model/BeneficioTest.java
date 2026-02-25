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

        assertEquals(1L, beneficio.getId());
        assertEquals("Teste", beneficio.getNome());
        assertEquals("Descricao Teste", beneficio.getDescricao());
        assertEquals(new BigDecimal("100.00"), beneficio.getValor());
        assertFalse(beneficio.getAtivo());
        assertEquals(1L, beneficio.getVersion());
    }
}
