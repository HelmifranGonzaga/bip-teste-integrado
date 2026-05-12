package com.example.backend.adapter.outbound.persistence;

import com.example.ejb.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioJpaRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
}
