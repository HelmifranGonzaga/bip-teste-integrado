import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule, DividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Meu Perfil</h1>
        <p>Informações pessoais e configurações da conta</p>
      </div>

      <div class="profile-content">
        @if (authUser$ | async; as user) {
          <!-- Profile Card -->
          <p-card class="profile-card">
            <div class="profile-info">
              <!-- Avatar Section -->
              <div class="avatar-section">
                <p-avatar
                  [label]="(user?.username || 'U').charAt(0).toUpperCase()"
                  shape="circle"
                  size="xlarge"
                  styleClass="profile-avatar"
                ></p-avatar>
                <div class="user-details">
                  <h2>{{ user?.username }}</h2>
                  <p class="user-email">{{ user?.email || 'email@example.com' }}</p>
                </div>
              </div>

              <p-divider></p-divider>

              <!-- Info Grid -->
              <div class="info-grid">
                <div class="info-item">
                  <label>Nome de Usuário</label>
                  <p>{{ user?.username }}</p>
                </div>
                <div class="info-item">
                  <label>Email</label>
                  <p>{{ user?.email || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Tipo de Usuário</label>
                  <p>Administrador</p>
                </div>
                <div class="info-item">
                  <label>Membro desde</label>
                  <p>Maio 2026</p>
                </div>
              </div>

              <p-divider></p-divider>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <button
                  pButton
                  type="button"
                  label="Editar Perfil"
                  icon="pi pi-pencil"
                  (click)="editProfile()"
                  class="btn-edit"
                ></button>
                <button
                  pButton
                  type="button"
                  label="Alterar Senha"
                  icon="pi pi-lock"
                  (click)="changePassword()"
                  class="btn-secondary"
                ></button>
              </div>
            </div>
          </p-card>

          <!-- Account Status Card -->
          <p-card class="status-card">
            <ng-template pTemplate="header">
              <div class="card-title">Status da Conta</div>
            </ng-template>
            <div class="status-content">
              <div class="status-item">
                <div class="status-indicator active"></div>
                <div class="status-info">
                  <h4>Conta Ativa</h4>
                  <p>Sua conta está ativa e funcionando normalmente</p>
                </div>
              </div>
              <div class="status-item">
                <div class="status-indicator verified"></div>
                <div class="status-info">
                  <h4>Email Verificado</h4>
                  <p>Seu email foi verificado com sucesso</p>
                </div>
              </div>
            </div>
          </p-card>
        }
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

    .profile-container {
      animation: slideUp 300ms ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .profile-header {
      margin-bottom: 2rem;
    }

    .profile-header h1 {
      font-size: 2rem;
      color: #003641;
      margin-bottom: 0.5rem;
    }

    .profile-header p {
      color: #64748b;
      font-size: 1rem;
      margin: 0;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    :host ::ng-deep .profile-avatar {
      background: #00ae9d !important;
      width: 100px !important;
      height: 100px !important;
      font-size: 2.5rem;
    }

    .user-details h2 {
      margin: 0 0 0.5rem 0;
      color: #003641;
    }

    .user-email {
      color: #64748b;
      font-size: 0.95rem;
      margin: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item label {
      font-weight: 600;
      color: #64748b;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item p {
      color: #003641;
      font-weight: 500;
      margin: 0;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    :host ::ng-deep .status-card .p-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 1.25rem;
    }

    .card-title {
      font-weight: 700;
      color: #003641;
    }

    .status-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .status-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 4px;
      flex-shrink: 0;
    }

    .status-indicator.active {
      background: #10b981;
    }

    .status-indicator.verified {
      background: #3b82f6;
    }

    .status-info h4 {
      margin: 0 0 0.25rem 0;
      color: #003641;
      font-weight: 600;
    }

    .status-info p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
    }

    @media (max-width: 900px) {
      .profile-content {
        grid-template-columns: 1fr;
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly authUser$ = this.authService.getAuthUser$();

  editProfile(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Editar Perfil',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

  changePassword(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Alterar Senha',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }
}
