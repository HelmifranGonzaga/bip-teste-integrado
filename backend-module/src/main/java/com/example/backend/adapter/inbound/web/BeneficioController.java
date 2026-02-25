package com.example.backend.adapter.inbound.web;

import com.example.backend.adapter.inbound.web.dto.BeneficioRequest;
import com.example.backend.adapter.inbound.web.dto.BeneficioResponse;
import com.example.backend.adapter.inbound.web.dto.TransferRequest;
import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/beneficios")
@Tag(name = "Benefícios", description = "API para gerenciamento de benefícios corporativos e transferências de saldo")
public class BeneficioController {

    private final BeneficioUseCase useCase;

    public BeneficioController(BeneficioUseCase useCase) {
        this.useCase = useCase;
    }

    @Operation(summary = "Listar todos os benefícios", description = "Retorna uma lista com todos os benefícios cadastrados no sistema.")
    @ApiResponse(responseCode = "200", description = "Lista de benefícios retornada com sucesso")
    @GetMapping
    public List<BeneficioResponse> list() {
        return useCase.listAll().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Buscar benefício por ID", description = "Retorna os detalhes de um benefício específico baseado no seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Benefício encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    })
    @GetMapping("/{id}")
    public BeneficioResponse getById(
            @Parameter(description = "ID do benefício a ser buscado", example = "1") @PathVariable Long id) {
        return toResponse(useCase.getById(id));
    }

    @Operation(summary = "Criar novo benefício", description = "Cadastra um novo benefício no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Benefício criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de requisição inválidos")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeneficioResponse create(@Valid @RequestBody BeneficioRequest request) {
        return toResponse(useCase.create(toDomain(request)));
    }

    @Operation(summary = "Atualizar benefício", description = "Atualiza os dados de um benefício existente.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Benefício atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de requisição inválidos"),
            @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    })
    @PutMapping("/{id}")
    public BeneficioResponse update(
            @Parameter(description = "ID do benefício a ser atualizado", example = "1") @PathVariable Long id, 
            @Valid @RequestBody BeneficioRequest request) {
        return toResponse(useCase.update(id, toDomain(request)));
    }

    @Operation(summary = "Excluir benefício", description = "Remove um benefício do sistema pelo seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Benefício excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @Parameter(description = "ID do benefício a ser excluído", example = "1") @PathVariable Long id) {
        useCase.delete(id);
    }

    @Operation(summary = "Transferir saldo", description = "Realiza a transferência de saldo entre dois benefícios diferentes.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Transferência realizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Saldo insuficiente ou dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Benefício de origem ou destino não encontrado")
    })
    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void transfer(@Valid @RequestBody TransferRequest request) {
        useCase.transfer(request.fromId(), request.toId(), request.amount());
    }

    private Beneficio toDomain(BeneficioRequest request) {
        Beneficio beneficio = new Beneficio();
        beneficio.setNome(request.nome());
        beneficio.setDescricao(request.descricao());
        beneficio.setValor(request.valor());
        beneficio.setAtivo(request.ativo());
        return beneficio;
    }

    private BeneficioResponse toResponse(Beneficio beneficio) {
        return new BeneficioResponse(
                beneficio.getId(),
                beneficio.getNome(),
                beneficio.getDescricao(),
                beneficio.getValor(),
                beneficio.getAtivo(),
                beneficio.getVersion()
        );
    }
}
