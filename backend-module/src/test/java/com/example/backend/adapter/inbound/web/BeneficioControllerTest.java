package com.example.backend.adapter.inbound.web;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.backend.adapter.inbound.web.dto.BeneficioResponse;
import com.example.backend.adapter.inbound.web.exception.ApiExceptionHandler;
import com.example.backend.adapter.inbound.web.mapper.BeneficioMapper;
import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = BeneficioController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, UserDetailsServiceAutoConfiguration.class})
class BeneficioControllerTest {

    private static final String BASE_PATH = "/api/v1/beneficios";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BeneficioUseCase beneficioUseCase;

    @MockBean
    private BeneficioMapper beneficioMapper;

    @Test
    void postCreate_returns400_whenCnpjDvInvalid() throws Exception {
        Map<String, Object> body = validCreateBody();
        body.put("cnpj", "12.ABC.345/01DE-99");

        mockMvc.perform(
                        post(BASE_PATH)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.message", containsString("CNPJ inválido")));

        verifyNoInteractions(beneficioUseCase, beneficioMapper);
    }

    @Test
    void postCreate_returns201_whenCnpjValid_andMapsThroughUseCase() throws Exception {
        Map<String, Object> body = validCreateBody();
        body.put("cnpj", "12.ABC.345/01DE-35");

        Beneficio domainIn = new Beneficio();
        domainIn.setNome("Vale Alimentação");
        domainIn.setDescricao("Auxílio");
        domainIn.setCnpj("12.ABC.345/01DE-35");
        domainIn.setValor(new BigDecimal("850.00"));
        domainIn.setAtivo(true);

        Beneficio saved = new Beneficio();
        saved.setId(42L);
        saved.setNome("Vale Alimentação");
        saved.setDescricao("Auxílio");
        saved.setCnpj("12.ABC.345/01DE-35");
        saved.setValor(new BigDecimal("850.00"));
        saved.setAtivo(true);
        saved.setVersion(0L);

        BeneficioResponse response = new BeneficioResponse(
                42L,
                "Vale Alimentação",
                "Auxílio",
                "12ABC34501DE35",
                new BigDecimal("850.00"),
                true,
                0L);

        when(beneficioMapper.toDomain(any())).thenReturn(domainIn);
        when(beneficioUseCase.create(any(Beneficio.class))).thenReturn(saved);
        when(beneficioMapper.toResponse(any(Beneficio.class))).thenReturn(response);

        mockMvc.perform(
                        post(BASE_PATH)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(42))
                .andExpect(jsonPath("$.nome").value("Vale Alimentação"))
                .andExpect(jsonPath("$.cnpj").value("12ABC34501DE35"))
                .andExpect(jsonPath("$.valor").value(850.0))
                .andExpect(jsonPath("$.ativo").value(true))
                .andExpect(jsonPath("$.version").value(0));

        verify(beneficioMapper).toDomain(any());
        verify(beneficioUseCase).create(domainIn);
        verify(beneficioMapper).toResponse(saved);
    }

    private static Map<String, Object> validCreateBody() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("nome", "Vale Alimentação");
        m.put("descricao", "Auxílio");
        m.put("valor", new BigDecimal("850.00"));
        m.put("ativo", true);
        return m;
    }

}
