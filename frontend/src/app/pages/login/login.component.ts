import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  loginForm: FormGroup;
  loading = false;
  rememberMe = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Restore remembered username if available
    this.restoreRememberedUsername();
  }

  private restoreRememberedUsername(): void {
    const rememberedUsername = sessionStorage.getItem('remembered_username');
    if (rememberedUsername) {
      this.loginForm.patchValue({ username: rememberedUsername });
      this.rememberMe = true;
    }
  }

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
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    // Save remembered username
    if (this.rememberMe) {
      sessionStorage.setItem('remembered_username', username);
    } else {
      sessionStorage.removeItem('remembered_username');
    }

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Login bem-sucedido',
          detail: 'Bem-vindo! Você está sendo redirecionado...',
          life: 2000
        });
        this.router.navigate(['/beneficios']);
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
    // Erro de conexão com o servidor
    if (error?.status === 0) {
      return {
        summary: 'Servidor indisponível',
        detail: 'Não foi possível conectar ao servidor. Verifique se ele está ativo.'
      };
    }

    // Erro de autenticação (credenciais inválidas)
    if (error?.status === 401 || error?.code === 'UNAUTHORIZED') {
      return {
        summary: 'Erro na autenticação',
        detail: 'Verifique suas credenciais e tente novamente.'
      };
    }

    // Erro do servidor
    if (error?.status >= 500) {
      return {
        summary: 'Erro no servidor',
        detail: 'O servidor encontrou um erro. Tente novamente mais tarde.'
      };
    }

    // Erro genérico
    return {
      summary: 'Erro na autenticação',
      detail: error?.message || 'Erro desconhecido. Tente novamente.'
    };
  }
}
