package com.example.backend.adapter.outbound.ejb;

import com.example.ejb.BeneficioEjbService;
import java.math.BigDecimal;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class BeneficioEjbAdapterTest {

    @Test
    void shouldTransfer() {
        AtomicReference<Long> capturedFromId = new AtomicReference<>();
        AtomicReference<Long> capturedToId = new AtomicReference<>();
        AtomicReference<BigDecimal> capturedAmount = new AtomicReference<>();

        BeneficioEjbService ejbService = new BeneficioEjbService() {
            @Override
            public void transfer(Long fromId, Long toId, BigDecimal amount) {
                capturedFromId.set(fromId);
                capturedToId.set(toId);
                capturedAmount.set(amount);
            }
        };

        BeneficioEjbAdapter adapter = new BeneficioEjbAdapter(ejbService);
        adapter.transfer(1L, 2L, BigDecimal.TEN);

        assertEquals(1L, capturedFromId.get());
        assertEquals(2L, capturedToId.get());
        assertEquals(BigDecimal.TEN, capturedAmount.get());
    }
}
