import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { User, UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserFormComponent, SaveUserEvent } from './components/user-form/user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    CardModule,
    TagModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    UserFormComponent
  ],
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  users = signal<User[]>([]);
  editingUser = signal<User | null>(null);
  showDialog = signal(false);
  saving = signal(false);
  loading = signal(true);
  toggling = signal(false);
  generatingPassword = signal(false);
  generatedPassword = signal('');

  readonly currentUser = toSignal(this.authService.getAuthUser$());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.list().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a lista de usuários.'
        });
      }
    });
  }

  onDialogHide(): void {
    this.editingUser.set(null);
    this.generatedPassword.set('');
  }

  openNew(): void {
    this.editingUser.set(null);
    this.generatedPassword.set('');
    this.showDialog.set(true);
  }

  onEdit(user: User): void {
    this.editingUser.set(user);
    this.generatedPassword.set('');
    this.showDialog.set(true);
  }

  onToggleActive(user: User): void {
    this.confirmationService.confirm({
      message: `Deseja ${user.ativo ? 'desativar' : 'ativar'} o usuário "${user.nome}"?`,
      header: user.ativo ? 'Desativar Usuário' : 'Ativar Usuário',
      icon: user.ativo ? 'pi pi-times-circle' : 'pi pi-check-circle',
      acceptLabel: user.ativo ? 'Sim, desativar' : 'Sim, ativar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: user.ativo ? 'p-button-danger' : 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.executeToggle(user);
      }
    });
  }

  private executeToggle(user: User): void {
    this.toggling.set(true);
    this.userService.toggleActive(user.id).subscribe({
      next: (updated) => {
        this.toggling.set(false);
        if (this.editingUser()?.id === updated.id) {
          this.editingUser.set(updated);
        }
        this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        this.messageService.add({
          severity: 'success',
          summary: updated.ativo ? 'Ativado' : 'Desativado',
          detail: `Usuário ${updated.nome} ${updated.ativo ? 'ativado' : 'desativado'} com sucesso.`
        });
      },
      error: () => {
        this.toggling.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível alterar o status do usuário.'
        });
      }
    });
  }

  onDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o usuário "${user.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.userService.delete(user.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Excluído',
              detail: 'Usuário excluído com sucesso.'
            });
            this.loadUsers();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Não foi possível excluir o usuário.'
            });
          }
        });
      }
    });
  }

  onGeneratePassword(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.generatedPassword.set(password);
  }

  onResetPassword(user: User): void {
    this.generatingPassword.set(true);
    this.userService.resetPassword(user.id).subscribe({
      next: (resp) => {
        this.generatingPassword.set(false);
        this.confirmationService.confirm({
          message: `Nova senha gerada para "${user.nome}":\n\n${resp.novaSenha}\n\nCopie a senha e envie ao usuário. Após o primeiro login, ele deverá alterá-la.`,
          header: 'Senha Gerada',
          icon: 'pi pi-key',
          acceptLabel: 'Copiar senha',
          rejectLabel: 'Fechar',
          acceptButtonStyleClass: 'p-button-success',
          rejectButtonStyleClass: 'p-button-secondary',
          accept: () => {
            navigator.clipboard.writeText(resp.novaSenha).catch(() => {});
            this.messageService.add({
              severity: 'info',
              summary: 'Copiada',
              detail: 'Senha copiada para a área de transferência.'
            });
          }
        });
      },
      error: () => {
        this.generatingPassword.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível gerar nova senha.'
        });
      }
    });
  }

  onSave(event: SaveUserEvent): void {
    this.saving.set(true);
    const obs = event.id
      ? this.userService.update(event.id, event.payload)
      : this.userService.create(event.payload as any);

    obs.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Salvo',
          detail: `Usuário ${event.id ? 'atualizado' : 'criado'} com sucesso.`
        });
        this.showDialog.set(false);
        this.saving.set(false);
        this.loadUsers();
      },
      error: (err) => {
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'Não foi possível salvar o usuário.'
        });
      }
    });
  }
}