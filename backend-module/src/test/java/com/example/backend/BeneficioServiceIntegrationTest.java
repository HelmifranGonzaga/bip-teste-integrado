package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;

import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class BeneficioServiceIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private BeneficioUseCase service;

    @Autowired
    private BeneficioRepositoryPort repository;

    @BeforeEach
    void setup() {
        doAnswer(invocation -> {
            Long fromId = invocation.getArgument(0);
            Long toId = invocation.getArgument(1);
            BigDecimal amount = invocation.getArgument(2);
            Beneficio from = repository.findById(fromId).orElseThrow();
            Beneficio to = repository.findById(toId).orElseThrow();
            if (from.getValor().compareTo(amount) < 0) {
                throw new IllegalStateException("Saldo insuficiente para transferência");
            }
            from.setValor(from.getValor().subtract(amount));
            to.setValor(to.getValor().add(amount));
            repository.save(from);
            repository.save(to);
            return null;
        }).when(beneficioEjbService).transfer(anyLong(), anyLong(), any(BigDecimal.class));
    }

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
