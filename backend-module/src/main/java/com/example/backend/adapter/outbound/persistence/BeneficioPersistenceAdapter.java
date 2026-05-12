package com.example.backend.adapter.outbound.persistence;

import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class BeneficioPersistenceAdapter implements BeneficioRepositoryPort {

    private final BeneficioJpaRepository repository;
    private final BeneficioPersistenceMapper mapper;

    public BeneficioPersistenceAdapter(BeneficioJpaRepository repository, BeneficioPersistenceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<Beneficio> findAll() {
        return repository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public Page<Beneficio> findAllPaginated(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toDomain);
    }

    @Override
    public Optional<Beneficio> findById(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Beneficio save(Beneficio beneficio) {
        String currentUser = getCurrentUsername();
        boolean isNew = beneficio.getId() == null;

        com.example.ejb.Beneficio entity = mapper.toEntity(beneficio);

        if (isNew) {
            entity.setCreatedBy(currentUser);
            entity.setCreatedAt(LocalDateTime.now());
        }
        entity.setUpdatedBy(currentUser);
        entity.setUpdatedAt(LocalDateTime.now());

        return mapper.toDomain(repository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : "system";
    }
}
