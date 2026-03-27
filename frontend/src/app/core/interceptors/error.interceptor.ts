import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { mapHttpError } from '../errors/http-error.mapper';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const mappedError = mapHttpError(error);

      if (!mappedError.isConnectionError) {
        messageService.add({
          severity: 'error',
          summary: mappedError.summary,
          detail: mappedError.detail,
          life: 5000
        });
      }

      if (!environment.production) {
        console.error('HTTP Error:', error);
      }

      return throwError(() => error);
    })
  );
};
