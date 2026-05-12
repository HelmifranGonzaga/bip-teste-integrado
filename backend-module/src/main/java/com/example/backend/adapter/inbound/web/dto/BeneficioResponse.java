package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Schema(description = "Objeto de resposta contendo os dados do Benefício")
public record BeneficioResponse(
        @Schema(description = "Identificador único do benefício", example = "1")
        Long id,
        
        @Schema(description = "Nome do benefício", example = "Vale Alimentação")
        String nome,
        
        @Schema(description = "Descrição detalhada do benefício", example = "Auxílio para compras em supermercados")
        String descricao,

        @Schema(description = "CNPJ alfanumérico do titular/fornecedor (14 posições; persistido sem máscara em caixa alta)", example = "12ABC34501DE35")
        String cnpj,
        
        @Schema(description = "Valor monetário do benefício", example = "850.00")
        BigDecimal valor,
        
        @Schema(description = "Status do benefício (ativo/inativo)", example = "true")
        Boolean ativo,
        
        @Schema(description = "Usuário que criou o registro", example = "admin")
        String createdBy,

        @Schema(description = "Data e hora da criação", example = "2026-05-11T10:00:00")
        LocalDateTime createdAt,

        @Schema(description = "Usuário que atualizou o registro pela última vez", example = "admin")
        String updatedBy,

        @Schema(description = "Data e hora da última atualização", example = "2026-05-11T10:30:00")
        LocalDateTime updatedAt,

        @Schema(description = "Versão do registro para controle de concorrência otimista", example = "0")
        Long version
) {
}
