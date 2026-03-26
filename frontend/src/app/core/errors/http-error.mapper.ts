import { HttpErrorResponse } from '@angular/common/http';

import { CONNECTION_ERROR_MESSAGE, GENERIC_ERROR_MESSAGE, SERVER_ERROR_MESSAGE } from './error-messages';

export interface MappedHttpError {
  summary: string;
  detail: string;
  isConnectionError: boolean;
}

export function mapHttpError(
  error: HttpErrorResponse,
  fallbackMessage = GENERIC_ERROR_MESSAGE
): MappedHttpError {
  if (error.status === 0) {
    return {
      summary: 'Sem conexão',
      detail: CONNECTION_ERROR_MESSAGE,
      isConnectionError: true
    };
  }

  const detail = typeof error.error?.message === 'string' ? error.error.message : fallbackMessage;

  if (error.status === 400) {
    return { summary: 'Dados inválidos', detail, isConnectionError: false };
  }

  if (error.status === 404) {
    return { summary: 'Não encontrado', detail, isConnectionError: false };
  }

  if (error.status === 409) {
    return { summary: 'Conflito', detail, isConnectionError: false };
  }

  if (error.status >= 500) {
    return {
      summary: 'Erro no servidor',
      detail: SERVER_ERROR_MESSAGE,
      isConnectionError: false
    };
  }

  return {
    summary: 'Erro',
    detail,
    isConnectionError: false
  };
}
