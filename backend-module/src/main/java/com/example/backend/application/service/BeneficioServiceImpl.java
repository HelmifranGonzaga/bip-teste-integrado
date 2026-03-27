package com.example.backend.application.service;

import com.example.backend.adapter.inbound.web.exception.ResourceNotFoundException;
import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import com.example.backend.domain.port.outbound.BeneficioRepositoryPort;
import com.example.backend.domain.port.outbound.BeneficioTransferPort;
import java.math.BigDecimal;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.dao.QueryTimeoutException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BeneficioServiceImpl implements BeneficioUseCase {

    private static final Logger log = LoggerFactory.getLogger(BeneficioServiceImpl.class);
    private final BeneficioRepositoryPort repositoryPort;
    private final BeneficioTransferPort transferPort;

    public BeneficioServiceImpl(BeneficioRepositoryPort repositoryPort, BeneficioTransferPort transferPort) {
        this.repositoryPort = repositoryPort;
        this.transferPort = transferPort;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Beneficio> listAll() {
        log.debug("Listing all beneficios");
        List<Beneficio> beneficios = repositoryPort.findAll();
        log.debug("Found {} beneficios", beneficios.size());
        return beneficios;
    }

    @Override
    @Transactional(readOnly = true)
    public Beneficio getById(Long id) {
        log.debug("Finding beneficio by id: {}", id);
        return findByIdOrThrow(id);
    }

    @Override
    @Transactional
    public Beneficio create(Beneficio beneficio) {
        log.debug("Creating beneficio: {}", beneficio.getNome());
        Beneficio saved = repositoryPort.save(beneficio);
        log.info("Created beneficio with id: {}", saved.getId());
        return saved;
    }

    @Override
    @Transactional
    public Beneficio update(Long id, Beneficio beneficio) {
        log.debug("Updating beneficio with id: {}", id);
        Beneficio existing = findByIdOrThrow(id);
        existing.setNome(beneficio.getNome());
        existing.setDescricao(beneficio.getDescricao());
        existing.setValor(beneficio.getValor());
        existing.setAtivo(beneficio.getAtivo());
        Beneficio updated = repositoryPort.save(existing);
        log.info("Updated beneficio with id: {}", updated.getId());
        return updated;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.debug("Deleting beneficio with id: {}", id);
        Beneficio existing = findByIdOrThrow(id);
        repositoryPort.delete(existing);
        log.info("Deleted beneficio with id: {}", id);
    }

    @Override
    @Transactional
    @Retryable(
            retryFor = {
                CannotAcquireLockException.class,
                PessimisticLockingFailureException.class,
                QueryTimeoutException.class
            },
            maxAttempts = 3,
            backoff = @Backoff(delay = 100, multiplier = 2)
    )
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        log.debug("Transferring {} from {} to {}", amount, fromId, toId);
        transferPort.transfer(fromId, toId, amount);
        log.info("Transfer completed: {} from {} to {}", amount, fromId, toId);
    }

    private Beneficio findByIdOrThrow(Long id) {
        return repositoryPort.findById(id)
                .orElseThrow(() -> {
                    log.warn("Beneficio not found: {}", id);
                    return new ResourceNotFoundException("Benefício não encontrado: " + id);
                });
    }
}
