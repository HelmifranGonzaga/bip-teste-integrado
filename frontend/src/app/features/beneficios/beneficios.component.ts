import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { finalize, Observable } from 'rxjs';

import { Beneficio, Page } from '../../core/models/beneficio.model';
import { CONNECTION_ERROR_MESSAGE } from '../../core/errors/error-messages';
import { LoadingService } from '../../core/services/loading.service';
import { ReconnectionService } from '../../core/services/reconnection.service';
import { BeneficioStateService } from '../../core/services/beneficio-state.service';
import { environment } from '../../../environments/environment';

import { BeneficiosFacade } from './beneficios.facade';
import { SaveBeneficioEvent, TransferBeneficioEvent } from './beneficios.types';
import { BeneficioFormComponent } from './components/beneficio-form/beneficio-form.component';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';
import { BeneficioTransferComponent } from './components/beneficio-transfer/beneficio-transfer.component';
import { ConnectionErrorComponent } from '../../shared/ui/connection-error/connection-error.component';
import { PageActionsComponent } from '../../shared/ui/page-actions/page-actions.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-beneficios',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    BeneficioFormComponent,
    BeneficioTransferComponent,
    BeneficioListComponent,
    ConnectionErrorComponent,
    PageActionsComponent,
    PageHeaderComponent,
  ],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './beneficios.component.html',
  styleUrl: './beneficios.component.css'
})
export class BeneficiosComponent {
  private readonly facade = inject(BeneficiosFacade);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly stateService = inject(BeneficioStateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly loadingService = inject(LoadingService);
  readonly reconnectionService = inject(ReconnectionService);

  private readonly supportEmail = 'suporte@bip.com.br';

  beneficios = signal<Beneficio[]>([]);
  editingBeneficio = signal<Beneficio | null>(null);
  errorMessage = signal<string>(CONNECTION_ERROR_MESSAGE);
  connectionError = signal<boolean>(false);

  showFormModal = signal<boolean>(false);
  showTransferModal = signal<boolean>(false);

  totalRecords = signal<number>(0);
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  lazyMode = signal<boolean>(true);

  readonly isProduction = environment.production;

  constructor() {
    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener('online', () => this.reconnectionService.setOnline(true));
      globalThis.window.addEventListener('offline', () => this.reconnectionService.setOnline(false));
    }

    this.destroyRef.onDestroy(() => {
      this.reconnectionService.reset();
      if (globalThis.window !== undefined) {
        globalThis.window.removeEventListener('online', () => this.reconnectionService.setOnline(true));
        globalThis.window.removeEventListener('offline', () => this.reconnectionService.setOnline(false));
      }
    });

    this.loadBeneficios();

    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['action'] === 'transferir') {
        setTimeout(() => this.openTransfer());
      }
    });
  }

  private clearActionParam(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  loadBeneficios(): void {
    this.execute(
      this.facade.list(),
      (items) => {
        this.beneficios.set(items);
        this.totalRecords.set(items.length);
        this.stateService.updateCount(items.length);
        this.clearConnectionError();
      },
      true
    );
  }

  loadBeneficiosPaginated(page: number, size: number): void {
    this.currentPage.set(page);
    this.pageSize.set(size);
    this.execute(
      this.facade.listPaginated(page, size),
      (result: Page<Beneficio>) => {
        this.beneficios.set(result.content);
        this.totalRecords.set(result.totalElements);
        this.stateService.updateCount(result.totalElements);
        this.clearConnectionError();
      },
      true
    );
  }

  onLazyLoad(event: { page: number; size: number }): void {
    this.loadBeneficiosPaginated(event.page, event.size);
  }

  exportCsv(): void {
    this.execute(this.facade.exportCsv(), (csv) => {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beneficios-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.messageService.add({
        severity: 'success',
        summary: 'Exportado',
        detail: 'CSV exportado com sucesso!'
      });
    });
  }

  retryNow(): void {
    if (this.reconnectionService.reconnectExhausted()) {
      this.reconnectionService.reset();
      this.startReconnect();
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

  onCopyDiagnostic(): void {
    const code = this.reconnectionService.diagnosticCode();
    const payload = `Codigo: ${code} | Tentativas: ${this.reconnectionService.reconnectAttempts()} | Online: ${this.reconnectionService.networkOnline() ? 'sim' : 'nao'}`;
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(payload).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Diagnóstico copiado para a área de transferência.', life: 3500 });
    }).catch(() => {
      this.messageService.add({ severity: 'warn', summary: 'Não foi possível copiar', detail: 'Copie manualmente o código de diagnóstico.', life: 3500 });
    });
  }

  onSave(event: SaveBeneficioEvent): void {
    this.execute(this.facade.save(event), () => {
      this.editingBeneficio.set(null);
      this.showFormModal.set(false);
      this.clearActionParam();
      this.loadBeneficios();
    });
  }

  onFormModalHide(): void {
    this.showFormModal.set(false);
    this.clearActionParam();
  }

  openNew(): void {
    if (this.loadingService.loading() || this.connectionError()) return;
    this.router.navigate(['/beneficios/novo']);
  }

  onEdit(item: Beneficio): void {
    if (this.loadingService.loading()) return;
    this.editingBeneficio.set(item);
    this.showFormModal.set(true);
  }

  onCancelEdit(): void {
    this.editingBeneficio.set(null);
    this.showFormModal.set(false);
    this.clearActionParam();
  }

  onTransferModalHide(): void {
    this.showTransferModal.set(false);
    this.clearActionParam();
  }

  openTransfer(): void {
    if (this.loadingService.loading() || this.connectionError()) return;
    this.showTransferModal.set(true);
  }

  onCancelTransfer(): void {
    this.showTransferModal.set(false);
    this.clearActionParam();
  }

  onRemove(id: number): void {
    if (this.loadingService.loading()) return;
    const beneficio = this.beneficios().find((b) => b.id === id);
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir o benefício "${beneficio?.nome}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.confirmDelete(id)
    });
  }

  private confirmDelete(id: number): void {
    this.execute(this.facade.remove(id), () => this.loadBeneficios());
  }

  onTransfer(payload: TransferBeneficioEvent): void {
    this.execute(this.facade.transfer(payload), () => {
      this.showTransferModal.set(false);
      this.clearActionParam();
      this.loadBeneficios();
    });
  }

  private execute<T>(
    request$: Observable<T>,
    onSuccess: (result: T) => void,
    isInitialLoad = false
  ): void {
    this.loadingService.begin();
    request$.pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadingService.end())
    ).subscribe({
      next: onSuccess,
      error: (error) => this.handleRequestError(error, isInitialLoad)
    });
  }

  private handleRequestError(error: { status?: number }, isInitialLoad: boolean): void {
    if (error.status === 0) {
      if (isInitialLoad) {
        this.connectionError.set(true);
        this.errorMessage.set(CONNECTION_ERROR_MESSAGE);
        this.reconnectionService.reset();
        this.startReconnect();
      }
      return;
    }
    if (isInitialLoad) this.clearConnectionError();
  }

  private clearConnectionError(): void {
    this.connectionError.set(false);
    this.reconnectionService.reset();
  }

  private startReconnect(): void {
    this.reconnectionService.start(() => this.loadBeneficios());
  }

  private tryReconnect(): void {
    this.reconnectionService.reset();
    this.startReconnect();
    this.loadBeneficios();
  }
}
