import { HttpErrorResponse } from '@angular/common/http';
import { CONNECTION_ERROR_MESSAGE, SERVER_ERROR_MESSAGE } from './error-messages';
import { mapHttpError } from './http-error.mapper';

describe('mapHttpError', () => {
  it('deve mapear erro de conexão', () => {
    const error = new HttpErrorResponse({ status: 0 });

    const mapped = mapHttpError(error);

    expect(mapped.isConnectionError).toBe(true);
    expect(mapped.summary).toBe('Sem conexão');
    expect(mapped.detail).toBe(CONNECTION_ERROR_MESSAGE);
  });

  it('deve mapear erro 400 com mensagem de API', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { message: 'Payload inválido' }
    });

    const mapped = mapHttpError(error);

    expect(mapped.isConnectionError).toBe(false);
    expect(mapped.summary).toBe('Dados inválidos');
    expect(mapped.detail).toBe('Payload inválido');
  });

  it('deve mapear erro 500 com mensagem genérica de servidor', () => {
    const error = new HttpErrorResponse({
      status: 500,
      error: { message: 'Stacktrace interno' }
    });

    const mapped = mapHttpError(error);

    expect(mapped.summary).toBe('Erro no servidor');
    expect(mapped.detail).toBe(SERVER_ERROR_MESSAGE);
  });

  it('deve preservar correlationId quando erro 5xx vier no formato AppError', () => {
    const error = new HttpErrorResponse({
      status: 503,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Falha interna',
        timestamp: '2026-04-02T10:00:00Z',
        correlationId: 'corr-123'
      }
    });

    const mapped = mapHttpError(error);

    expect(mapped.summary).toBe('Erro no servidor');
    expect(mapped.detail).toBe(SERVER_ERROR_MESSAGE);
    expect(mapped.code).toBe('INTERNAL_ERROR');
    expect(mapped.correlationId).toBe('corr-123');
    expect(mapped.httpStatus).toBe(503);
  });

  it('deve usar fallback customizado quando nao houver mensagem util no payload', () => {
    const error = new HttpErrorResponse({
      status: 404,
      error: {}
    });

    const mapped = mapHttpError(error, 'Mensagem de fallback customizada');

    expect(mapped.summary).toBe('Não encontrado');
    expect(mapped.detail).toBe('Mensagem de fallback customizada');
    expect(mapped.code).toBe('NOT_FOUND');
    expect(mapped.isConnectionError).toBe(false);
  });

  it('deve mapear status conhecido para resumo e codigo padrao', () => {
    const error = new HttpErrorResponse({
      status: 401,
      error: {}
    });

    const mapped = mapHttpError(error);

    expect(mapped.summary).toBe('Não autenticado');
    expect(mapped.code).toBe('UNAUTHORIZED');
    expect(mapped.httpStatus).toBe(401);
  });
});
