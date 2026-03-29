import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { mapHttpError } from '../errors/http-error.mapper';
import { AppError, DisplayError, isAppError } from '../errors/app-error.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const displayError = mapHttpError(error);

      // Não mostrar erro para requisições de arquivos estáticos ou config
      const isStaticAsset = req.url.includes('/assets/') || req.url.includes('/config');

      if (!displayError.isConnectionError && !isStaticAsset) {
        messageService.add({
          severity: 'error',
          summary: displayError.summary,
          detail: displayError.detail,
          life: 5000
        });
      }

      if (!environment.production) {
        console.error('HTTP Error:', {
          status: displayError.httpStatus,
          code: displayError.code,
          message: displayError.detail,
          correlationId: displayError.correlationId,
          originalError: error
        });
      }

      // Retorna erro normalizado (apenas AppError ou DisplayError)
      const normalizedError = isAppError(error.error)
        ? error.error as AppError
        : createErrorFromDisplay(displayError);

      return throwError(() => normalizedError);
    })
  );
};

/**
 * Cria um AppError a partir de DisplayError
 */
function createErrorFromDisplay(displayError: DisplayError): AppError {
  return {
    code: displayError.code,
    message: displayError.detail,
    timestamp: new Date().toISOString(),
    correlationId: displayError.correlationId || 'unknown'
  };
}

