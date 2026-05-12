package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Objeto de requisição para atualização de Usuários")
public record UserUpdateRequest(
        @Schema(description = "Nome de usuário (login)", example = "joao.silva")
        @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres")
        String username,

        @Schema(description = "Nova senha (opcional — se vazia, mantém a senha atual)")
        @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
        String password,

        @Schema(description = "Nome completo do usuário", example = "João Silva")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nome,

        @Schema(description = "Perfil de acesso", example = "USER")
        String role
) {
}