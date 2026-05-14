package com.example.backend.adapter.inbound.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.backend.adapter.inbound.web.dto.PasswordResetResponse;
import com.example.backend.adapter.inbound.web.dto.UserRequest;
import com.example.backend.adapter.inbound.web.dto.UserResponse;
import com.example.backend.adapter.inbound.web.dto.UserUpdateRequest;
import com.example.backend.application.service.UserService;
import com.example.backend.domain.exception.UserNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.test.web.servlet.MockMvc;
import com.example.backend.adapter.inbound.web.testconfig.UserWebMvcSliceTestApplication;

@WebMvcTest(
        controllers = UserController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, UserDetailsServiceAutoConfiguration.class})
@ContextConfiguration(classes = UserWebMvcSliceTestApplication.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private final UserResponse userResponse = new UserResponse(1L, "joao", "João Silva", "USER", true, 0L);

    @Test
    void shouldListUsers() throws Exception {
        when(userService.listAll()).thenReturn(List.of(userResponse));

        mockMvc.perform(get("/api/v1/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].username").value("joao"));
    }

    @Test
    void shouldGetUserById() throws Exception {
        when(userService.getById(1L)).thenReturn(userResponse);

        mockMvc.perform(get("/api/v1/usuarios/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("joao"));
    }

    @Test
    void shouldReturn404WhenGetUserByIdNotFound() throws Exception {
        when(userService.getById(99L)).thenThrow(new UserNotFoundException(99L));

        mockMvc.perform(get("/api/v1/usuarios/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateUser() throws Exception {
        UserResponse created = new UserResponse(2L, "novo", "Novo Usuário", "USER", true, 0L);
        when(userService.create(any(UserRequest.class))).thenReturn(created);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("username", "novo");
        body.put("password", "senha123");
        body.put("nome", "Novo Usuário");
        body.put("role", "USER");

        mockMvc.perform(post("/api/v1/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.username").value("novo"));
    }

    @Test
    void shouldReturn400WhenCreateWithInvalidBody() throws Exception {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("username", "");

        mockMvc.perform(post("/api/v1/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdateUser() throws Exception {
        UserResponse updated = new UserResponse(1L, "joao.upd", "João Atualizado", "ADMIN", true, 1L);
        when(userService.update(eq(1L), any(UserUpdateRequest.class))).thenReturn(updated);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("username", "joao.upd");
        body.put("nome", "João Atualizado");
        body.put("role", "ADMIN");

        mockMvc.perform(put("/api/v1/usuarios/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("joao.upd"))
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void shouldDeleteUser() throws Exception {
        mockMvc.perform(delete("/api/v1/usuarios/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenDeleteUserNotFound() throws Exception {
        doThrow(new UserNotFoundException(99L))
                .when(userService).delete(99L);

        mockMvc.perform(delete("/api/v1/usuarios/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetCurrentUser() throws Exception {
        when(userService.getCurrentUser()).thenReturn(userResponse);

        mockMvc.perform(get("/api/v1/usuarios/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("joao"));
    }

    @Test
    void shouldToggleActive() throws Exception {
        UserResponse toggled = new UserResponse(1L, "joao", "João Silva", "USER", false, 1L);
        when(userService.toggleActive(1L)).thenReturn(toggled);

        mockMvc.perform(patch("/api/v1/usuarios/1/ativo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
    }

    @Test
    void shouldReturn404WhenToggleActiveUserNotFound() throws Exception {
        when(userService.toggleActive(99L)).thenThrow(new UserNotFoundException(99L));

        mockMvc.perform(patch("/api/v1/usuarios/99/ativo"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldResetPassword() throws Exception {
        when(userService.resetPassword(1L)).thenReturn("NovaSenha123");

        mockMvc.perform(post("/api/v1/usuarios/1/reset-password"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.novaSenha").value("NovaSenha123"));
    }
}
