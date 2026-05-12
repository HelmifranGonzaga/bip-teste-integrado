package com.example.backend.adapter.outbound.persistence;

import com.example.ejb.IdempotencyEntity;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IdempotencyJpaRepository extends JpaRepository<IdempotencyEntity, Long> {
    Optional<IdempotencyEntity> findByChave(String chave);
    void deleteByExpireEmBefore(LocalDateTime data);
}
