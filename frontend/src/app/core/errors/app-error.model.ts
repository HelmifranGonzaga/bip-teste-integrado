/**
 * Erro padrão da aplicação, espelhando a estrutura do backend.
 * Garante consistência entre frontend e backend.
 */
export interface AppError {
  /** Código do erro para identificação (ex: CONFLICT, NOT_FOUND, VALIDATION_ERROR) */
  code: string;
  /** Mensagem legível do erro */
  message: string;
  /** Timestamp ISO da ocorrência do erro */
  timestamp: string;
  /** ID de correlação para rastreamento */
  correlationId: string;
}

/**
 * Erro mapeado para exibição na UI
 */
export interface DisplayError {
  /** Título/resumo do erro */
  summary: string;
  /** Detalhe do erro */
  detail: string;
  /** Código do erro */
  code: string;
  /** ID de correlação para suporte */
  correlationId?: string;
  /** Indica se é erro de conexão */
  isConnectionError: boolean;
  /** Status HTTP */
  httpStatus: number;
}

/**
 * Tipo de erro
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  CONNECTION = 'CONNECTION_ERROR',
  SERVER = 'INTERNAL_ERROR',
  GENERIC = 'GENERIC_ERROR'
}

/**
 * Mapeia código de erro para tipo
 */
export function getErrorType(code: string): ErrorType {
  const errorMap: Record<string, ErrorType> = {
    'VALIDATION_ERROR': ErrorType.VALIDATION,
    'NOT_FOUND': ErrorType.NOT_FOUND,
    'CONFLICT': ErrorType.CONFLICT,
    'UNAUTHORIZED': ErrorType.UNAUTHORIZED,
    'FORBIDDEN': ErrorType.FORBIDDEN,
    'INTERNAL_ERROR': ErrorType.SERVER
  };
  return errorMap[code] || ErrorType.GENERIC;
}

/**
 * Verifica se a resposta é um AppError do backend
 */
export function isAppError(value: any): value is AppError {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.code === 'string' &&
    typeof value.message === 'string' &&
    typeof value.timestamp === 'string' &&
    typeof value.correlationId === 'string'
  );
}
