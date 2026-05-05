import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, AvatarModule, RippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header">
      <div class="header-container">
        <!-- Logo Section -->
        <a class="header-logo" routerLink="/beneficios">
          <div class="logo-icon">
            <i class="pi pi-wallet"></i>
          </div>
          <div class="logo-text">
            <h1>BIP</h1>
            <span>Benefícios</span>
          </div>
        </a>

        <!-- Main Navigation -->
        <nav class="header-nav">
          <a routerLink="/beneficios" routerLinkActive="active" class="nav-link" pRipple>
            <i class="pi pi-home"></i>
            <span>Início</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="nav-link" pRipple>
            <i class="pi pi-user"></i>
            <span>Perfil</span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="nav-link" pRipple>
            <i class="pi pi-cog"></i>
            <span>Ajustes</span>
          </a>
        </nav>

        <!-- Spacer -->
        <div class="header-spacer"></div>

        <!-- User Section -->
        <div class="header-user" *ngIf="authUser$ | async as user">
          <button
            pButton
            type="button"
            pRipple
            class="user-menu-toggle"
            (click)="userMenuRef.toggle($event)"
          >
            <p-avatar
              [label]="(user.username || 'U').charAt(0).toUpperCase()"
              shape="circle"
              size="large"
              styleClass="user-avatar"
            ></p-avatar>
            <span class="user-name">{{ user.username }}</span>
            <i class="pi pi-chevron-down"></i>
          </button>

          <p-menu #userMenuRef [popup]="true" [model]="userMenuItems"></p-menu>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .app-header {
        background: #003641;
        box-shadow: 0 4px 12px rgba(0, 54, 65, 0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .header-container {
        display: flex;
        align-items: center;
        padding: 0.75rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
        gap: 2rem;
      }

      /* Logo */
      .header-logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        cursor: pointer;
        transition: transform 0.3s ease;
        flex-shrink: 0;
      }

      .header-logo:hover {
        transform: scale(1.05);
      }

      .logo-icon {
        width: 45px;
        height: 45px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
        backdrop-filter: blur(10px);
        flex-shrink: 0;
      }

      .logo-text {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        white-space: nowrap;
      }

      .logo-text h1 {
        margin: 0;
        color: white;
        font-size: 1.3rem;
        font-weight: 700;
        letter-spacing: 1.5px;
      }

      .logo-text span {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      /* Main Navigation */
      .header-nav {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.25rem;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .nav-link i {
        font-size: 1.1rem;
      }

      .nav-link:hover {
        color: white;
        background: rgba(255, 255, 255, 0.15);
      }

      .nav-link.active {
        color: #003641;
        background: white;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .nav-link.active i {
        color: #00ae9d;
      }

      /* Spacer */
      .header-spacer {
        flex: 1;
      }

      /* User Menu */
      .header-user {
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .user-menu-toggle {
        display: flex !important;
        align-items: center;
        gap: 0.75rem;
        background: transparent !important;
        border: 1px solid transparent !important;
        color: white !important;
        padding: 0.4rem 0.5rem !important;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .user-menu-toggle:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
      }

      .user-name {
        font-weight: 600;
        font-size: 0.95rem;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .user-menu-toggle i {
        font-size: 0.75rem;
        opacity: 0.8;
      }

      :host ::ng-deep .user-avatar {
        width: 38px !important;
        height: 38px !important;
        background: white !important;
        color: #003641 !important;
        font-weight: 700 !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      }

      /* Dropdown Menu */
      :host ::ng-deep .p-menu {
        border-radius: 12px;
        border: none;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        min-width: 200px;
        margin-top: 0.5rem;
      }

      :host ::ng-deep .p-menu .p-menu-list {
        padding: 0.5rem 0;
      }

      :host ::ng-deep .p-menuitem-content {
        padding: 0.75rem 1.25rem !important;
        border-radius: 0 !important;
        transition: all 0.2s ease;
      }

      :host ::ng-deep .p-menuitem-content:hover {
        background: #f8f9fa !important;
      }

      :host ::ng-deep .p-menuitem-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #4b5563 !important;
      }

      :host ::ng-deep .p-menuitem-icon {
        color: #00ae9d;
        font-size: 1.1rem;
      }

      :host ::ng-deep .p-menuitem-text {
        font-weight: 500;
        color: #374151 !important;
      }

      :host ::ng-deep .p-menuitem .p-menuitem-link,
      :host ::ng-deep .p-menuitem .p-menuitem-icon {
        color: #ef4444 !important;
      }

      /* Responsive */
      @media (max-width: 992px) {
        .header-container {
          flex-wrap: wrap;
          padding: 0.75rem 1.5rem;
          gap: 1rem;
        }

        .header-spacer {
          display: none;
        }

        .header-nav {
          order: 3;
          width: 100%;
          justify-content: center;
        }
        
        .header-user {
          margin-left: auto;
        }
      }

      @media (max-width: 768px) {
        .header-container {
          padding: 0.75rem 1rem;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          font-size: 1.3rem;
        }

        .logo-text h1 {
          font-size: 1.1rem;
        }

        .logo-text span {
          display: none;
        }

        .nav-link span {
          display: none; /* Hide text on small screens, show icons only */
        }
        
        .nav-link {
          padding: 0.6rem 1.5rem;
        }

        .user-name {
          display: none;
        }

        .user-menu-toggle i {
          margin-left: 0;
        }
      }
    `
  ]
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly authUser$ = this.authService.getAuthUser$();
  readonly userMenuItems: MenuItem[] = [
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => this.onLogout()
    }
  ];

  onLogout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'info',
      summary: 'Logout',
      detail: 'Você foi desconectado com sucesso.',
      life: 2000
    });
    this.router.navigate(['/login']);
  }
}
