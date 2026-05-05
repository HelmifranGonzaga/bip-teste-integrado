import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  AppError,
  DisplayError,
  ErrorType,
  getErrorType,
  isAppError
} from '../errors/app-error.model';
import { mapHttpError } from '../errors/http-error.mapper';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Serviço centralizado para tratamento e exibição de erros
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private readonly messageService = inject(MessageService);

  /**
   * Processa e exibe um erro normalizado
   */
  showError(error: AppError | HttpErrorResponse | DisplayError, showToast = true): DisplayError {
    let displayError: DisplayError;

    if (isAppError(error)) {
      // Já é AppError, apenas converte para DisplayError
      displayError = {
        summary: this.getSummaryForCode((error as AppError).code),
        detail: (error as AppError).message,
        code: (error as AppError).code,
        correlationId: (error as AppError).correlationId,
        isConnectionError: false,
        httpStatus: 0
      };
    } else if (error instanceof HttpErrorResponse) {
      // Mapeia HttpErrorResponse
      displayError = mapHttpError(error);
    } else {
      // Já é DisplayError
      displayError = error as DisplayError;
    }

    if (showToast) {
      this.showToast(displayError);
    }

    return displayError;
  }

  /**
   * Exibe um toast com informações do erro
   */
  showToast(error: DisplayError): void {
    this.messageService.add({
      severity: 'error',
      summary: error.summary,
      detail: error.detail,
      life: 5000,
      sticky: this.shouldStickError(error.code)
    });
  }

  /**
   * Exibe um toast de sucesso
   */
  showSuccess(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary: message,
      detail,
      life: 3000
    });
  }

  /**
   * Exibe um toast de aviso
   */
  showWarning(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: message,
      detail,
      life: 4000
    });
  }

  /**
   * Exibe um toast de informação
   */
  showInfo(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary: message,
      detail,
      life: 3000
    });
  }

  /**
   * Extrai correlationId de um erro para suporte
   */
  getCorrelationId(error: AppError | DisplayError | HttpErrorResponse): string | undefined {
    if (isAppError(error)) {
      return (error as AppError).correlationId;
    } else if (error instanceof HttpErrorResponse && isAppError(error.error)) {
      return (error.error as AppError).correlationId;
    } else if ('correlationId' in error) {
      return (error as DisplayError).correlationId;
    }
    return undefined;
  }

  /**
   * Formata uma mensagem de suporte com correlationId
   */
  formatSupportMessage(error: AppError | DisplayError | HttpErrorResponse): string {
    const correlationId = this.getCorrelationId(error);
    if (correlationId) {
      return `Erro de correlação: ${correlationId}. Envie este código ao suporte.`;
    }
    return 'Entre em contato com o suporte se o problema persistir.';
  }

  /**
   * Valida se um erro é crítico (deve exibir alerta)
   */
  isCriticalError(error: AppError | DisplayError): boolean {
    const errorType = getErrorType('code' in error ? error.code : 'GENERIC_ERROR');
    return [ErrorType.SERVER, ErrorType.UNAUTHORIZED, ErrorType.FORBIDDEN].includes(errorType);
  }

  /**
   * Indica se o erro deve permanecer visível (sticky)
   */
  private shouldStickError(code: string): boolean {
    const stickyErrors = ['UNAUTHORIZED', 'FORBIDDEN', 'INTERNAL_ERROR', 'CONNECTION_ERROR'];
    return stickyErrors.includes(code);
  }

  /**
   * Retorna um resumo legível baseado no código de erro
   */
  private getSummaryForCode(code: string): string {
    const summaryMap: Record<string, string> = {
      VALIDATION_ERROR: 'Dados inválidos',
      NOT_FOUND: 'Não encontrado',
      CONFLICT: 'Conflito',
      UNAUTHORIZED: 'Não autenticado',
      FORBIDDEN: 'Acesso negado',
      INTERNAL_ERROR: 'Erro no servidor',
      CONNECTION_ERROR: 'Sem conexão'
    };
    return summaryMap[code] || 'Erro';
  }
}
