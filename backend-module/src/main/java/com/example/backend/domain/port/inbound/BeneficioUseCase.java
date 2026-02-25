package com.example.backend.domain.port.inbound;

import com.example.backend.domain.model.Beneficio;
import java.math.BigDecimal;
import java.util.List;

public interface BeneficioUseCase {
    List<Beneficio> listAll();
    Beneficio getById(Long id);
    Beneficio create(Beneficio beneficio);
    Beneficio update(Long id, Beneficio beneficio);
    void delete(Long id);
    void transfer(Long fromId, Long toId, BigDecimal amount);
}
