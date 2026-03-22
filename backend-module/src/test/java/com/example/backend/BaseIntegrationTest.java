package com.example.backend;

import com.example.ejb.BeneficioEjbService;
import org.springframework.boot.test.mock.mockito.MockBean;

public abstract class BaseIntegrationTest {
    @MockBean
    protected BeneficioEjbService beneficioEjbService;
}
