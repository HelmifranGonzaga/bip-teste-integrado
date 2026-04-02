import { HttpErrorResponse } from '@angular/common/http';

import {
  CONNECTION_ERROR_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  SERVER_ERROR_MESSAGE
} from './error-messages';
import { DisplayError, isAppError } from './app-error.model';

const ERROR_CODE_TO_SUMMARY: Record<string, string> = {
  VALIDATION_ERROR: 'Dados inválidos',
  NOT_FOUND: 'Não encontrado',
  CONFLICT: 'Conflito',
  UNAUTHORIZED: 'Não autenticado',
  FORBIDDEN: 'Acesso negado',
  INTERNAL_ERROR: 'Erro no servidor',
  CONNECTION_ERROR: 'Sem conexão'
};

const STATUS_TO_METADATA: Record<number, { summary: string; code: string }> = {
  400: { summary: 'Dados inválidos', code: 'BAD_REQUEST' },
  401: { summary: 'Não autenticado', code: 'UNAUTHORIZED' },
  403: { summary: 'Acesso negado', code: 'FORBIDDEN' },
  404: { summary: 'Não encontrado', code: 'NOT_FOUND' },
  409: { summary: 'Conflito', code: 'CONFLICT' }
};

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
      correlationId: isAppError(error.error) ? error.error.correlationId : undefined,
      isConnectionError: false,
      httpStatus: error.status
    };
  }

  // Extrai AppError do backend se disponível
  if (isAppError(error.error)) {
    const appError = error.error;
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
  const detail = getDetailFromHttpError(error, fallbackMessage);
  const metadata = STATUS_TO_METADATA[error.status] ?? {
    summary: 'Erro',
    code: 'GENERIC_ERROR'
  };

  return {
    summary: metadata.summary,
    detail,
    code: metadata.code,
    isConnectionError: false,
    httpStatus: error.status
  };
}

/**
 * Retorna um resumo legível baseado no código de erro
 */
function getSummaryForErrorCode(code: string): string {
  return ERROR_CODE_TO_SUMMARY[code] || 'Erro';
}

function getDetailFromHttpError(error: HttpErrorResponse, fallbackMessage: string): string {
  return typeof error.error?.message === 'string' ? error.error.message : fallbackMessage;
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


