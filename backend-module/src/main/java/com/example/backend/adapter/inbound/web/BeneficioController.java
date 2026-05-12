package com.example.backend.adapter.inbound.web;

import com.example.backend.adapter.inbound.web.dto.BeneficioRequest;
import com.example.backend.adapter.inbound.web.dto.BeneficioResponse;
import com.example.backend.adapter.inbound.web.dto.TransferRequest;
import com.example.backend.adapter.inbound.web.mapper.BeneficioMapper;
import com.example.backend.domain.idempotency.IdempotencyStore;
import com.example.backend.domain.model.Beneficio;
import com.example.backend.domain.port.inbound.BeneficioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/beneficios")
@Tag(name = "Benefícios", description = "API para gerenciamento de benefícios corporativos e transferências de saldo")
public class BeneficioController {

    private final BeneficioUseCase useCase;
    private final BeneficioMapper mapper;
    private final IdempotencyStore idempotencyStore;

    public BeneficioController(BeneficioUseCase useCase, BeneficioMapper mapper, IdempotencyStore idempotencyStore) {
        this.useCase = useCase;
        this.mapper = mapper;
        this.idempotencyStore = idempotencyStore;
    }

    @Operation(summary = "Listar benefícios", description = "Retorna benefícios com paginação opcional. Padrão: todos os registros.")
    @ApiResponse(responseCode = "200", description = "Lista de benefícios retornada com sucesso")
    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        if (size == 2147483647) {
            List<BeneficioResponse> beneficios = useCase.listAll().stream().map(mapper::toResponse).toList();
            return ResponseEntity.ok(beneficios);
        }
        Page<BeneficioResponse> beneficioPage = useCase
                .listPaginated(PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "id")))
                .map(mapper::toResponse);
        return ResponseEntity.ok(beneficioPage);
    }

    @Operation(summary = "Buscar benefício por ID", description = "Retorna os detalhes de um benefício específico baseado no seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Benefício encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Benefício não encontrado")
    })
    @GetMapping("/{id}")
    public BeneficioResponse getById(
            @Parameter(description = "ID do benefício a ser buscado", example = "1") @PathVariable Long id) {
        Beneficio beneficio = useCase.getById(id);
        return mapper.toResponse(beneficio);
    }

    @Operation(summary = "Criar novo benefício", description = "Cadastra um novo benefício no sistema.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Benefício criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados de requisição inválidos")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BeneficioResponse create(@Valid @RequestBody BeneficioRequest request) {
        Beneficio beneficio = mapper.toDomain(request);
        Beneficio saved = useCase.create(beneficio);
        return mapper.toResponse(saved);
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
        Beneficio beneficio = mapper.toDomain(request);
        Beneficio updated = useCase.update(id, beneficio);
        return mapper.toResponse(updated);
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

    @Operation(summary = "Transferir saldo", description = "Realiza a transferência de saldo entre dois benefícios diferentes. Aceita header Idempotency-Key para evitar processamento duplicado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Transferência realizada com sucesso (com Idempotency-Key)"),
            @ApiResponse(responseCode = "204", description = "Transferência realizada com sucesso (sem Idempotency-Key)"),
            @ApiResponse(responseCode = "200", description = "Requisição idempotente já processada anteriormente"),
            @ApiResponse(responseCode = "400", description = "Saldo insuficiente ou dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Benefício de origem ou destino não encontrado")
    })
    @PostMapping("/transfer")
    public ResponseEntity<Void> transfer(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody TransferRequest request) {

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            if (idempotencyStore.exists(idempotencyKey)) {
                return ResponseEntity.status(HttpStatus.OK).build();
            }
            useCase.transfer(request.fromId(), request.toId(), request.amount());
            idempotencyStore.store(idempotencyKey, null);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }

        useCase.transfer(request.fromId(), request.toId(), request.amount());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
