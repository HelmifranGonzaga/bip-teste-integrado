package com.example.backend.adapter.outbound.persistence;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.backend.domain.model.Beneficio;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BeneficioPersistenceAdapterTest {

    @Mock
    private BeneficioJpaRepository repository;

    @Mock
    private BeneficioPersistenceMapper mapper;

    @InjectMocks
    private BeneficioPersistenceAdapter adapter;

    private Beneficio domain;
    private com.example.ejb.Beneficio entity;

    @BeforeEach
    void setUp() {
        domain = new Beneficio();
        domain.setId(1L);
        
        entity = new com.example.ejb.Beneficio();
        entity.setId(1L);
    }

    @Test
    void shouldSave() {
        when(mapper.toEntity(domain)).thenReturn(entity);
        when(repository.save(any(com.example.ejb.Beneficio.class))).thenReturn(entity);
        when(mapper.toDomain(entity)).thenReturn(domain);

        Beneficio saved = adapter.save(domain);

        assertNotNull(saved);
        verify(repository).save(any(com.example.ejb.Beneficio.class));
    }

    @Test
    void shouldFindById() {
        when(repository.findById(1L)).thenReturn(Optional.of(entity));
        when(mapper.toDomain(entity)).thenReturn(domain);

        Optional<Beneficio> found = adapter.findById(1L);

        assertTrue(found.isPresent());
        verify(repository).findById(1L);
    }

    @Test
    void shouldFindAll() {
        when(repository.findAll()).thenReturn(List.of(entity));
        when(mapper.toDomain(entity)).thenReturn(domain);

        List<Beneficio> list = adapter.findAll();

        assertFalse(list.isEmpty());
        verify(repository).findAll();
    }

    @Test
    void shouldDelete() {
        doNothing().when(repository).deleteById(1L);

        adapter.deleteById(1L);

        verify(repository).deleteById(1L);
    }
}
