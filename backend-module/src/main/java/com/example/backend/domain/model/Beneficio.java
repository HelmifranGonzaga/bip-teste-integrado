package com.example.backend.domain.model;

import java.math.BigDecimal;
import java.util.Locale;

public class Beneficio {
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal valor;
    private Boolean ativo = Boolean.TRUE;
    private Long version;
    private String cnpj;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        if (descricao != null && descricao.length() > 255) {
            throw new IllegalArgumentException("Descrição deve ter no máximo 255 caracteres");
        }
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        if (valor == null) {
            throw new IllegalArgumentException("Valor é obrigatório");
        }
        if (valor.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor não pode ser negativo");
        }
        this.valor = valor;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        if (ativo == null) {
            throw new IllegalArgumentException("Status ativo é obrigatório");
        }
        this.ativo = ativo;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        if (cnpj == null || cnpj.isBlank()) {
            this.cnpj = null;
            return;
        }
        // Requisitos EF/ET:
        //   - Letras devem ser maiúsculas
        //   - Persistir apenas alfanuméricos (a máscara . / - é estritamente de UI)
        // Centralizamos a normalização aqui para garantir formato uniforme no banco
        // independente do caminho de entrada (REST, EJB, batch).
        String normalized = cnpj.replaceAll("[^0-9A-Za-z]", "").toUpperCase(Locale.ROOT);
        if (normalized.isEmpty()) {
            this.cnpj = null;
            return;
        }
        if (normalized.length() > 32) {
            throw new IllegalArgumentException("CNPJ deve ter no máximo 32 caracteres");
        }
        this.cnpj = normalized;
    }
}
