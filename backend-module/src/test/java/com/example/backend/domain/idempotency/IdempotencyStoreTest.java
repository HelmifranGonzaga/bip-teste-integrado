package com.example.backend.domain.idempotency;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.backend.adapter.outbound.persistence.IdempotencyJpaRepository;
import com.example.ejb.IdempotencyEntity;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class IdempotencyStoreTest {

    @Mock
    private IdempotencyJpaRepository repository;

    @Captor
    private ArgumentCaptor<IdempotencyEntity> entityCaptor;

    private IdempotencyStore store;

    @BeforeEach
    void setUp() {
        store = new IdempotencyStore(repository);
    }

    @Test
    void shouldStoreIdempotencyKey() {
        store.store("key-123", "result-abc");

        verify(repository).save(entityCaptor.capture());
        IdempotencyEntity saved = entityCaptor.getValue();
        assertEquals("key-123", saved.getChave());
        assertEquals("result-abc", saved.getResultado());
        assertNotNull(saved.getCriadoEm());
        assertNotNull(saved.getExpireEm());
        assertTrue(saved.getExpireEm().isAfter(saved.getCriadoEm()));
    }

    @Test
    void shouldStoreWithNullResult() {
        store.store("key-456", null);

        verify(repository).save(entityCaptor.capture());
        assertNull(entityCaptor.getValue().getResultado());
    }

    @Test
    void shouldReturnTrueWhenKeyExistsAndNotExpired() {
        IdempotencyEntity entity = createEntity("key-123", LocalDateTime.now().plusHours(2));
        when(repository.findByChave("key-123")).thenReturn(Optional.of(entity));

        assertTrue(store.exists("key-123"));
    }

    @Test
    void shouldReturnFalseWhenKeyDoesNotExist() {
        when(repository.findByChave("unknown")).thenReturn(Optional.empty());

        assertFalse(store.exists("unknown"));
    }

    @Test
    void shouldReturnFalseWhenKeyIsExpired() {
        IdempotencyEntity entity = createEntity("key-123", LocalDateTime.now().minusHours(1));
        when(repository.findByChave("key-123")).thenReturn(Optional.of(entity));

        assertFalse(store.exists("key-123"));
    }

    @Test
    void shouldReturnIdempotencyResultWhenKeyExists() {
        IdempotencyEntity entity = createEntity("key-123", LocalDateTime.now().plusHours(2));
        entity.setResultado("cached-result");
        when(repository.findByChave("key-123")).thenReturn(Optional.of(entity));

        IdempotencyStore.IdempotencyResult result = store.get("key-123");

        assertNotNull(result);
        assertEquals("cached-result", result.result());
    }

    @Test
    void shouldReturnNullWhenGettingNonExistentKey() {
        when(repository.findByChave("unknown")).thenReturn(Optional.empty());

        assertNull(store.get("unknown"));
    }

    @Test
    void shouldCleanupExpiredKeys() {
        store.cleanupExpired();

        verify(repository).deleteByExpireEmBefore(any(LocalDateTime.class));
    }

    private IdempotencyEntity createEntity(String chave, LocalDateTime expireEm) {
        IdempotencyEntity entity = new IdempotencyEntity();
        entity.setChave(chave);
        entity.setCriadoEm(LocalDateTime.now());
        entity.setExpireEm(expireEm);
        return entity;
    }
}
