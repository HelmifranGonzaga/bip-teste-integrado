package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Schema(description = "Objeto de resposta contendo os dados do Benefício")
public record BeneficioResponse(
        @Schema(description = "Identificador único do benefício", example = "1")
        Long id,
        
        @Schema(description = "Nome do benefício", example = "Vale Alimentação")
        String nome,
        
        @Schema(description = "Descrição detalhada do benefício", example = "Auxílio para compras em supermercados")
        String descricao,
        
        @Schema(description = "Valor monetário do benefício", example = "850.00")
        BigDecimal valor,
        
        @Schema(description = "Status do benefício (ativo/inativo)", example = "true")
        Boolean ativo,
        
        @Schema(description = "Versão do registro para controle de concorrência otimista", example = "0")
        Long version
) {
}
