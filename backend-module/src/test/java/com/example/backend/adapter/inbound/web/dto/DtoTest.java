package com.example.backend.adapter.inbound.web.dto;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class DtoTest {

    @Test
    void shouldSetAndGetBeneficioRequest() {
        BeneficioRequest request = new BeneficioRequest("Teste", "Desc", BigDecimal.TEN, true);

        assertEquals("Teste", request.nome());
        assertEquals("Desc", request.descricao());
        assertEquals(BigDecimal.TEN, request.valor());
        assertTrue(request.ativo());
    }

    @Test
    void shouldSetAndGetBeneficioResponse() {
        BeneficioResponse response = new BeneficioResponse(1L, "Teste", "Desc", BigDecimal.TEN, true, 1L);

        assertEquals(1L, response.id());
        assertEquals("Teste", response.nome());
        assertEquals("Desc", response.descricao());
        assertEquals(BigDecimal.TEN, response.valor());
        assertTrue(response.ativo());
        assertEquals(1L, response.version());
    }

    @Test
    void shouldSetAndGetTransferRequest() {
        TransferRequest request = new TransferRequest(1L, 2L, BigDecimal.TEN);

        assertEquals(1L, request.fromId());
        assertEquals(2L, request.toId());
        assertEquals(BigDecimal.TEN, request.amount());
    }
}
