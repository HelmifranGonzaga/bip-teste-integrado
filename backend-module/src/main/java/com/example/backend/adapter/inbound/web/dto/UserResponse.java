package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Objeto de resposta contendo os dados do Usuário")
public record UserResponse(
        @Schema(description = "Identificador único do usuário", example = "1")
        Long id,

        @Schema(description = "Nome de usuário (login)", example = "joao.silva")
        String username,

        @Schema(description = "Nome completo do usuário", example = "João Silva")
        String nome,

        @Schema(description = "Perfil de acesso", example = "USER")
        String role,

        @Schema(description = "Status do usuário (ativo/inativo)", example = "true")
        Boolean ativo,

        @Schema(description = "Versão do registro", example = "0")
        Long version
) {
}
