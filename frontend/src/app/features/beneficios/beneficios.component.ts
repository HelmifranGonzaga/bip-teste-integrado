import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { finalize, Observable } from 'rxjs';

import { CONNECTION_ERROR_MESSAGE } from '../../core/errors/error-messages';
import { Beneficio } from '../../core/models/beneficio.model';
import { environment } from '../../../environments/environment';
import { BeneficiosFacade } from './beneficios.facade';
import { SaveBeneficioEvent, TransferBeneficioEvent } from './beneficios.types';
import { BeneficioFormComponent } from './components/beneficio-form/beneficio-form.component';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';
import { BeneficioTransferComponent } from './components/beneficio-transfer/beneficio-transfer.component';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [
    CommonModule,
    MessageModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule,
    BeneficioFormComponent,
    BeneficioTransferComponent,
    BeneficioListComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './beneficios.component.html',
  styleUrl: './beneficios.component.css'
})
export class BeneficiosComponent implements OnInit {
  @ViewChild('connectionErrorTitle') connectionErrorTitle?: ElementRef<HTMLHeadingElement>;

  private readonly facade = inject(BeneficiosFacade);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reconnectDelayMs = 5000;
  private readonly loadingShowDelayMs = 200;
  private readonly loadingMinVisibleMs = 600;
  private readonly maxReconnectAttempts = 3;
  private readonly supportEmail = 'suporte@sicoob.com.br';
  private readonly onBrowserOnline = () => {
    this.networkOnline.set(true);
    this.updateDiagnosticCode();
  };
  private readonly onBrowserOffline = () => {
    this.networkOnline.set(false);
    this.updateDiagnosticCode();
  };
  private reconnectTimerId: ReturnType<typeof setInterval> | null = null;
  private reconnectCountdownTimerId: ReturnType<typeof setInterval> | null = null;
  private loadingShowTimerId: ReturnType<typeof setTimeout> | null = null;
  private loadingHideTimerId: ReturnType<typeof setTimeout> | null = null;
  private loadingVisibleSince = 0;
  private pendingRequests = 0;
  private hasFocusedConnectionError = false;

