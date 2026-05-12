package com.example.backend.domain.idempotency;

import com.example.backend.adapter.outbound.persistence.IdempotencyJpaRepository;
import com.example.ejb.IdempotencyEntity;
import java.time.LocalDateTime;
import org.springframework.stereotype.Component;

@Component
public class IdempotencyStore {

    private final IdempotencyJpaRepository repository;
    private static final long TTL_HOURS = 1;

    public IdempotencyStore(IdempotencyJpaRepository repository) {
        this.repository = repository;
    }

    public void store(String idempotencyKey, Object result) {
        IdempotencyEntity entity = new IdempotencyEntity();
        entity.setChave(idempotencyKey);
        entity.setResultado(result != null ? result.toString() : null);
        entity.setCriadoEm(LocalDateTime.now());
        entity.setExpireEm(LocalDateTime.now().plusHours(TTL_HOURS));
        repository.save(entity);
    }

    public IdempotencyResult get(String idempotencyKey) {
        return repository.findByChave(idempotencyKey)
                .filter(e -> e.getExpireEm().isAfter(LocalDateTime.now()))
                .map(e -> new IdempotencyResult(e.getResultado(), e.getCriadoEm().atZone(java.time.ZoneOffset.UTC).toEpochSecond() * 1000))
                .orElse(null);
    }

    public boolean exists(String idempotencyKey) {
        return repository.findByChave(idempotencyKey)
                .filter(e -> e.getExpireEm().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    public void cleanupExpired() {
        repository.deleteByExpireEmBefore(LocalDateTime.now());
    }

    public record IdempotencyResult(Object result, long timestamp) {}
}
