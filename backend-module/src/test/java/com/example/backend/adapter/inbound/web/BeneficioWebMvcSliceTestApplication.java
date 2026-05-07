package com.example.backend.adapter.inbound.web;

import com.example.backend.adapter.inbound.web.exception.ApiExceptionHandler;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Import;

/**
 * Configuração mínima para {@link BeneficioControllerTest}: fica no mesmo pacote do teste para que o
 * bootstrap do Spring Boot a encontre antes de {@code com.example.backend.BackendApplication} (scan amplo).
 */
@SpringBootConfiguration
@Import({BeneficioController.class, ApiExceptionHandler.class})
public class BeneficioWebMvcSliceTestApplication {}
