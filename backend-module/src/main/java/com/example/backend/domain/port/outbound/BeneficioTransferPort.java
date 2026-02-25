package com.example.backend.domain.port.outbound;

import java.math.BigDecimal;

public interface BeneficioTransferPort {
    void transfer(Long fromId, Long toId, BigDecimal amount);
}
