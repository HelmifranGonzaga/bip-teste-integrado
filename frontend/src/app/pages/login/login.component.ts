import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    DividerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly messageService = inject(MessageService);
  private readonly rememberedUsername = sessionStorage.getItem('remembered_username');

  readonly loginForm = this.fb.nonNullable.group({
    username: [this.rememberedUsername ?? '', Validators.required],
    password: ['', Validators.required]
  });

  loading = false;
  rememberMe = this.rememberedUsername !== null;

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
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

  onLogin(): void {
    if (!this.loginForm.valid) {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.getRawValue();

    if (this.rememberMe) {
      sessionStorage.setItem('remembered_username', username);
    } else {
      sessionStorage.removeItem('remembered_username');
    }

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Login bem-sucedido',
          detail: 'Bem-vindo! Você está sendo redirecionado...',
          life: 2000
        });
        this.navigateToRedirectUrl(this.getRedirectUrl());
      },
      error: (error) => {
        this.loading = false;
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

  private getErrorMessage(error: any): { summary: string; detail: string } {
    if (error?.status === 0) {
      return {
        summary: 'Servidor indisponível',
        detail: 'Não foi possível conectar ao servidor. Verifique se ele está ativo.'
      };
    }

    if (error?.status === 401 || error?.code === 'UNAUTHORIZED') {
      return {
        summary: 'Erro na autenticação',
        detail: 'Verifique suas credenciais e tente novamente.'
      };
    }

    if (error?.status >= 500) {
      return {
        summary: 'Erro no servidor',
        detail: 'O servidor encontrou um erro. Tente novamente mais tarde.'
      };
    }

    return {
      summary: 'Erro na autenticação',
      detail: error?.message || 'Erro desconhecido. Tente novamente.'
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
}
