package com.example.ejb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "IDEMPOTENCIA")
public class IdempotencyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String chave;

    @Column(columnDefinition = "TEXT")
    private String resultado;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private LocalDateTime expireEm;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getChave() { return chave; }
    public void setChave(String chave) { this.chave = chave; }
    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
    public LocalDateTime getExpireEm() { return expireEm; }
    public void setExpireEm(LocalDateTime expireEm) { this.expireEm = expireEm; }
}
