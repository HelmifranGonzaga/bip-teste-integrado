package com.example.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class BeneficioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldListBenefits() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nome").value("Vale Alimentação"));
    }

    @Test
    void shouldGetBenefitById() throws Exception {
        mockMvc.perform(get("/api/v1/beneficios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Vale Alimentação"));
    }

    @Test
    void shouldCreateBenefit() throws Exception {
        String payload = """
                {
                  "nome": "Novo Beneficio",
                  "descricao": "Descricao",
                  "valor": 100.0,
                  "ativo": true
                }
                """;

        mockMvc.perform(post("/api/v1/beneficios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Novo Beneficio"));
    }

    @Test
    void shouldUpdateBenefit() throws Exception {
        String payload = """
                {
                  "nome": "Beneficio Atualizado",
                  "descricao": "Descricao Atualizada",
                  "valor": 200.0,
                  "ativo": true
                }
                """;

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/v1/beneficios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Beneficio Atualizado"));
    }

    @Test
    void shouldDeleteBenefit() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/v1/beneficios/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldTransferBalance() throws Exception {
        String payload = """
                {
                  "fromId": 1,
                  "toId": 2,
                  "amount": 50.0
                }
                """;

        mockMvc.perform(post("/api/v1/beneficios/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldValidateTransferPayload() throws Exception {
        String payload = """
                {
                  "fromId": 1,
                  "toId": 2,
                  "amount": 0
                }
                """;

        mockMvc.perform(post("/api/v1/beneficios/transfer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }
}
