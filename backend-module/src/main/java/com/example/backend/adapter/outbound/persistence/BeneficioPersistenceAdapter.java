package com.example.backend.adapter.outbound.persistence;

import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import java.util.List;
import java.util.Optional;
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
    public Optional<Beneficio> findById(Long id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Beneficio save(Beneficio beneficio) {
        com.example.ejb.Beneficio entity = mapper.toEntity(beneficio);
        return mapper.toDomain(repository.save(entity));
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
