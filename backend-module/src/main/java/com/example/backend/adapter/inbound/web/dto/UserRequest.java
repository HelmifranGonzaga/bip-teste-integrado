package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Objeto de requisição para criação e atualização de Usuários")
public record UserRequest(
        @Schema(description = "Nome de usuário (login)", example = "joao.silva")
        @NotBlank(message = "Username é obrigatório")
        @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres")
        String username,

        @Schema(description = "Senha do usuário", example = "senha123")
        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, max = 100, message = "Senha deve ter entre 6 e 100 caracteres")
        String password,

        @Schema(description = "Nome completo do usuário", example = "João Silva")
        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nome,

        @Schema(description = "Perfil de acesso", example = "USER")
        String role
) {
}
