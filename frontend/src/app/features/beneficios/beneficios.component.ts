import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';

import { CONNECTION_ERROR_MESSAGE } from '../../core/errors/error-messages';
import { Beneficio } from '../../core/models/beneficio.model';
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
  private readonly facade = inject(BeneficiosFacade);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  beneficios = signal<Beneficio[]>([]);
  editingBeneficio = signal<Beneficio | null>(null);
  errorMessage = signal<string>('');
  connectionError = signal<boolean>(false);

  showFormModal = signal<boolean>(false);
  showTransferModal = signal<boolean>(false);

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.execute(this.facade.list(), (items) => {
      this.beneficios.set(items);
      this.clearConnectionError();
    });
  }

  onSave(event: SaveBeneficioEvent): void {
    this.execute(this.facade.save(event), () => {
      this.editingBeneficio.set(null);
      this.showFormModal.set(false);
      this.loadBeneficios();
    });
  }

  openNew(): void {
    this.editingBeneficio.set(null);
    this.showFormModal.set(true);
  }

  onEdit(item: Beneficio): void {
    this.editingBeneficio.set(item);
    this.showFormModal.set(true);
  }

  onCancelEdit(): void {
    this.editingBeneficio.set(null);
    this.showFormModal.set(false);
  }

  openTransfer(): void {
    this.showTransferModal.set(true);
  }

  onCancelTransfer(): void {
    this.showTransferModal.set(false);
  }

  onRemove(id: number): void {
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
    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: onSuccess,
      error: (error) => {
        this.handleRequestError(error);
      }
    });
  }

  private handleRequestError(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.connectionError.set(true);
      this.errorMessage.set(CONNECTION_ERROR_MESSAGE);
      return;
    }

    this.clearConnectionError();
  }

  private clearConnectionError(): void {
    this.connectionError.set(false);
    this.errorMessage.set('');
  }
}
