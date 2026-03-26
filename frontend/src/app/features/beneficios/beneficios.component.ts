import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Beneficio } from '../../core/models/beneficio.model';
import { mapHttpError } from '../../core/errors/http-error.mapper';

import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { BeneficioFormComponent } from './components/beneficio-form/beneficio-form.component';
import { BeneficioTransferComponent } from './components/beneficio-transfer/beneficio-transfer.component';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';
import { BeneficiosFacade } from './beneficios.facade';
import { SaveBeneficioEvent, TransferBeneficioEvent } from './beneficios.types';

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
    this.facade
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.beneficios.set(items);
          this.errorMessage.set('');
          this.connectionError.set(false);
        },
        error: (error) => {
          this.handleRequestError(error, 'Erro ao carregar benefícios');
        }
      });
  }

  onSave(event: SaveBeneficioEvent): void {
    this.facade
      .save(event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.editingBeneficio.set(null);
          this.showFormModal.set(false);
          this.loadBeneficios();
        },
        error: (error) => {
          this.handleRequestError(error, 'Erro ao salvar benefício');
        }
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
    this.facade
      .remove(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadBeneficios();
        },
        error: (error) => {
          this.handleRequestError(error, 'Erro ao remover benefício');
        }
      });
  }

  onTransfer(payload: TransferBeneficioEvent): void {
    this.facade
      .transfer(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showTransferModal.set(false);
          this.loadBeneficios();
        },
        error: (error) => {
          this.handleRequestError(error, 'Erro na transferência');
        }
      });
  }

  private handleRequestError(error: HttpErrorResponse, fallbackMessage: string): void {
    const mappedError = mapHttpError(error, fallbackMessage);
    this.connectionError.set(mappedError.isConnectionError);
    this.errorMessage.set(mappedError.detail);
  }
}
