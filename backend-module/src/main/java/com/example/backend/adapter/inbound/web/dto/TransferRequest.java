package com.example.backend.adapter.inbound.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Schema(description = "Objeto de requisição para transferência de saldo entre benefícios")
public record TransferRequest(
        @Schema(description = "ID do benefício de origem (de onde o valor será retirado)", example = "1")
        @NotNull(message = "ID de origem é obrigatório")
        Long fromId,
        
        @Schema(description = "ID do benefício de destino (para onde o valor será enviado)", example = "2")
        @NotNull(message = "ID de destino é obrigatório")
        Long toId,
        
        @Schema(description = "Valor a ser transferido", example = "150.00")
        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.01", inclusive = true, message = "Valor deve ser maior que zero")
        BigDecimal amount
) {
}
