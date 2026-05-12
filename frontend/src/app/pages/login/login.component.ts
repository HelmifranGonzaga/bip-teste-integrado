import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';

interface LoginModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormField,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly messageService = inject(MessageService);

  private readonly rememberedUsername = sessionStorage.getItem('remembered_username');

  readonly loginModel = signal<LoginModel>({
    username: '',
    password: ''
  });

  readonly loginForm = form(this.loginModel, (s) => {
    required(s.username, { message: 'Usuário é obrigatório' });
    required(s.password, { message: 'Senha é obrigatória' });
  });

  readonly loading = signal(false);
  rememberMe = signal(false);

  isFieldInvalid(fieldName: keyof LoginModel): boolean {
    const field = fieldName === 'username' ? this.loginForm.username : this.loginForm.password;
    return field().touched() && field().errors().length > 0;
  }

  showForgotPasswordHelp(event: Event): void {
    event.preventDefault();
    this.messageService.add({
      severity: 'info',
      summary: 'Recuperação de Senha',
      detail: 'Em ambiente de demo, use qualquer credencial. Em produção, contacte o suporte.',
      life: 5000,
      sticky: true
    });
  }

  onRememberMeChange(event: { checked: boolean }): void {
    this.rememberMe.set(event.checked);
    if (event.checked) {
      sessionStorage.setItem('remembered_username', this.loginModel().username);
    } else {
      sessionStorage.removeItem('remembered_username');
    }
  }

  onLogin(): void {
    submit(this.loginForm, async () => {
      const { username, password } = this.loginModel();

      if (this.rememberMe()) {
        sessionStorage.setItem('remembered_username', username);
      }

      this.loading.set(true);

      try {
        await new Promise<void>((resolve, reject) => {
          this.authService.login(username, password).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Login bem-sucedido',
                detail: 'Bem-vindo! Você está sendo redirecionado...',
                life: 2000
              });
              resolve();
            },
            error: (error) => {
              reject(error);
            }
          });
        });

        this.loading.set(false);
        await this.nextFrame();
        this.navigateToRedirectUrl(this.getRedirectUrl());
      } catch (error) {
        this.loading.set(false);
        const errorMessage = this.getErrorMessage(error);
        this.messageService.add({
          severity: 'error',
          summary: errorMessage.summary,
          detail: errorMessage.detail,
          life: 5000
        });
      }
    });
  }

  private getErrorMessage(error: unknown): { summary: string; detail: string } {
    const err = error as { status?: number; code?: string; message?: string };
    if (err?.status === 0) {
      return {
        summary: 'Servidor indisponível',
        detail: 'Não foi possível conectar ao servidor. Verifique se ele está ativo.'
      };
    }

    if (err?.status === 401 || err?.code === 'UNAUTHORIZED') {
      return {
        summary: 'Erro na autenticação',
        detail: 'Verifique suas credenciais e tente novamente.'
      };
    }

    if (err?.status && err.status >= 500) {
      return {
        summary: 'Erro no servidor',
        detail: 'O servidor encontrou um erro. Tente novamente mais tarde.'
      };
    }

    return {
      summary: 'Erro na autenticação',
      detail: err?.message || 'Erro desconhecido. Tente novamente.'
    };
  }

  private getRedirectUrl(): string {
    const returnUrl = this.route?.snapshot.queryParamMap.get('returnUrl');

    if (returnUrl?.startsWith('/')) {
      return returnUrl;
    }

    return '/beneficios';
  }

  private navigateToRedirectUrl(redirectUrl: string): void {
    if (redirectUrl.includes('?')) {
      void this.router.navigateByUrl(redirectUrl);
      return;
    }

    void this.router.navigate([redirectUrl]);
  }

  private nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
}
