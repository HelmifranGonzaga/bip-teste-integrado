package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(description = "Objeto de requisição para criação e atualização de Benefícios")
public record BeneficioRequest(
        @Schema(description = "Nome do benefício", example = "Vale Alimentação")
        @NotBlank(message = "Nome é obrigatório")
        String nome,
        
        @Schema(description = "Descrição detalhada do benefício", example = "Auxílio para compras em supermercados")
        String descricao,
        
        @Schema(description = "Valor monetário do benefício", example = "850.00")
        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.00", inclusive = true, message = "Valor deve ser positivo")
        BigDecimal valor,
        
        @Schema(description = "Status do benefício (ativo/inativo)", example = "true")
        @NotNull(message = "Ativo é obrigatório")
        Boolean ativo
) {
}
