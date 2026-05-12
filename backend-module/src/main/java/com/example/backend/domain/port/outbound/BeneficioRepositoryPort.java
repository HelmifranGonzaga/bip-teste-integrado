package com.example.backend.domain.port.outbound;

import com.example.backend.domain.model.Beneficio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BeneficioRepositoryPort {
    List<Beneficio> findAll();
    Page<Beneficio> findAllPaginated(Pageable pageable);
    Optional<Beneficio> findById(Long id);
    Beneficio save(Beneficio beneficio);
    void deleteById(Long id);
}
