package com.example.backend.adapter.inbound.web;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.backend.adapter.inbound.web.dto.BeneficioResponse;
import com.example.backend.adapter.inbound.web.dto.TransferRequest;
import com.example.backend.adapter.inbound.web.exception.ApiExceptionHandler;
import com.example.backend.adapter.inbound.web.mapper.BeneficioMapper;
import com.example.backend.domain.idempotency.IdempotencyStore;
import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import com.example.backend.adapter.inbound.web.testconfig.BeneficioWebMvcSliceTestApplication;

@WebMvcTest(
        controllers = BeneficioController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, UserDetailsServiceAutoConfiguration.class})
@ContextConfiguration(classes = BeneficioWebMvcSliceTestApplication.class)
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

    @MockBean
    private IdempotencyStore idempotencyStore;

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
                null,
                null,
                null,
                null,
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

    @Test
    void getList_returns200_withBeneficios() throws Exception {
        BeneficioResponse response = new BeneficioResponse(
                1L, "Vale Alimentação", "Auxílio", null, new BigDecimal("850.00"), true,
                null, null, null, null, 0L);

        when(beneficioUseCase.listAll()).thenReturn(List.of());
        when(beneficioMapper.toResponse(any())).thenReturn(response);

        mockMvc.perform(get(BASE_PATH))
                .andExpect(status().isOk());
    }

    @Test
    void getById_returns200_whenBeneficioExists() throws Exception {
        Beneficio domain = new Beneficio();
        domain.setId(1L);
        domain.setNome("Vale Alimentação");

        BeneficioResponse response = new BeneficioResponse(
                1L, "Vale Alimentação", null, null, null, true,
                null, null, null, null, 0L);

        when(beneficioUseCase.getById(1L)).thenReturn(domain);
        when(beneficioMapper.toResponse(domain)).thenReturn(response);

        mockMvc.perform(get(BASE_PATH + "/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Vale Alimentação"));
    }

    @Test
    void putUpdate_returns200_whenValid() throws Exception {
        Beneficio domainIn = new Beneficio();
        domainIn.setNome("Atualizado");
        domainIn.setDescricao("Desc Atualizada");
        domainIn.setValor(new BigDecimal("500.00"));
        domainIn.setAtivo(true);

        Beneficio updated = new Beneficio();
        updated.setId(1L);
        updated.setNome("Atualizado");
        updated.setDescricao("Desc Atualizada");
        updated.setValor(new BigDecimal("500.00"));
        updated.setAtivo(true);
        updated.setVersion(1L);

        BeneficioResponse response = new BeneficioResponse(
                1L, "Atualizado", "Desc Atualizada", null, new BigDecimal("500.00"), true,
                null, null, null, null, 1L);

        when(beneficioMapper.toDomain(any())).thenReturn(domainIn);
        when(beneficioUseCase.update(eq(1L), any(Beneficio.class))).thenReturn(updated);
        when(beneficioMapper.toResponse(updated)).thenReturn(response);

        Map<String, Object> body = validCreateBody();

        mockMvc.perform(put(BASE_PATH + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Atualizado"))
                .andExpect(jsonPath("$.version").value(1));
    }

    @Test
    void delete_returns204_whenBeneficioExists() throws Exception {
        mockMvc.perform(delete(BASE_PATH + "/1"))
                .andExpect(status().isNoContent());

        verify(beneficioUseCase).delete(1L);
    }

    @Test
    void postTransfer_withoutIdempotency_returns204() throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("fromId", 1);
        body.put("toId", 2);
        body.put("amount", new BigDecimal("100.00"));

        mockMvc.perform(post(BASE_PATH + "/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isNoContent());

        verify(beneficioUseCase).transfer(1L, 2L, new BigDecimal("100.00"));
    }

    @Test
    void postTransfer_withNewIdempotencyKey_returns201() throws Exception {
        when(idempotencyStore.exists("new-key-123")).thenReturn(false);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("fromId", 1);
        body.put("toId", 2);
        body.put("amount", new BigDecimal("100.00"));

        mockMvc.perform(post(BASE_PATH + "/transfer")
                        .header("Idempotency-Key", "new-key-123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated());

        verify(idempotencyStore).exists("new-key-123");
        verify(beneficioUseCase).transfer(1L, 2L, new BigDecimal("100.00"));
        verify(idempotencyStore).store("new-key-123", null);
    }

    @Test
    void postTransfer_withExistingIdempotencyKey_returns200() throws Exception {
        when(idempotencyStore.exists("existing-key")).thenReturn(true);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("fromId", 1);
        body.put("toId", 2);
        body.put("amount", new BigDecimal("100.00"));

        mockMvc.perform(post(BASE_PATH + "/transfer")
                        .header("Idempotency-Key", "existing-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        verify(idempotencyStore).exists("existing-key");
        verify(beneficioUseCase, never()).transfer(any(), any(), any());
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
