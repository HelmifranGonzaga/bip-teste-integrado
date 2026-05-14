import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { RippleModule } from 'primeng/ripple';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, AvatarModule, RippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styles: [`
    .app-header {
      background: linear-gradient(135deg, var(--p-surface-900) 0%, var(--p-surface-800) 100%);
      box-shadow: 0 10px 30px var(--p-surface-700);
      border-bottom: 1px solid var(--p-surface-700);
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
      background: var(--p-surface-700);
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
      color: var(--p-surface-0);
      font-size: 1.3rem;
      font-family: 'Montserrat', var(--font-family, Arial, sans-serif);
      font-weight: 700;
      letter-spacing: 1.5px;
    }

    .logo-text span {
      color: var(--p-surface-200);
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--p-surface-700);
      padding: 0.25rem;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid var(--p-surface-600);
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--p-surface-100);
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
      color: var(--p-surface-0);
      background: var(--p-surface-600);
    }

    .nav-link.active {
      color: var(--p-surface-900);
      background: var(--p-surface-0);
      font-weight: 600;
      box-shadow: 0 2px 8px var(--p-surface-600);
    }

    .nav-link.active i {
      color: var(--p-primary-500);
    }

    .header-spacer {
      flex: 1;
    }

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
      color: var(--p-surface-0) !important;
      padding: 0.4rem 0.5rem !important;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-menu-toggle:hover {
      background: var(--p-surface-700) !important;
      border-color: var(--p-surface-600) !important;
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
      background: var(--p-surface-0) !important;
      color: var(--p-surface-900) !important;
      font-weight: 700 !important;
      box-shadow: 0 2px 6px var(--p-surface-600);
    }

    :host ::ng-deep .p-menu {
      border-radius: 12px;
      border: none;
      box-shadow: 0 10px 40px var(--p-surface-300);
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
      background: var(--p-surface-50) !important;
    }

    :host ::ng-deep .p-menuitem-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--p-surface-700) !important;
    }

    :host ::ng-deep .p-menuitem-icon {
      color: var(--p-primary-500);
      font-size: 1.1rem;
    }

    :host ::ng-deep .p-menuitem-text {
      font-weight: 500;
      color: var(--p-surface-700) !important;
    }

    :host ::ng-deep .logout-item .p-menuitem-link .p-menuitem-text,
    :host ::ng-deep .logout-item .p-menuitem-link .p-menuitem-icon {
      color: var(--p-red-500) !important;
    }

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
        display: none;
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
  `]
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly menuOpen = signal(false);

  readonly authUser$ = this.authService.getAuthUser$();
  readonly currentUser = toSignal(this.authUser$, { initialValue: null });
  readonly userMenuItems = computed<MenuItem[]>(() => {
    const isAdmin = this.currentUser()?.role === 'ADMIN';

    return [
      {
        label: 'Perfil',
        icon: 'pi pi-user',
        routerLink: '/profile'
      },
      ...(isAdmin
        ? [
            {
              label: 'Usuários',
              icon: 'pi pi-users',
              routerLink: '/usuarios'
            }
          ]
        : []),
      {
        label: 'Ajustes',
        icon: 'pi pi-cog',
        routerLink: '/settings'
      },
      {
        separator: true
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        styleClass: 'logout-item',
        command: () => this.onLogout()
      }
    ];
  });

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
