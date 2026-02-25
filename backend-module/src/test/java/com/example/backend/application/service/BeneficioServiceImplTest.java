package com.example.backend.application.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import com.example.backend.domain.port.outbound.BeneficioTransferPort;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BeneficioServiceImplTest {

    @Mock
    private BeneficioRepositoryPort repositoryPort;

    @Mock
    private BeneficioTransferPort transferPort;

    @InjectMocks
    private BeneficioServiceImpl service;

    private Beneficio beneficio;

    @BeforeEach
    void setUp() {
        beneficio = new Beneficio();
        beneficio.setId(1L);
        beneficio.setNome("Teste");
        beneficio.setValor(new BigDecimal("100.00"));
    }

    @Test
    void shouldCreateBeneficio() {
        when(repositoryPort.save(any(Beneficio.class))).thenReturn(beneficio);

        Beneficio created = service.create(beneficio);

        assertNotNull(created);
        assertEquals("Teste", created.getNome());
        verify(repositoryPort).save(beneficio);
    }

    @Test
    void shouldUpdateBeneficio() {
        when(repositoryPort.findById(1L)).thenReturn(Optional.of(beneficio));
        when(repositoryPort.save(any(Beneficio.class))).thenReturn(beneficio);

        Beneficio updatedInfo = new Beneficio();
        updatedInfo.setNome("Atualizado");
        updatedInfo.setValor(new BigDecimal("200.00"));

        Beneficio updated = service.update(1L, updatedInfo);

        assertEquals("Atualizado", updated.getNome());
        assertEquals(new BigDecimal("200.00"), updated.getValor());
        verify(repositoryPort).save(beneficio);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistentBeneficio() {
        when(repositoryPort.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.update(1L, new Beneficio()));
    }

    @Test
    void shouldFindById() {
        when(repositoryPort.findById(1L)).thenReturn(Optional.of(beneficio));

        Beneficio found = service.getById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void shouldFindAll() {
        when(repositoryPort.findAll()).thenReturn(List.of(beneficio));

        List<Beneficio> list = service.listAll();

        assertFalse(list.isEmpty());
        assertEquals(1, list.size());
    }

    @Test
    void shouldDeleteBeneficio() {
        when(repositoryPort.findById(1L)).thenReturn(Optional.of(beneficio));
        doNothing().when(repositoryPort).delete(beneficio);

        service.delete(1L);

        verify(repositoryPort).delete(beneficio);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistentBeneficio() {
        when(repositoryPort.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.delete(1L));
    }

    @Test
    void shouldTransfer() {
        doNothing().when(transferPort).transfer(1L, 2L, BigDecimal.TEN);

        service.transfer(1L, 2L, BigDecimal.TEN);

        verify(transferPort).transfer(1L, 2L, BigDecimal.TEN);
    }
}
