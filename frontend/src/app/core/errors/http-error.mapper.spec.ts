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
});
