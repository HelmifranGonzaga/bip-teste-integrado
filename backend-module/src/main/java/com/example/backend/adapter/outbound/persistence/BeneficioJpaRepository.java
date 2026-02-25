package com.example.backend.adapter.outbound.persistence;

import com.example.ejb.Beneficio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BeneficioJpaRepository extends JpaRepository<Beneficio, Long> {
}
