package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Schema(description = "Objeto de requisição para criação e atualização de Benefícios")
public record BeneficioRequest(
        @Schema(description = "Nome do benefício", example = "Vale Alimentação")
        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 3, max = 100, message = "Nome deve ter entre 3 e 100 caracteres")
        String nome,

        @Schema(description = "Descrição detalhada do benefício", example = "Auxílio para compras em supermercados")
        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String descricao,

        @Schema(description = "Valor monetário do benefício", example = "850.00")
        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.01", inclusive = true, message = "Valor deve ser maior que zero")
        BigDecimal valor,

        @Schema(description = "Status do benefício (ativo/inativo)", example = "true")
        @NotNull(message = "Ativo é obrigatório")
        Boolean ativo
) {
}
