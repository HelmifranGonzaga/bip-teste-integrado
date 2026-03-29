# Padrão de Erro Padronizado - Desafio BIP

## Visão Geral

O projeto implementa um padrão de erro consistente entre backend e frontend, garantindo que:
- Erros são estruturados de forma previsível
- Informações de rastreamento (correlationId) são mantidas
- Mensagens de erro são legíveis e apropriadas para o usuário
- Não há exposição de stacktraces ou informações sensíveis ao cliente

## Estrutura do Erro

### Backend - `ApiErrorResponse`

```java
{
  "code": "CONFLICT",
  "message": "Saldo insuficiente para transferência",
  "timestamp": "2026-03-29T01:25:09.223182463Z",
  "correlationId": "7b1c4209-1d40-4624-8c11-2046766ebd82"
}
```

**Campos:**
- `code`: Código de erro padronizado (ex: CONFLICT, NOT_FOUND, VALIDATION_ERROR)
- `message`: Mensagem legível do erro em português
- `timestamp`: Data/hora ISO da ocorrência
- `correlationId`: ID único para rastreabilidade (MDC)

### Frontend - `AppError` (Espelha Backend)

```typescript
interface AppError {
  code: string;        // código padronizado
  message: string;     // mensagem legível
  timestamp: string;   // ISO string
  correlationId: string; // rastreamento
}
```

### Frontend - `DisplayError` (Para Exibição)

```typescript
interface DisplayError {
  summary: string;           // Título (ex: "Conflito")
  detail: string;            // Detalhe do erro
  code: string;              // Código do erro
  correlationId?: string;    // Para suporte
  isConnectionError: boolean; // Tipo de erro
  httpStatus: number;        // Status HTTP
}
```

## Códigos de Erro Padronizados

| Código | HTTP | Descrição | Exemplo |
|--------|------|-----------|---------|
| `BAD_REQUEST` | 400 | Requisição inválida | Payload mal formatado |
| `VALIDATION_ERROR` | 400 | Erro de validação | Campo obrigatório |
| `UNAUTHORIZED` | 401 | Não autenticado | Token inválido |
| `FORBIDDEN` | 403 | Acesso negado | Sem permissão |
| `NOT_FOUND` | 404 | Recurso não encontrado | Benefício inexistente |
| `CONFLICT` | 409 | Conflito | Saldo insuficiente |
| `INTERNAL_ERROR` | 500+ | Erro no servidor | Exceção não tratada |
| `CONNECTION_ERROR` | 0 | Erro de conexão | Servidor indisponível |

---

## Fluxo de Erro - Backend

```
Exception gerada
    ↓
ApiExceptionHandler (RestControllerAdvice)
    ↓
Extrai correlationId do MDC
    ↓
Mapeia para ApiErrorResponse com código padronizado
    ↓
Retorna ResponseEntity com status HTTP apropriado
```

**Exemplo - Erro de Domínio:**
```java
throw new InsufficientBalanceException("Saldo insuficiente para transferência");
// ResultadoApiErrorResponse com code=CONFLICT, status=409
```

---

## Fluxo de Erro - Frontend

```
HTTP Request
    ↓
ErrorInterceptor captura
    ↓
mapHttpError() converte para DisplayError
    ↓
ErrorService exibe Toast com mensagem amigável
    ↓
Erro normalizado é retornado como AppError
    ↓
Componente recebe erro estruturado
```

### Exemplo de Uso em Componente:

```typescript
this.beneficioService.transfer(transfer).subscribe({
  next: (result) => {
    this.errorService.showSuccess('Transferência realizada');
  },
  error: (error: AppError) => {
    // error já está normalizado e estruturado
    console.error('Transfer failed:', error.code, error.message);
    const supportMsg = this.errorService.formatSupportMessage(error);
    this.errorService.showError(error);
  }
});
```

---

## Benefícios do Padrão

### ✅ Consistência
- Mesma estrutura em todo o stack
- Códigos de erro centralizados e reutilizáveis

### ✅ Rastreabilidade
- `correlationId` persiste através de toda requisição
- MDC (Mapped Diagnostic Context) no backend
- Facilita debugging e suporte

### ✅ Segurança
- Stacktraces nunca são expostos ao cliente
- Erros 5xx retornam apenas mensagem genérica
- Detalhes técnicos ficam apenas nos logs

### ✅ UX
- Mensagens em português, legíveis e aplicadas
- Interface uniforme para exibição de erros
- Suporte para diferentes tipos de avisos (toast, sticky, etc)

### ✅ Manutenção
- `ErrorCode` centralizado no backend
- `ErrorType` enum no frontend
- Fácil adicionar novos códigos de erro

---

## Arquivos Chave

### Backend
- `adapter/inbound/web/exception/ApiErrorResponse.java` - Estrutura de erro
- `adapter/inbound/web/exception/ErrorCode.java` - Códigos padronizados
- `adapter/inbound/web/exception/ApiExceptionHandler.java` - Tratamento centrali

ado

### Frontend
- `core/errors/app-error.model.ts` - Interfaces e tipos de erro
- `core/errors/http-error.mapper.ts` - Mapeamento de HTTP para DisplayError
- `core/services/error.service.ts` - Serviço centralizado de erros
- `core/interceptors/error.interceptor.ts` - Interceptor que normaliza erros

---

## Exemplo Completo

### Backend - Lançar Erro
```java
@Service
public class BeneficioTransferService {
  @Transactional
  public TransferResult transfer(TransferRequest request) {
    Beneficio from = beneficioRepository.findById(request.getFromId())
      .orElseThrow(() -> new BeneficioNotFoundException("Benefício de origem não encontrado"));

    if (from.getSaldo() < request.getAmount()) {
      throw new InsufficientBalanceException("Saldo insuficiente para transferência");
    }
    // ... transferência
  }
}
```

### Backend - Handler Captura
```java
@ExceptionHandler(InsufficientBalanceException.class)
public ResponseEntity<ApiErrorResponse> handleInsufficientBalance(InsufficientBalanceException ex) {
  return buildError(HttpStatus.CONFLICT, ErrorCode.CONFLICT, ex.getMessage());
}
// Resultado: { "code": "CONFLICT", "message": "...", "timestamp": "...", "correlationId": "..." }
```

### Frontend - Interceptor Normaliza
```typescript
catchError((error: HttpErrorResponse) => {
  const displayError = mapHttpError(error);
  // { summary: "Conflito", detail: "Saldo insuficiente...", code: "CONFLICT", ... }

  messageService.add({
    severity: 'error',
    summary: displayError.summary,
    detail: displayError.detail
  });

  return throwError(() => error.error as AppError);
});
```

### Frontend - Componente Usa
```typescript
this.beneficioService.transfer(transfer).subscribe({
  error: (error: AppError) => {
    // error = { code: "CONFLICT", message: "Saldo insuficiente...", correlationId: "..." }
    this.showUserFriendlyError(error);
  }
});
```

---

## Testes

- ✅ `http-error.mapper.spec.ts` - Mapeia erros HTTP corretamente
- ✅ `error.service.spec.ts` - Serviço trata todos os tipos de erro
- ✅ 84+ testes frontend passando
- ✅ Backend compila sem erros

---

## Próximos Passos

1. ✅ Padronizar erro em ambos os lados
2. ✅ Criar ErrorService centralizado
3. ✅ Adicionar correlationId para rastreamento
4. ⬜ Implementar retry logic para erros temporários
5. ⬜ Adicionar logging estruturado de erros
6. ⬜ Criar página de erro 500 amigável
