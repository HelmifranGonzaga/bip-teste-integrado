import { HttpErrorResponse } from '@angular/common/http';

import {
  CONNECTION_ERROR_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE
} from './error-messages';
import { AppError, DisplayError, isAppError } from './app-error.model';

/**
 * Mapeia erros HTTP para exibição na UI
 * Extrai informações do erro do backend quando disponível
 */
export function mapHttpError(
  error: HttpErrorResponse,
  fallbackMessage = GENERIC_ERROR_MESSAGE
): DisplayError {
  // Verifica se é erro de conexão
  if (error.status === 0) {
    return {
      summary: 'Sem conexão',
      detail: CONNECTION_ERROR_MESSAGE,
      code: 'CONNECTION_ERROR',
      isConnectionError: true,
      httpStatus: 0
    };
  }

  // Para erros 500+, sempre retorna mensagem genérica de servidor
  if (error.status >= 500) {
    return {
      summary: 'Erro no servidor',
      detail: SERVER_ERROR_MESSAGE,
      code: 'INTERNAL_ERROR',
      correlationId: isAppError(error.error) ? (error.error as AppError).correlationId : undefined,
      isConnectionError: false,
      httpStatus: error.status
    };
  }

  // Extrai AppError do backend se disponível
  if (isAppError(error.error)) {
    const appError = error.error as AppError;
    return {
      summary: getSummaryForErrorCode(appError.code),
      detail: appError.message,
      code: appError.code,
      correlationId: appError.correlationId,
      isConnectionError: false,
      httpStatus: error.status
    };
  }

  // Fallback para mapeamento por status HTTP
  const detail = typeof error.error?.message === 'string'
    ? error.error.message
    : fallbackMessage;

  return {
    summary: getSummaryForStatus(error.status),
    detail,
    code: getCodeForStatus(error.status),
    isConnectionError: false,
    httpStatus: error.status
  };
}

/**
 * Retorna um resumo legível baseado no código de erro
 */
function getSummaryForErrorCode(code: string): string {
  const summaryMap: Record<string, string> = {
    'VALIDATION_ERROR': 'Dados inválidos',
    'NOT_FOUND': 'Não encontrado',
    'CONFLICT': 'Conflito',
    'UNAUTHORIZED': 'Não autenticado',
    'FORBIDDEN': 'Acesso negado',
    'INTERNAL_ERROR': 'Erro no servidor',
    'CONNECTION_ERROR': 'Sem conexão'
  };
  return summaryMap[code] || 'Erro';
}

/**
 * Retorna um resumo legível baseado no status HTTP
 */
function getSummaryForStatus(status: number): string {
  if (status === 400) return 'Dados inválidos';
  if (status === 401) return 'Não autenticado';
  if (status === 403) return 'Acesso negado';
  if (status === 404) return 'Não encontrado';
  if (status === 409) return 'Conflito';
  return 'Erro';
}

/**
 * Retorna código de erro baseado no status HTTP
 */
function getCodeForStatus(status: number): string {
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  return 'GENERIC_ERROR';
}

/**
 * Interface legada - mantida para compatibilidade
 * @deprecated Use DisplayError ao invés
 */
export interface MappedHttpError {
  summary: string;
  detail: string;
  isConnectionError: boolean;
}


