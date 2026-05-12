import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
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
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
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