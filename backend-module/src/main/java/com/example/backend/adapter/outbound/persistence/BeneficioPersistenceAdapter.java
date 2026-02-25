package com.example.backend.adapter.outbound.persistence;

import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class BeneficioPersistenceAdapter implements BeneficioRepositoryPort {

    private final BeneficioJpaRepository repository;

    public BeneficioPersistenceAdapter(BeneficioJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Beneficio> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Beneficio> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Beneficio save(Beneficio beneficio) {
        com.example.ejb.Beneficio entity = toEntity(beneficio);
        return toDomain(repository.save(entity));
    }

    @Override
    public void delete(Beneficio beneficio) {
        repository.delete(toEntity(beneficio));
    }

    private Beneficio toDomain(com.example.ejb.Beneficio entity) {
        Beneficio domain = new Beneficio();
        domain.setId(entity.getId());
        domain.setNome(entity.getNome());
        domain.setDescricao(entity.getDescricao());
        domain.setValor(entity.getValor());
        domain.setAtivo(entity.getAtivo());
        domain.setVersion(entity.getVersion());
        return domain;
    }

    private com.example.ejb.Beneficio toEntity(Beneficio domain) {
        com.example.ejb.Beneficio entity = new com.example.ejb.Beneficio();
        entity.setId(domain.getId());
        entity.setNome(domain.getNome());
        entity.setDescricao(domain.getDescricao());
        entity.setValor(domain.getValor());
        entity.setAtivo(domain.getAtivo());
        entity.setVersion(domain.getVersion());
        return entity;
    }
}
