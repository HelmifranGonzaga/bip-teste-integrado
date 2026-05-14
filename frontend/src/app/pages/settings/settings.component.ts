import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    SelectModule,
    DividerModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly settings = signal({
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    language: 'pt-BR'
  });

  readonly languageOptions = [
    { label: 'Português (Brasil)', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
    { label: 'Español', value: 'es-ES' }
  ];

  changePassword(): void {
    this.showInfo('Alterar Senha', 'Funcionalidade em desenvolvimento');
  }

  manageSessions(): void {
    this.showInfo('Gerenciar Sessões', 'Funcionalidade em desenvolvimento');
  }

  exportData(): void {
    this.showInfo('Exportar Dados', 'Funcionalidade em desenvolvimento');
  }

  deleteAccount(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente.',
      header: 'Excluir Conta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir minha conta',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.showWarn('Excluir Conta', 'Funcionalidade em desenvolvimento');
      }
    });
  }

  saveSettings(): void {
    this.showSuccess('Sucesso', 'Configurações salvas com sucesso');
  }

  resetSettings(): void {
    this.settings.set({
      notifications: true,
      emailNotifications: true,
      darkMode: false,
      language: 'pt-BR'
    });
    this.showInfo('Restaurado', 'Configurações restauradas para os padrões');
  }

  getSettings() {
    return this.settings();
  }

  private showInfo(summary: string, detail: string): void {
    this.messageService.add({ severity: 'info', summary, detail, life: 3000 });
  }

  private showWarn(summary: string, detail: string): void {
    this.messageService.add({ severity: 'warn', summary, detail, life: 4000 });
  }

  private showSuccess(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary, detail, life: 3000 });
  }
}