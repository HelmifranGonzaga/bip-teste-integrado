package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class BeneficioServiceIntegrationTest {

    @Autowired
    private BeneficioUseCase service;

    @Autowired
    private BeneficioRepositoryPort repository;

    @Test
    void shouldTransferBetweenBenefits() {
        Beneficio origem = repository.findById(1L).orElseThrow();
        Beneficio destino = repository.findById(2L).orElseThrow();

        service.transfer(origem.getId(), destino.getId(), new BigDecimal("100.00"));

        Beneficio origemAtualizada = repository.findById(1L).orElseThrow();
        Beneficio destinoAtualizado = repository.findById(2L).orElseThrow();

        assertEquals(new BigDecimal("750.00"), origemAtualizada.getValor());
        assertEquals(new BigDecimal("1000.00"), destinoAtualizado.getValor());
    }

    @Test
    void shouldRejectTransferWhenInsufficientBalance() {
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> service.transfer(2L, 1L, new BigDecimal("9999.00"))
        );

        assertEquals("Saldo insuficiente para transferência", exception.getMessage());
    }
}
