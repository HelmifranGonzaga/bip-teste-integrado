import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { RippleModule } from 'primeng/ripple';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    AvatarModule,
    RippleModule
  ],
  template: `
    <header class="app-header" @slideDown>
      <div class="header-container">
        <!-- Logo Section -->
        <div class="header-logo">
          <div class="logo-icon">
            <i class="pi pi-wallet"></i>
          </div>
          <div class="logo-text">
            <h1>BIP</h1>
            <span>Benefícios</span>
          </div>
        </div>

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
  styles: [`
    .app-header {
      background: linear-gradient(135deg, var(--color-accent-1) 0%, var(--color-accent-2) 100%);
      box-shadow: 0 2px 8px var(--shadow-sm);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0;
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
    }

    .header-container {
      display: flex;
      align-items: center;
      padding: var(--spacing-4) var(--spacing-8);
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      gap: var(--spacing-6);
    }

    /* Logo */
    .header-logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      text-decoration: none;
      cursor: pointer;
      transition: transform var(--transition-base);
      flex-shrink: 0;
    }

    .header-logo:hover {
      transform: scale(1.05);
    }

    .logo-icon {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
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
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      letter-spacing: 1.5px;
    }

    .logo-text span {
      color: rgba(255, 255, 255, 0.9);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      letter-spacing: 2px;
      text-transform: uppercase;
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
      gap: var(--spacing-3);
      background: rgba(255, 255, 255, 0.15) !important;
      border: 1px solid rgba(255, 255, 255, 0.25) !important;
      color: white !important;
      padding: 0.6rem 1.2rem !important;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-base);
      backdrop-filter: blur(10px);
    }

    .user-menu-toggle:hover {
      background: rgba(255, 255, 255, 0.25) !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
      transform: translateY(-2px);
    }

    .user-menu-toggle:active {
      transform: translateY(0) !important;
    }

    .user-name {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-menu-toggle i {
      font-size: var(--font-size-xs);
      opacity: 0.8;
    }

    :host ::ng-deep .user-avatar {
      width: 36px !important;
      height: 36px !important;
      background: rgba(255, 255, 255, 0.3) !important;
      color: white !important;
      font-weight: var(--font-weight-semibold) !important;
    }

    /* Dropdown Menu */
    :host ::ng-deep .p-menu {
      border-radius: var(--radius-lg);
      border: none;
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }

    :host ::ng-deep .p-menu .p-menu-list {
      padding: var(--spacing-2) 0;
    }

    :host ::ng-deep .p-menuitem-content {
      padding: var(--spacing-3) var(--spacing-4) !important;
      border-radius: 0 !important;
      transition: all var(--transition-base);
    }

    :host ::ng-deep .p-menuitem-content:hover {
      background: var(--color-surface-100) !important;
    }

    :host ::ng-deep .p-menuitem-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      color: var(--color-text) !important;
    }

    :host ::ng-deep .p-menuitem-icon {
      color: var(--color-accent-1);
      font-size: var(--font-size-lg);
    }

    :host ::ng-deep .p-menuitem-text {
      font-weight: var(--font-weight-medium);
      color: var(--color-text) !important;
    }

    :host ::ng-deep .p-menuitem:last-child .p-menuitem-content {
      border-top: 1px solid var(--color-border);
    }

    :host ::ng-deep .p-menuitem:last-child .p-menuitem-link {
      color: var(--color-danger) !important;
    }

    :host ::ng-deep .p-menuitem:last-child .p-menuitem-icon {
      color: var(--color-danger) !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-container {
        padding: var(--spacing-3) var(--spacing-4);
        gap: var(--spacing-4);
      }

      .logo-icon {
        width: 40px;
        height: 40px;
        font-size: 1.4rem;
      }

      .logo-text h1 {
        font-size: var(--font-size-lg);
      }

      .logo-text span {
        display: none;
      }

      .user-menu-toggle {
        padding: 0.5rem 0.75rem !important;
      }

      .user-name {
        display: none;
      }

      .user-menu-toggle i {
        margin-left: 0;
      }
    }
  `],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  authUser$ = this.authService.getAuthUser$();
  userMenuItems: MenuItem[] = [];

  constructor() {
    this.initializeMenu();
  }

  private initializeMenu(): void {
    this.userMenuItems = [
      {
        label: 'Meu Perfil',
        icon: 'pi pi-user',
        command: () => this.viewProfile()
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        command: () => this.openSettings()
      },
      {
        separator: true
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => this.onLogout()
      }
    ];
  }

  private viewProfile(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Perfil',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

  private openSettings(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Configurações',
      detail: 'Funcionalidade em desenvolvimento',
      life: 3000
    });
  }

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
