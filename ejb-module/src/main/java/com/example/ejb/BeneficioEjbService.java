package com.example.ejb;

import jakarta.ejb.Stateless;
import jakarta.persistence.LockModeType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Stateless
@Component
public class BeneficioEjbService {

    private static final Logger log = LoggerFactory.getLogger(BeneficioEjbService.class);

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        log.debug("EJB Transfer initiated: {} from {} to {}", amount, fromId, toId);

        validateTransfer(fromId, toId, amount);

        Long firstId = Math.min(fromId, toId);
        Long secondId = Math.max(fromId, toId);

        Beneficio first = em.find(Beneficio.class, firstId, LockModeType.PESSIMISTIC_WRITE);
        Beneficio second = em.find(Beneficio.class, secondId, LockModeType.PESSIMISTIC_WRITE);

        Beneficio from = fromId.equals(firstId) ? first : second;
        Beneficio to = toId.equals(firstId) ? first : second;

        validateBeneficioExists(from, to);
        validateBeneficioAtivo(from, to);
        validateSaldo(from, amount);

        from.setValor(from.getValor().subtract(amount));
        to.setValor(to.getValor().add(amount));

        em.merge(from);
        em.merge(to);
        em.flush();

        log.info("EJB Transfer completed: {} from {} to {}", amount, fromId, toId);
    }

    private void validateTransfer(Long fromId, Long toId, BigDecimal amount) {
        if (fromId == null || toId == null) {
            log.error("Transfer validation failed: IDs are null");
            throw new IllegalArgumentException("IDs de origem e destino são obrigatórios");
        }
        if (fromId.equals(toId)) {
            log.error("Transfer validation failed: fromId equals toId");
            throw new IllegalArgumentException("Origem e destino devem ser diferentes");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            log.error("Transfer validation failed: invalid amount {}", amount);
            throw new IllegalArgumentException("Valor da transferência deve ser maior que zero");
        }
    }

    private void validateBeneficioExists(Beneficio from, Beneficio to) {
        if (from == null || to == null) {
            log.error("Transfer validation failed: beneficio not found");
            throw new IllegalArgumentException("Benefício de origem ou destino não encontrado");
        }
    }

    private void validateBeneficioAtivo(Beneficio from, Beneficio to) {
        if (!Boolean.TRUE.equals(from.getAtivo()) || !Boolean.TRUE.equals(to.getAtivo())) {
            log.error("Transfer validation failed: inactive beneficio");
            throw new IllegalStateException("Transferência permitida apenas entre benefícios ativos");
        }
    }

    private void validateSaldo(Beneficio from, BigDecimal amount) {
        if (from.getValor().compareTo(amount) < 0) {
            log.error("Transfer validation failed: insufficient balance");
            throw new IllegalStateException("Saldo insuficiente para transferência");
        }
    }
}
