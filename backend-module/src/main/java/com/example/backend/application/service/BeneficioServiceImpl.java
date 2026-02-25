package com.example.backend.application.service;

import com.example.backend.adapter.inbound.web.exception.ResourceNotFoundException;
import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import com.example.backend.domain.port.outbound.BeneficioTransferPort;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BeneficioServiceImpl implements BeneficioUseCase {

    private final BeneficioRepositoryPort repositoryPort;
    private final BeneficioTransferPort transferPort;

    public BeneficioServiceImpl(BeneficioRepositoryPort repositoryPort, BeneficioTransferPort transferPort) {
        this.repositoryPort = repositoryPort;
        this.transferPort = transferPort;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Beneficio> listAll() {
        return repositoryPort.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Beneficio getById(Long id) {
        return repositoryPort.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Benefício não encontrado: " + id));
    }

    @Override
    @Transactional
    public Beneficio create(Beneficio beneficio) {
        return repositoryPort.save(beneficio);
    }

    @Override
    @Transactional
    public Beneficio update(Long id, Beneficio beneficio) {
        Beneficio existing = getById(id);
        existing.setNome(beneficio.getNome());
        existing.setDescricao(beneficio.getDescricao());
        existing.setValor(beneficio.getValor());
        existing.setAtivo(beneficio.getAtivo());
        return repositoryPort.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Beneficio existing = getById(id);
        repositoryPort.delete(existing);
    }

    @Override
    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        transferPort.transfer(fromId, toId, amount);
    }
}
