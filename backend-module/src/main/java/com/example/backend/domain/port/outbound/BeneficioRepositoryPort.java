package com.example.backend.domain.port.outbound;

import com.example.backend.domain.model.Beneficio;
import java.util.List;
import java.util.Optional;

public interface BeneficioRepositoryPort {
    List<Beneficio> findAll();
    Optional<Beneficio> findById(Long id);
    Beneficio save(Beneficio beneficio);
    void delete(Beneficio beneficio);
}
