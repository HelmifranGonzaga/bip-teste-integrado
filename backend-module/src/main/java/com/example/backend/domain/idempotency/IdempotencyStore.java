package com.example.backend.domain.idempotency;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * Idempotency Key Store.
 * Armazena resultados de operações idempotentes para evitar duplicação.
 *
 * Em produção, usar Redis para compartilhar entre múltiplas instâncias.
 *
 * ADR-003: Idempotency via request header + result cache
 */
@Component
public class IdempotencyStore {

    private final ConcurrentHashMap<String, IdempotencyResult> cache = new ConcurrentHashMap<>();
    private static final long TTL_MILLIS = 3600000; // 1h

    public void store(String idempotencyKey, Object result) {
        cache.put(idempotencyKey, new IdempotencyResult(result, System.currentTimeMillis()));
        // Cleanup simples (em produção, usar job agendado)
        if (cache.size() > 10000) {
            cache.forEach((key, value) -> {
                if (System.currentTimeMillis() - value.timestamp() > TTL_MILLIS) {
                    cache.remove(key);
                }
            });
        }
    }

    public IdempotencyResult get(String idempotencyKey) {
        IdempotencyResult result = cache.get(idempotencyKey);
        if (result != null && System.currentTimeMillis() - result.timestamp() > TTL_MILLIS) {
            cache.remove(idempotencyKey);
            return null;
        }
        return result;
    }

    public boolean exists(String idempotencyKey) {
        return get(idempotencyKey) != null;
    }

    public record IdempotencyResult(Object result, long timestamp) {}
}
