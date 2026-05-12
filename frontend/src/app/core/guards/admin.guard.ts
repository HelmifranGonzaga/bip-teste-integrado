import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  if (authService.getAuthUser()?.role !== 'ADMIN') {
    messageService.add({
      severity: 'warn',
      summary: 'Acesso negado',
      detail: 'Apenas administradores podem acessar o menu de usuários.',
      life: 4000
    });
    return router.createUrlTree(['/beneficios']);
  }

  return true;
};
