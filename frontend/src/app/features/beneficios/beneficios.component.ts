import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Beneficio, BeneficioPayload } from '../../core/models/beneficio.model';
import { BeneficioService } from '../../core/services/beneficio.service';

import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { BeneficioFormComponent } from './components/beneficio-form/beneficio-form.component';
import { BeneficioTransferComponent } from './components/beneficio-transfer/beneficio-transfer.component';
import { BeneficioListComponent } from './components/beneficio-list/beneficio-list.component';

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
  private readonly service = inject(BeneficioService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  beneficios = signal<Beneficio[]>([]);
  editingBeneficio = signal<Beneficio | null>(null);
  errorMessage = signal<string>('');

  showFormModal = signal<boolean>(false);
  showTransferModal = signal<boolean>(false);

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.service.list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.beneficios.set(items);
          this.errorMessage.set('');
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message ?? 'Erro ao carregar benefícios');
        }
      });
  }

  onSave(event: { id: number | null, payload: BeneficioPayload }): void {
    const request = event.id
      ? this.service.update(event.id, event.payload)
      : this.service.create(event.payload);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.editingBeneficio.set(null);
          this.showFormModal.set(false);
          this.loadBeneficios();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Benefício salvo com sucesso!' });
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message ?? 'Erro ao salvar benefício');
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
    const beneficio = this.beneficios().find(b => b.id === id);
    
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
    this.service.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadBeneficios();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Benefício removido com sucesso!' });
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message ?? 'Erro ao remover benefício');
        }
      });
  }

  onTransfer(payload: { fromId: number; toId: number; amount: number }): void {
    this.service.transfer(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showTransferModal.set(false);
          this.loadBeneficios();
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Transferência realizada com sucesso!' });
        },
        error: (error) => {
          this.errorMessage.set(error.error?.message ?? 'Erro na transferência');
        }
      });
  }
}
