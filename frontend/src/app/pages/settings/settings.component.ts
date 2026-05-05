import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

interface SettingsForm {
  notifications: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    SelectModule,
    DividerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Configurações</h1>
        <p>Personalize suas preferências de aplicação</p>
      </div>

      <div class="settings-content">
        <!-- Notification Settings -->
        <p-card class="settings-card">
          <ng-template pTemplate="header">
            <div class="card-title">
              <i class="pi pi-bell"></i>
              Notificações
            </div>
          </ng-template>
          <div class="settings-item">
            <div class="settings-item-info">
              <h4>Notificações do Sistema</h4>
              <p>Receba alertas sobre atualizações e atividades importantes</p>
            </div>
            <p-checkbox 
              [(ngModel)]="settings.notifications" 
              [binary]="true"
            ></p-checkbox>
          </div>
          <p-divider></p-divider>
          <div class="settings-item">
            <div class="settings-item-info">
              <h4>Notificações por Email</h4>
              <p>Receba notificações importantes por email</p>
            </div>
            <p-checkbox 
              [(ngModel)]="settings.emailNotifications" 
              [binary]="true"
            ></p-checkbox>
          </div>
        </p-card>

        <!-- Appearance Settings -->
        <p-card class="settings-card">
          <ng-template pTemplate="header">
            <div class="card-title">
              <i class="pi pi-palette"></i>
              Aparência
            </div>
          </ng-template>
          <div class="settings-item">
            <div class="settings-item-info">
              <h4>Modo Escuro</h4>
              <p>Ativar tema escuro para melhor experiência em ambientes com pouca luz</p>
            </div>
            <p-checkbox 
              [(ngModel)]="settings.darkMode" 
              [binary]="true"
            ></p-checkbox>
          </div>
          <p-divider></p-divider>
          <div class="settings-item language-selector">
            <div class="settings-item-info">
              <h4>Idioma</h4>
              <p>Escolha o idioma da interface</p>
            </div>
            <p-select
              [(ngModel)]="settings.language"
              [options]="languageOptions"
              optionLabel="label"
              optionValue="value"
              class="language-select"
            ></p-select>
          </div>
        </p-card>

        <!-- Privacy & Security -->
        <p-card class="settings-card">
          <ng-template pTemplate="header">
            <div class="card-title">
              <i class="pi pi-lock"></i>
              Privacidade e Segurança
            </div>
          </ng-template>
          <div class="security-options">
            <button
              pButton
              type="button"
              label="Alterar Senha"
              icon="pi pi-lock"
              severity="secondary"
              class="security-btn"
              (click)="changePassword()"
            ></button>
            <button
              pButton
              type="button"
              label="Gerenciar Sessões"
              icon="pi pi-sign-in"
              severity="secondary"
              class="security-btn"
              (click)="manageSessions()"
            ></button>
            <button
              pButton
              type="button"
              label="Exportar Dados"
              icon="pi pi-download"
              severity="secondary"
              class="security-btn"
              (click)="exportData()"
            ></button>
          </div>
        </p-card>

        <!-- Danger Zone -->
        <p-card class="settings-card danger-card">
          <ng-template pTemplate="header">
            <div class="card-title danger">
              <i class="pi pi-exclamation-triangle"></i>
              Zona de Perigo
            </div>
          </ng-template>
          <div class="danger-options">
            <div class="danger-item">
              <div class="danger-info">
                <h4>Deletar Conta</h4>
                <p>Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente.</p>
              </div>
              <button
                pButton
                type="button"
                label="Deletar Conta"
                icon="pi pi-trash"
                severity="danger"
                (click)="deleteAccount()"
              ></button>
            </div>
          </div>
        </p-card>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button
            pButton
            type="button"
            label="Salvar Alterações"
            icon="pi pi-check"
            class="btn-save"
            (click)="saveSettings()"
          ></button>
          <button
            pButton
            type="button"
            label="Restaurar Padrões"
            icon="pi pi-refresh"
            severity="secondary"
            (click)="resetSettings()"
          ></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .settings-container {
      animation: slideUp 300ms ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .settings-header {
      margin-bottom: 2rem;
    }

    .settings-header h1 {
      font-size: 2rem;
      color: #003641;
      margin-bottom: 0.5rem;
    }

    .settings-header p {
      color: #64748b;
      font-size: 1rem;
    }

    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    :host ::ng-deep .settings-card .p-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 1.25rem !important;
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      color: #003641;
    }

    .card-title i {
      font-size: 1.25rem;
      color: #00ae9d;
    }

    .card-title.danger i {
      color: #ef4444;
    }

    .settings-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem;
      gap: 1.5rem;
    }

    .settings-item-info {
      flex: 1;
    }

    .settings-item-info h4 {
      margin: 0 0 0.5rem 0;
      color: #003641;
      font-weight: 600;
    }

    .settings-item-info p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    :host ::ng-deep .p-checkbox .p-checkbox-box {
      width: 24px !important;
      height: 24px !important;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .language-selector {
      align-items: flex-start;
    }

    :host ::ng-deep .language-select {
      min-width: 150px;
    }

    .security-options {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 1rem;
    }

    .security-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .danger-card {
      border-left: 4px solid #ef4444;
    }

    :host ::ng-deep .danger-card .p-card-header {
      background: rgba(239, 68, 68, 0.05);
    }

    .danger-options {
      padding: 1rem;
    }

    .danger-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1rem;
      background: rgba(239, 68, 68, 0.05);
      border-radius: 8px;
      border-left: 3px solid #ef4444;
    }

    .danger-info h4 {
      margin: 0 0 0.5rem 0;
      color: #003641;
      font-weight: 600;
    }

    .danger-info p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .settings-header h1 {
        font-size: 1.5rem;
      }
      .danger-item {
        flex-direction: column;
        align-items: flex-start;
      }
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class SettingsComponent {
  private readonly messageService = inject(MessageService);

  settings: SettingsForm = {
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    language: 'pt-BR'
  };

  languageOptions = [
    { label: 'Português (Brasil)', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
    { label: 'Español', value: 'es-ES' }
  ];

  changePassword(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Alterar Senha',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

  manageSessions(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Gerenciar Sessões',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

  exportData(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Exportar Dados',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

  deleteAccount(): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Deletar Conta',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

  saveSettings(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Configurações salvas com sucesso',
      life: 3000
    });
  }

  resetSettings(): void {
    this.settings = {
      notifications: true,
      emailNotifications: true,
      darkMode: false,
      language: 'pt-BR'
    };
    this.messageService.add({
      severity: 'info',
      summary: 'Restaurado',
      detail: 'Configurações restauradas para os padrões',
      life: 3000
    });
  }
}
