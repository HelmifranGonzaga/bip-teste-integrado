import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
  template: `
    <div class="login-wrapper" role="presentation">
      <!-- Background Decoration -->
      <div class="decoration decoration-1" aria-hidden="true"></div>
      <div class="decoration decoration-2" aria-hidden="true"></div>

      <div class="login-container" @fadeIn>
        <div class="login-content">
          <!-- Header -->
          <div class="login-header">
            <div class="logo-circle" aria-label="Logo BIP Benefícios">
              <i class="pi pi-wallet" aria-hidden="true"></i>
            </div>
            <h1 class="brand-title">BIP Benefícios</h1>
            <p class="subtitle">Sistema de Gerenciamento de Benefícios</p>
          </div>

          <div class="divider"></div>

          <!-- Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
            <!-- Username Field -->
            <div class="field">
              <label for="username" class="label-text">
                <i class="pi pi-user" aria-hidden="true"></i>
                <span>Usuário</span>
              </label>
              <input
                id="username"
                type="text"
                pInputText
                formControlName="username"
                placeholder="texto@exemplo.com ou nome_de_usuário"
                class="form-input"
                [class.error]="isFieldInvalid('username')"
                aria-describedby="username-error username-help"
                autocomplete="username"
                spellcheck="false"
              />
              <small class="help-text" id="username-help" *ngIf="!isFieldInvalid('username')">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                Use email ou nome de usuário
              </small>
              <small
                class="error-message"
                id="username-error"
                *ngIf="isFieldInvalid('username')"
                role="alert"
              >
                <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
                Usuário é obrigatório
              </small>
            </div>

            <!-- Password Field -->
            <div class="field">
              <label for="password" class="label-text">
                <i class="pi pi-lock" aria-hidden="true"></i>
                <span>Senha</span>
              </label>
              <p-password
                id="password"
                formControlName="password"
                placeholder="••••••••"
                [toggleMask]="true"
                [feedback]="false"
                class="form-password"
                aria-describedby="password-error password-help"
                autocomplete="current-password"
                [styleClass]="{ 'error': isFieldInvalid('password') }"
              ></p-password>
              <small class="help-text" id="password-help" *ngIf="!isFieldInvalid('password')">
                <i class="pi pi-check-circle" aria-hidden="true"></i>
                Mínimo 6 caracteres
              </small>
              <small
                class="error-message"
                id="password-error"
                *ngIf="isFieldInvalid('password')"
                role="alert"
              >
                <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
                Senha é obrigatória
              </small>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="remember-section">
              <div class="checkbox-wrapper">
                <p-checkbox
                  [(ngModel)]="rememberMe"
                  [ngModelOptions]="{standalone: true}"
                  [binary]="true"
                  inputId="rememberMe"
                  name="rememberMe"
                  aria-label="Lembrar de mim neste dispositivo"
                ></p-checkbox>
                <label for="rememberMe" class="remember-label">
                  Lembrar de mim
                </label>
              </div>
              <a href="javascript:void(0)" class="forgot-password-link"
                 (click)="showForgotPasswordHelp($event)"
                 aria-label="Esqueci minha senha">
                Esqueci minha senha
              </a>
            </div>

            <!-- Submit Button -->
            <button
              pButton
              type="submit"
              label="Entrar"
              [loading]="loading"
              icon="pi pi-sign-in"
              class="submit-button"
              [disabled]="!loginForm.valid || loading"
              aria-busy="loading"
            ></button>
          </form>

          <!-- Footer / Demo Info -->
          <div class="login-footer">
            <p class="demo-hint">
              <i class="pi pi-lightbulb" aria-hidden="true"></i>
              <span><strong>Demo:</strong> Use qualquer credencial para testar</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Layout */
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow: hidden;
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .decoration {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
      pointer-events: none;
    }

    .decoration-1 {
      width: 600px;
      height: 600px;
      background: white;
      top: -300px;
      left: -300px;
      animation: float 6s ease-in-out infinite;
    }

    .decoration-2 {
      width: 400px;
      height: 400px;
      background: white;
      bottom: -200px;
      right: -200px;
      animation: float 8s ease-in-out infinite reverse;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(20px); }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 420px;
    }

    .login-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
      animation: slideUp 0.6s ease-out;
      backdrop-filter: blur(10px);
    }

    /* Header Section */
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      transition: transform 0.3s ease;
    }

    .logo-circle:hover {
      transform: scale(1.05);
    }

    .logo-circle i {
      font-size: 2.5rem;
      color: white;
    }

    .brand-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a2e;
      letter-spacing: -0.5px;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: 400;
      opacity: 0.8;
    }

    /* Divider */
    .divider {
      height: 1px;
      background: linear-gradient(135deg, transparent, #e0e0e0 50%, transparent);
      margin: 1.5rem 0;
    }

    /* Form Styles */
    .login-form {
      margin: 0;
    }

    .field {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
    }

    .label-text {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.625rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }

    .label-text i {
      color: #667eea;
      font-size: 1rem;
      width: 20px;
      text-align: center;
    }

    .form-input,
    .form-password {
      width: 100%;
    }

    /* Input States */
    :host ::ng-deep .p-inputtext,
    :host ::ng-deep .form-input {
      height: 44px; /* Touch-friendly minimum */
      font-size: 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .p-inputtext:focus,
    :host ::ng-deep .form-input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      outline: none;
    }

    :host ::ng-deep .form-input.ng-valid.ng-touched:not(.error) {
      border-color: #4caf50 !important;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
    }

    :host ::ng-deep .form-input.error,
    :host ::ng-deep .p-inputtext.error {
      border-color: #f44336 !important;
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
    }

    /* PrimeNG Password Component */
    :host ::ng-deep .p-password {
      width: 100%;
    }

    :host ::ng-deep .p-password .p-inputtext {
      width: 100%;
      height: 44px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .p-password .p-inputtext:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      outline: none;
    }

    /* Helper & Error Messages */
    .help-text {
      color: #667eea;
      font-size: 0.8rem;
      margin-top: 0.375rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      opacity: 0.8;
    }

    .help-text i {
      font-size: 0.85rem;
    }

    .error-message {
      color: #f44336;
      font-size: 0.8rem;
      margin-top: 0.375rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 500;
    }

    .error-message i {
      font-size: 0.85rem;
    }

    /* Remember Section */
    .remember-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1.25rem 0 1.75rem 0;
      gap: 1rem;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    :host ::ng-deep .p-checkbox {
      display: flex;
      align-items: center;
    }

    :host ::ng-deep .p-checkbox .p-checkbox-box {
      width: 20px;
      height: 20px;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .p-checkbox .p-checkbox-box:focus-visible {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }

    :host ::ng-deep .p-checkbox.ng-checked .p-checkbox-box {
      background: #667eea;
      border-color: #667eea;
    }

    .remember-label {
      font-size: 0.9rem;
      color: #333;
      cursor: pointer;
      font-weight: 500;
      user-select: none;
    }

    .forgot-password-link {
      font-size: 0.9rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 2px solid transparent;
    }

    .forgot-password-link:hover {
      color: #764ba2;
      border-bottom-color: #764ba2;
    }

    .forgot-password-link:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
      border-radius: 2px;
    }

    /* Submit Button */
    :host ::ng-deep .submit-button {
      height: 48px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none !important;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 0.5rem;
      width: 100%;
      padding: 0.875rem 1.5rem !important;
    }

    :host ::ng-deep .submit-button:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.35) !important;
    }

    :host ::ng-deep .submit-button:not(:disabled):active {
      transform: translateY(0) scale(0.98);
    }

    :host ::ng-deep .submit-button:focus-visible {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    :host ::ng-deep .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Footer Section */
    .login-footer {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .security-info {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: #4caf50;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .security-info i {
      font-size: 1rem;
    }

    .demo-hint {
      margin: 0;
      color: #666;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .demo-hint i {
      color: #ff9800;
      font-size: 1rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .login-wrapper {
        padding: 1.5rem;
      }

      .login-content {
        padding: 2rem 1.5rem;
        border-radius: 12px;
      }

      .brand-title {
        font-size: 1.5rem;
      }

      .subtitle {
        font-size: 0.85rem;
      }

      .logo-circle {
        width: 70px;
        height: 70px;
      }

      .logo-circle i {
        font-size: 2rem;
      }

      .remember-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .forgot-password-link {
        align-self: flex-end;
      }
    }

    @media (max-width: 480px) {
      .login-wrapper {
        padding: 1rem;
        align-items: flex-start;
        justify-content: flex-start;
        padding-top: max(1rem, env(safe-area-inset-top, 0));
      }

      .login-container {
        margin-top: 1rem;
      }

      .login-content {
        padding: 1.75rem 1.25rem;
        border-radius: 12px;
        margin-bottom: 2rem;
      }

      .brand-title {
        font-size: 1.375rem;
        line-height: 1.3;
      }

      .subtitle {
        font-size: 0.8rem;
      }

      .logo-circle {
        width: 60px;
        height: 60px;
        margin: 0 auto 1rem;
      }

      .logo-circle i {
        font-size: 1.75rem;
      }

      .field {
        margin-bottom: 1.25rem;
      }

      :host ::ng-deep .p-inputtext,
      :host ::ng-deep .form-input {
        height: 48px;
        font-size: 16px; /* Prevents zoom on iOS */
        padding: 0.75rem 1rem;
      }

      :host ::ng-deep .submit-button {
        height: 50px;
        font-size: 0.95rem;
      }

      .remember-section {
        flex-direction: column;
        align-items: flex-start;
        margin: 1rem 0 1.375rem 0;
      }

      .demo-hint {
        font-size: 0.8rem;
      }
    }

    /* Accessibility - Focus Visible */
    :focus-visible {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    /* High Contrast Mode */
    @media (prefers-contrast: more) {
      .label-text {
        font-weight: 700;
      }

      .help-text,
      .demo-hint {
        opacity: 1;
        font-weight: 500;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .decoration-1,
      .decoration-2 {
        animation: none;
      }
    }

    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      .login-content {
        background: #1e1e2e;
        color: #e0e0e0;
      }

      .brand-title {
        color: #e0e0e0;
      }

      .subtitle {
        color: #a0a0a0;
      }

      .label-text {
        color: #e0e0e0;
      }

      :host ::ng-deep .p-inputtext,
      :host ::ng-deep .form-input {
        background: #2a2a3e;
        color: #e0e0e0;
        border-color: #444;
      }

      :host ::ng-deep .p-inputtext:focus {
        background: #2a2a3e;
        border-color: #667eea !important;
      }

      .remember-label {
        color: #e0e0e0;
      }

      .demo-hint {
        color: #a0a0a0;
      }

      .login-footer {
        border-top-color: #333;
      }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  loginForm: FormGroup;
  loading = false;
  rememberMe = false;

  constructor() {
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
        this.messageService.add({
          severity: 'error',
          summary: 'Erro na autenticação',
          detail: 'Verifique suas credenciais e tente novamente.',
          life: 5000
        });
        console.error('Login error:', error);
      }
    });
  }
}
