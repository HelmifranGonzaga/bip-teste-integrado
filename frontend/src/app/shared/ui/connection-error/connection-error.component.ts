import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-connection-error',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="connection-error-screen" aria-live="polite" [attr.aria-busy]="reconnecting">
      <div class="connection-error-content">
        <i class="pi pi-wifi text-4xl" aria-hidden="true"></i>
        <h2 tabindex="-1" role="alert" aria-live="assertive">Sem conexão com o servidor</h2>
        <p>{{ errorMessage }}</p>

        <p class="connection-status" aria-live="polite">
          @if (networkOnline) {
            Seu dispositivo está online, mas o servidor não respondeu.
          } @else {
            Seu dispositivo parece estar offline. Verifique internet ou VPN.
          }
        </p>

        @if (reconnecting) {
          <div class="reconnect-status">
            <p class="reconnect-title">Tentando reconectar automaticamente...</p>
            <p class="reconnect-subtitle">Tentativas realizadas: {{ reconnectAttempts }} de 3</p>
            <p class="reconnect-subtitle">Próxima tentativa em {{ countdown }}s</p>
          </div>
        }

        @if (reconnectExhausted) {
          <div class="troubleshooting-card">
            <p class="troubleshooting-title">Não foi possível reconectar após 3 tentativas.</p>
            <ul class="troubleshooting-list">
              <li>Verifique se sua internet está funcionando.</li>
              <li>Confirme se sua VPN corporativa está conectada.</li>
              <li>Atualize a página e tente novamente.</li>
              @if (!isProduction) {
                <li>Em ambiente local, confirme se o backend está em execução.</li>
              }
            </ul>
            <p class="troubleshooting-support">
              Se o problema persistir por alguns minutos, entre em contato com o suporte.
            </p>
            @if (diagnosticCode) {
              <div class="diagnostic-box">
                <p class="diagnostic-label">Código de diagnóstico</p>
                <p class="diagnostic-code">{{ diagnosticCode }}</p>
                <button pButton type="button" label="Copiar diagnóstico" icon="pi pi-copy" severity="secondary" [outlined]="true" (click)="onCopyDiagnostic()"></button>
              </div>
            }
          </div>
        }

        <div class="connection-actions">
          <div class="connection-actions__buttons">
            <button pButton type="button" label="Tentar novamente agora" icon="pi pi-refresh" severity="secondary" [outlined]="true" (click)="onRetry()"></button>
            <button pButton type="button" label="Recarregar página" icon="pi pi-replay" severity="secondary" [outlined]="true" (click)="onReload()"></button>
            <button pButton type="button" label="Contatar suporte" icon="pi pi-envelope" severity="secondary" [outlined]="true" (click)="onContactSupport()"></button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .connection-error-screen {
      border: 2px solid var(--p-red-200);
      border-radius: 12px;
      background: linear-gradient(135deg, var(--p-red-50) 0%, rgba(248, 113, 113, 0.05) 100%);
    }
    .connection-error-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
      padding: 3rem 2rem;
    }
    .connection-error-content i { color: var(--p-red-500); opacity: 0.8; font-size: 2.5rem; }
    .connection-error-content h2 { margin: 0; color: var(--p-surface-900); font-size: 1.5rem; font-weight: 600; }
    .connection-error-content p { margin: 0; color: var(--p-surface-600); }
    .connection-status { font-size: 0.95rem; color: var(--p-surface-700); max-width: 52ch; }
    .reconnect-status { margin-top: 1rem; padding: 1rem 1.5rem; border-radius: 10px; background: var(--p-primary-50); border: 1px solid var(--p-primary-200); }
    .reconnect-title { margin: 0 0 0.5rem 0; color: var(--p-surface-900); font-weight: 600; }
    .reconnect-subtitle { margin: 0.25rem 0; font-size: 0.85rem; color: var(--p-surface-700); }
    .troubleshooting-card { margin-top: 1.5rem; padding: 1.5rem; border-radius: 10px; background: white; border: 1px solid var(--p-surface-200); }
    .troubleshooting-title { margin: 0 0 1rem 0; color: var(--p-surface-900); font-weight: 600; }
    .troubleshooting-list { margin: 0 0 1rem 0; padding-left: 1.5rem; color: var(--p-surface-700); font-size: 0.9rem; }
    .troubleshooting-list li { margin: 0.5rem 0; }
    .troubleshooting-support { margin: 0; font-size: 0.85rem; color: var(--p-surface-600); font-style: italic; }
    .diagnostic-box { margin-top: 1rem; padding: 1rem; background: var(--p-surface-50); border-radius: 8px; border: 1px solid var(--p-surface-200); }
    .diagnostic-label { margin: 0 0 0.5rem 0; font-weight: 600; color: var(--p-surface-900); font-size: 0.85rem; }
    .diagnostic-code { margin: 0 0 1rem 0; padding: 0.75rem; background: white; border: 1px dashed var(--p-surface-300); border-radius: 6px; font-size: 0.8rem; color: var(--p-primary-600); word-break: break-all; }
    .connection-actions { margin-top: 1.5rem; }
    .connection-actions__buttons { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
  `]
})
export class ConnectionErrorComponent {
  @Input() errorMessage = '';
  @Input() networkOnline = true;
  @Input() reconnecting = false;
  @Input() reconnectAttempts = 0;
  @Input() reconnectExhausted = false;
  @Input() countdown = 0;
  @Input() diagnosticCode = '';
  @Input() isProduction = false;

  @Output() readonly retry = new EventEmitter<void>();
  @Output() readonly reload = new EventEmitter<void>();
  @Output() readonly contactSupport = new EventEmitter<void>();
  @Output() readonly copyDiagnostic = new EventEmitter<void>();

  onRetry(): void { this.retry.emit(); }
  onReload(): void { this.reload.emit(); }
  onContactSupport(): void { this.contactSupport.emit(); }
  onCopyDiagnostic(): void { this.copyDiagnostic.emit(); }
}
