package com.example.backend.adapter.outbound.ejb;

import static org.mockito.Mockito.*;

import com.example.ejb.BeneficioEjbService;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BeneficioEjbAdapterTest {

    @Mock
    private BeneficioEjbService ejbService;

    @InjectMocks
    private BeneficioEjbAdapter adapter;

    @Test
    void shouldTransfer() {
        doNothing().when(ejbService).transfer(1L, 2L, BigDecimal.TEN);

        adapter.transfer(1L, 2L, BigDecimal.TEN);

        verify(ejbService).transfer(1L, 2L, BigDecimal.TEN);
    }
}
