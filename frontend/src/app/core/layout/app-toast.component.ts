import { Component } from '@angular/core';
import { ToastModule } from 'primeng/toast';

/**
 * Componente global de toast centralizado
 * - Posicionado no topo direito (top-right)
 * - Responsivo: center no mobile, top-right no desktop
 * - Acessibilidade: live region com ARIA
 * - Z-index alto: aparece acima de modais
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
      [breakpoints]="{ '576px': { right: '0', left: '0' } }"
      styleClass="app-toast-container"
      contentStyleClass="app-toast-content"
    ></p-toast>
  `,
  styles: [`
    :host ::ng-deep {
      /* Responsivo: mobile adjustments */
      @media (max-width: 576px) {
        .p-toast {
          width: calc(100vw - 1rem);
          right: 0.5rem !important;
          left: 0.5rem !important;
          max-width: none;
        }

        /* Stack toasts verticamente no mobile */
        .p-toast .p-toast-message {
          margin-bottom: 0.5rem;
        }
      }

      /* Desktop: top-right com margem segura */
      @media (min-width: 577px) {
        .p-toast {
          top: var(--toast-top-offset, 1rem);
          right: 1rem;
          width: 400px;
          max-width: 90vw;
        }
      }

      /* Safe area para dispositivos com notch */
      @supports (padding: max(0px)) {
        .p-toast {
          top: max(1rem, env(safe-area-inset-top));
          right: max(1rem, env(safe-area-inset-right));
          left: max(auto, env(safe-area-inset-left));
        }
      }

      /* Animações suave */
      .p-toast-message {
        animation: slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Success - verde suave */
      .p-toast-message.ng-enter-active.p-toast-message-success {
        border-left: 4px solid #10b981;
        background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
        color: #065f46;
      }

      .p-toast-message.ng-enter-active.p-toast-message-success .p-toast-message-icon {
        color: #10b981;
      }

      /* Error - vermelho suave */
      .p-toast-message.ng-enter-active.p-toast-message-error {
        border-left: 4px solid #ef4444;
        background: linear-gradient(135deg, #fef2f2 0%, #fef5f5 100%);
        color: #7f1d1d;
      }

      .p-toast-message.ng-enter-active.p-toast-message-error .p-toast-message-icon {
        color: #ef4444;
      }

      /* Warning - amarelo suave */
      .p-toast-message.ng-enter-active.p-toast-message-warn {
        border-left: 4px solid #f59e0b;
        background: linear-gradient(135deg, #fffbeb 0%, #fef9e7 100%);
        color: #7c2d12;
      }

      .p-toast-message.ng-enter-active.p-toast-message-warn .p-toast-message-icon {
        color: #f59e0b;
      }

      /* Info - azul suave */
      .p-toast-message.ng-enter-active.p-toast-message-info {
        border-left: 4px solid #3b82f6;
        background: linear-gradient(135deg, #eff6ff 0%, #ecf0ff 100%);
        color: #1e3a8a;
      }

      .p-toast-message.ng-enter-active.p-toast-message-info .p-toast-message-icon {
        color: #3b82f6;
      }

      /* Conteúdo do toast */
      .p-toast-message-content {
        padding: 1rem;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .p-toast-message-icon {
        font-size: 1.25rem;
        min-width: 1.25rem;
        margin-top: 0.125rem;
        flex-shrink: 0;
      }

      .p-toast-message-text {
        flex: 1;
      }

      .p-toast-summary {
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
      }

      .p-toast-detail {
        font-size: 0.875rem;
        opacity: 0.9;
        word-break: break-word;
      }

      /* Botão fechar */
      .p-toast-close-icon {
        opacity: 0.6;
        transition: opacity 0.2s ease;
      }

      .p-toast-close-icon:hover {
        opacity: 1;
      }

      /* Redução de movimento */
      @media (prefers-reduced-motion: reduce) {
        .p-toast-message {
          animation: none;
          transition: none;
        }
      }

      /* Light mode - texto mais legível */
      .p-toast-message {
        border-radius: 8px;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .p-toast-message.ng-enter-active.p-toast-message-success {
          background: linear-gradient(135deg, #1b3a1f 0%, #1f4d23 100%);
          color: #86efac;
        }

        .p-toast-message.ng-enter-active.p-toast-message-error {
          background: linear-gradient(135deg, #3f1e1e 0%, #4a2222 100%);
          color: #fca5a5;
        }

        .p-toast-message.ng-enter-active.p-toast-message-warn {
          background: linear-gradient(135deg, #3f2815 0%, #4a3018 100%);
          color: #fcd34d;
        }

        .p-toast-message.ng-enter-active.p-toast-message-info {
          background: linear-gradient(135deg, #1e2d4a 0%, #1f3a5a 100%);
          color: #93c5fd;
        }
      }
    }
  `]
})
export class AppToastComponent {}
