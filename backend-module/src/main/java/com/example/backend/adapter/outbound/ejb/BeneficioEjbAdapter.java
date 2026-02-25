package com.example.backend.adapter.outbound.ejb;

import com.example.backend.domain.port.outbound.BeneficioTransferPort;
import com.example.ejb.BeneficioEjbService;
import java.math.BigDecimal;
import org.springframework.stereotype.Component;

@Component
public class BeneficioEjbAdapter implements BeneficioTransferPort {

    private final BeneficioEjbService ejbService;

    public BeneficioEjbAdapter(BeneficioEjbService ejbService) {
        this.ejbService = ejbService;
    }

    @Override
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        ejbService.transfer(fromId, toId, amount);
    }
}
