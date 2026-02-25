package com.example.ejb;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BeneficioEjbServiceTest {

    @Mock
    private EntityManager em;

    @InjectMocks
    private BeneficioEjbService service;

    private Beneficio from;
    private Beneficio to;

    @BeforeEach
    void setUp() {
        from = new Beneficio();
        from.setId(1L);
        from.setAtivo(true);
        from.setValor(new BigDecimal("1000.00"));

        to = new Beneficio();
        to.setId(2L);
        to.setAtivo(true);
        to.setValor(new BigDecimal("500.00"));
    }

    @Test
    void shouldTransferSuccessfully() {
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(from);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(to);

        service.transfer(1L, 2L, new BigDecimal("200.00"));

        assertEquals(new BigDecimal("800.00"), from.getValor());
        assertEquals(new BigDecimal("700.00"), to.getValor());
        verify(em).merge(from);
        verify(em).merge(to);
        verify(em).flush();
    }

    @Test
    void shouldTransferSuccessfullyReverseOrder() {
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(to);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(from);

        service.transfer(2L, 1L, new BigDecimal("200.00"));

        assertEquals(new BigDecimal("800.00"), from.getValor());
        assertEquals(new BigDecimal("700.00"), to.getValor());
        verify(em).merge(from);
        verify(em).merge(to);
        verify(em).flush();
    }

    @Test
    void shouldThrowExceptionWhenIdsAreNull() {
        assertThrows(IllegalArgumentException.class, () -> service.transfer(null, 2L, BigDecimal.TEN));
        assertThrows(IllegalArgumentException.class, () -> service.transfer(1L, null, BigDecimal.TEN));
    }

    @Test
    void shouldThrowExceptionWhenIdsAreSame() {
        assertThrows(IllegalArgumentException.class, () -> service.transfer(1L, 1L, BigDecimal.TEN));
    }

    @Test
    void shouldThrowExceptionWhenAmountIsInvalid() {
        assertThrows(IllegalArgumentException.class, () -> service.transfer(1L, 2L, null));
        assertThrows(IllegalArgumentException.class, () -> service.transfer(1L, 2L, BigDecimal.ZERO));
        assertThrows(IllegalArgumentException.class, () -> service.transfer(1L, 2L, new BigDecimal("-10.00")));
    }

    @Test
    void shouldThrowExceptionWhenBeneficioNotFound() {
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(from);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(null);

        assertThrows(IllegalArgumentException.class, () -> service.transfer(1L, 2L, BigDecimal.TEN));
        
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(null);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(to);

        assertThrows(IllegalArgumentException.class, () -> service.transfer(1L, 2L, BigDecimal.TEN));
    }

    @Test
    void shouldThrowExceptionWhenBeneficioIsInactive() {
        from.setAtivo(false);
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(from);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(to);

        assertThrows(IllegalStateException.class, () -> service.transfer(1L, 2L, BigDecimal.TEN));
        
        from.setAtivo(true);
        to.setAtivo(false);
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(from);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(to);

        assertThrows(IllegalStateException.class, () -> service.transfer(1L, 2L, BigDecimal.TEN));
    }

    @Test
    void shouldThrowExceptionWhenInsufficientBalance() {
        when(em.find(Beneficio.class, 1L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(from);
        when(em.find(Beneficio.class, 2L, LockModeType.PESSIMISTIC_WRITE)).thenReturn(to);

        assertThrows(IllegalStateException.class, () -> service.transfer(1L, 2L, new BigDecimal("2000.00")));
    }
}
