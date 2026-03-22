import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let summary = 'Erro';
      let detail = 'Ocorreu um erro inesperado';

      if (error.status === 0) {
        detail = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      } else if (error.error?.message) {
        detail = error.error.message;
        
        if (error.status === 400) {
          summary = 'Dados inválidos';
        } else if (error.status === 404) {
          summary = 'Não encontrado';
        } else if (error.status === 409) {
          summary = 'Conflito';
        } else if (error.status === 500) {
          summary = 'Erro no servidor';
          detail = 'Ocorreu um erro interno. Tente novamente mais tarde.';
        }
      }

      messageService.add({
        severity: 'error',
        summary,
        detail,
        life: 5000
      });

      console.error('HTTP Error:', error);

      return throwError(() => error);
    })
  );
};
