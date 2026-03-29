import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

/**
 * Componente global de toast com design inspirado no GitHub
 * - Posicionado no topo direito (top-right) - padrão GitHub
 * - Responsivo: center-top no mobile, top-right no desktop
 * - Design minimalista: sem gradientes, borders sutis
 * - Animação suave com fade + slide
 * - Acessibilidade WCAG compliant
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [ToastModule],
  template: `
    <p-toast
      position="top-right"
      [baseZIndex]="9999"
      [showTransitionOptions]="'translateX(0.3s)'"
      [hideTransitionOptions]="'translateX(0.3s)'"
      [breakpoints]="{ '576px': { right: '0.5rem', left: '0.5rem', top: '0.5rem' } }"
      styleClass="app-toast-container"
      contentStyleClass="app-toast-content"
    ></p-toast>
  `,
  styles: [`
    :host ::ng-deep {
      /* Container base */
      .p-toast {
        width: 420px;
        max-width: 95vw;
      }

      /* Mobile: top-center */
      @media (max-width: 576px) {
        .p-toast {
          width: calc(100vw - var(--spacing-4));
          top: var(--spacing-2) !important;
          left: var(--spacing-2) !important;
          right: var(--spacing-2) !important;
        }
      }

      /* Desktop: top-right */
      @media (min-width: 577px) {
        .p-toast {
          top: var(--spacing-4);
          right: var(--spacing-4);
          left: auto;
        }
      }

      /* Safe area support */
      @supports (padding: max(0px)) {
        .p-toast {
          top: max(var(--spacing-4), env(safe-area-inset-top));
          right: max(var(--spacing-4), env(safe-area-inset-right));
        }
      }

      /* Toast message base - GitHub style */
      .p-toast-message {
        animation: slideInRightGithub 0.3s var(--easing-ease-out);
        border-radius: var(--radius-md);
        border: 1px solid;
        padding: var(--spacing-3) var(--spacing-4);
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        box-shadow: var(--shadow-toast);
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-3);
      }

      @keyframes slideInRightGithub {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Success - GitHub success style */
      .p-toast-message.ng-enter-active.p-toast-message-success {
        background-color: var(--color-success-bg-light);
        border-color: var(--color-success-border-light);
        color: var(--color-success-text-light);
      }

      .p-toast-message.ng-enter-active.p-toast-message-success .p-toast-message-icon {
        color: var(--color-success);
        font-weight: var(--font-weight-semibold);
      }

      /* Error - GitHub error style */
      .p-toast-message.ng-enter-active.p-toast-message-error {
        background-color: var(--color-danger-bg-light);
        border-color: var(--color-danger-border-light);
        color: var(--color-danger-text-light);
      }

      .p-toast-message.ng-enter-active.p-toast-message-error .p-toast-message-icon {
        color: var(--color-danger);
        font-weight: var(--font-weight-semibold);
      }

      /* Warning - GitHub warning style */
      .p-toast-message.ng-enter-active.p-toast-message-warn {
        background-color: var(--color-warning-bg-light);
        border-color: var(--color-warning-border-light);
        color: var(--color-warning-text-light);
      }

      .p-toast-message.ng-enter-active.p-toast-message-warn .p-toast-message-icon {
        color: var(--color-warning);
        font-weight: var(--font-weight-semibold);
      }

      /* Info - GitHub info style */
      .p-toast-message.ng-enter-active.p-toast-message-info {
        background-color: var(--color-info-bg-light);
        border-color: var(--color-info-border-light);
        color: var(--color-info-text-light);
      }

      .p-toast-message.ng-enter-active.p-toast-message-info .p-toast-message-icon {
        color: #3b82f6;
        font-weight: 600;
      }

      /* Icon styling */
      .p-toast-message-icon {
        flex-shrink: 0;
        font-size: 1.1rem;
        line-height: 1;
      }

      /* Text content */
      .p-toast-message-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-1);
      }

      .p-toast-summary {
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size-sm);
        line-height: var(--line-height-normal);
      }

      .p-toast-detail {
        font-size: var(--font-size-xs);
        opacity: 0.85;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      /* Close button - GitHub style */
      .p-toast-close {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        background: transparent;
        color: currentColor;
        opacity: 0.6;
        transition: opacity var(--transition-base);
        padding: 0;
        margin-left: var(--spacing-2);
        border-radius: var(--radius-sm);
      }

      .p-toast-close:hover {
        opacity: 0.85;
      }

      .p-toast-close:active {
        opacity: 1;
      }

      /* Accessibility - removed motion */
      @media (prefers-reduced-motion: reduce) {
        .p-toast-message {
          animation: none;
          transform: none !important;
        }
      }

      /* Dark mode - GitHub Dimmed style */
      @media (prefers-color-scheme: dark) {
        .p-toast-message {
          box-shadow: var(--shadow-xl);
        }

        .p-toast-message.ng-enter-active.p-toast-message-success {
          background-color: var(--color-success-bg-dark);
          border-color: var(--color-success-border-dark);
          color: var(--color-success-text-dark);
        }

        .p-toast-message.ng-enter-active.p-toast-message-success .p-toast-message-icon {
          color: var(--color-success);
        }

        .p-toast-message.ng-enter-active.p-toast-message-error {
          background-color: var(--color-danger-bg-dark);
          border-color: var(--color-danger-border-dark);
          color: var(--color-danger-text-dark);
        }

        .p-toast-message.ng-enter-active.p-toast-message-error .p-toast-message-icon {
          color: var(--color-danger);
        }

        .p-toast-message.ng-enter-active.p-toast-message-warn {
          background-color: #3d2817;
          border-color: #d29922;
          color: #d4a574;
        }

        .p-toast-message.ng-enter-active.p-toast-message-warn .p-toast-message-icon {
          color: #d4a574;
        }

        .p-toast-message.ng-enter-active.p-toast-message-info {
          background-color: #0d1b1f;
          border-color: #1f6feb;
          color: #79c0ff;
        }

        .p-toast-message.ng-enter-active.p-toast-message-info .p-toast-message-icon {
          color: #58a6ff;
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: more) {
        .p-toast-message {
          border-width: 2px;
        }

        .p-toast-message.ng-enter-active.p-toast-message-success {
          color: #004d24;
        }

        .p-toast-message.ng-enter-active.p-toast-message-error {
          color: #5a0606;
        }

        .p-toast-message.ng-enter-active.p-toast-message-warn {
          color: #5a3a0a;
        }

        .p-toast-message.ng-enter-active.p-toast-message-info {
          color: #001a4d;
        }
      }
    }
  `]
})
export class AppToastComponent {}