  beneficios = signal<Beneficio[]>([]);
  editingBeneficio = signal<Beneficio | null>(null);
  errorMessage = signal<string>('');
  connectionError = signal<boolean>(false);
  reconnecting = signal<boolean>(false);
  reconnectAttempts = signal<number>(0);
  reconnectExhausted = signal<boolean>(false);
  reconnectCountdownSeconds = signal<number>(0);
  networkOnline = signal<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine);
  diagnosticCode = signal<string>('');
  loading = signal<boolean>(false);
  uiLoading = signal<boolean>(false);

  showFormModal = signal<boolean>(false);
  showTransferModal = signal<boolean>(false);

  readonly isProduction = environment.production;

  constructor() {
    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener('online', this.onBrowserOnline);
      globalThis.window.addEventListener('offline', this.onBrowserOffline);
    }

    this.destroyRef.onDestroy(() => {
      this.stopReconnectLoop();
      this.clearLoadingTimers();

      if (globalThis.window !== undefined) {
        globalThis.window.removeEventListener('online', this.onBrowserOnline);
        globalThis.window.removeEventListener('offline', this.onBrowserOffline);
      }
    });
  }

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.execute(this.facade.list(), (items) => {
      this.beneficios.set(items);
      this.clearConnectionError();
    });
  }

  retryNow(): void {
    if (this.reconnectExhausted()) {
      this.reconnectAttempts.set(0);
      this.reconnectExhausted.set(false);
      this.startReconnectLoop();
    }
    this.tryReconnect();
  }

  reloadPage(): void {
    if (globalThis.window !== undefined) {
      globalThis.window.location.reload();
    }
  }

  openSupportContact(): void {
    if (globalThis.window !== undefined) {
      globalThis.window.location.href = `mailto:${this.supportEmail}?subject=Falha%20de%20conexao%20-%20Desafio%20BIP`;
    }
  }

  async copyDiagnosticCode(): Promise<void> {
    const payload = `Codigo: ${this.diagnosticCode()} | Tentativas: ${this.reconnectAttempts()} | Online: ${this.networkOnline() ? 'sim' : 'nao'}`;

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(payload);
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'Diagnóstico copiado para a área de transferência.',
        life: 3500
      });
    } catch {
      this.messageService.add({
        severity: 'warn',
        summary: 'Não foi possível copiar',
        detail: 'Copie manualmente o código de diagnóstico.',
        life: 3500
      });
    }
  }

  onSave(event: SaveBeneficioEvent): void {
    this.execute(this.facade.save(event), () => {
      this.editingBeneficio.set(null);
      this.showFormModal.set(false);
      this.loadBeneficios();
    });
  }

  openNew(): void {
    if (this.loading()) {
      return;
    }
    this.editingBeneficio.set(null);
    this.showFormModal.set(true);
  }

  onEdit(item: Beneficio): void {
    if (this.loading()) {
      return;
    }
    this.editingBeneficio.set(item);
    this.showFormModal.set(true);
  }

  onCancelEdit(): void {
    this.editingBeneficio.set(null);
    this.showFormModal.set(false);
  }

  openTransfer(): void {
    if (this.loading()) {
      return;
    }
    this.showTransferModal.set(true);
  }

  onCancelTransfer(): void {
    this.showTransferModal.set(false);
  }

  onRemove(id: number): void {
    if (this.loading()) {
      return;
    }
    const beneficio = this.beneficios().find((b) => b.id === id);

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o benefício "${beneficio?.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.confirmDelete(id);
      }
    });
  }

  private confirmDelete(id: number): void {
    this.execute(this.facade.remove(id), () => this.loadBeneficios());
  }

  onTransfer(payload: TransferBeneficioEvent): void {
    this.execute(this.facade.transfer(payload), () => {
      this.showTransferModal.set(false);
      this.loadBeneficios();
    });
  }

  private execute<T>(request$: Observable<T>, onSuccess: (result: T) => void): void {
    this.beginRequestLoading();

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.endRequestLoading())
      )
      .subscribe({
        next: onSuccess,
        error: (error) => {
          this.handleRequestError(error);
        }
      });
  }

  private handleRequestError(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.connectionError.set(true);
      this.errorMessage.set('Não conseguimos conexão com o servidor no momento.');
      this.updateDiagnosticCode();
      this.focusConnectionErrorTitle();

      if (this.reconnectAttempts() >= this.maxReconnectAttempts) {
        this.reconnectExhausted.set(true);
        this.stopReconnectLoop();
        this.trackConnectionEvent('reconnect_exhausted');
        return;
      }

      this.startReconnectLoop();
      this.trackConnectionEvent('connection_error_shown');
      return;
    }

    this.clearConnectionError();
  }

  private clearConnectionError(): void {
    this.connectionError.set(false);
    this.errorMessage.set(CONNECTION_ERROR_MESSAGE);
    this.reconnectExhausted.set(false);
    this.stopReconnectLoop();
    this.reconnectAttempts.set(0);
    this.diagnosticCode.set('');
    this.hasFocusedConnectionError = false;
  }

  private startReconnectLoop(): void {
    if (this.reconnectTimerId) {
      return;
    }

    this.reconnecting.set(true);
    this.reconnectCountdownSeconds.set(this.getReconnectDelaySeconds());
    this.startReconnectCountdown();

    this.reconnectTimerId = setInterval(() => {
      this.tryReconnect();
    }, this.reconnectDelayMs);
  }

  private stopReconnectLoop(): void {
    if (this.reconnectTimerId) {
      clearInterval(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }

    if (this.reconnectCountdownTimerId) {
      clearInterval(this.reconnectCountdownTimerId);
      this.reconnectCountdownTimerId = null;
    }

    this.reconnectCountdownSeconds.set(0);
    this.reconnecting.set(false);
  }

  private tryReconnect(): void {
    if (!this.connectionError()) {
      return;
    }

    if (this.reconnectAttempts() >= this.maxReconnectAttempts) {
      this.reconnectExhausted.set(true);
      this.stopReconnectLoop();
      this.trackConnectionEvent('reconnect_exhausted');
      return;
    }

    this.reconnectAttempts.update((attempts) => attempts + 1);
    this.reconnectCountdownSeconds.set(this.getReconnectDelaySeconds());
    this.updateDiagnosticCode();
    this.trackConnectionEvent('reconnect_attempt');
    this.loadBeneficios();
  }

  private startReconnectCountdown(): void {
    if (this.reconnectCountdownTimerId) {
      clearInterval(this.reconnectCountdownTimerId);
    }

    this.reconnectCountdownTimerId = setInterval(() => {
      const next = this.reconnectCountdownSeconds() - 1;
      this.reconnectCountdownSeconds.set(Math.max(next, 0));
    }, 1000);
  }

  private getReconnectDelaySeconds(): number {
    return this.reconnectDelayMs / 1000;
  }

  private updateDiagnosticCode(): void {
    const code = `BIP-CONN-${Date.now()}-A${this.reconnectAttempts()}-${this.networkOnline() ? 'ON' : 'OFF'}`;
    this.diagnosticCode.set(code);
  }

  private focusConnectionErrorTitle(): void {
    if (this.hasFocusedConnectionError) {
      return;
    }

    this.hasFocusedConnectionError = true;
    setTimeout(() => {
      this.connectionErrorTitle?.nativeElement.focus();
    });
  }

  private trackConnectionEvent(eventName: string): void {
    if (!environment.production) {
      console.info('[connection-event]', eventName, {
        attempts: this.reconnectAttempts(),
        online: this.networkOnline(),
        exhausted: this.reconnectExhausted()
      });
    }
  }

  private beginRequestLoading(): void {
    this.pendingRequests += 1;
    this.loading.set(true);

    if (this.pendingRequests > 1) {
      return;
    }

    if (this.loadingHideTimerId) {
      clearTimeout(this.loadingHideTimerId);
      this.loadingHideTimerId = null;
    }

    if (this.uiLoading()) {
      return;
    }

    this.loadingShowTimerId = setTimeout(() => {
      this.loadingShowTimerId = null;

      if (this.pendingRequests > 0) {
        this.loadingVisibleSince = Date.now();
        this.uiLoading.set(true);
      }
    }, this.loadingShowDelayMs);
  }

  private endRequestLoading(): void {
    if (this.pendingRequests === 0) {
      return;
    }

    this.pendingRequests -= 1;

    if (this.pendingRequests > 0) {
      return;
    }

    this.loading.set(false);

    if (this.loadingShowTimerId) {
      clearTimeout(this.loadingShowTimerId);
      this.loadingShowTimerId = null;
      return;
    }

    if (!this.uiLoading()) {
      return;
    }

    const elapsed = Date.now() - this.loadingVisibleSince;
    const remaining = Math.max(this.loadingMinVisibleMs - elapsed, 0);

    if (remaining === 0) {
      this.uiLoading.set(false);
      return;
    }

    this.loadingHideTimerId = setTimeout(() => {
      this.loadingHideTimerId = null;

      if (this.pendingRequests === 0) {
        this.uiLoading.set(false);
      }
    }, remaining);
  }

  private clearLoadingTimers(): void {
    if (this.loadingShowTimerId) {
      clearTimeout(this.loadingShowTimerId);
      this.loadingShowTimerId = null;
    }

    if (this.loadingHideTimerId) {
      clearTimeout(this.loadingHideTimerId);
      this.loadingHideTimerId = null;
    }
  }
}
