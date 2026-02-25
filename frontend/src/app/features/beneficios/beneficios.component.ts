import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beneficio, BeneficioPayload } from '../../core/models/beneficio.model';
import { BeneficioService } from '../../core/services/beneficio.service';

// PrimeNG Imports
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

// Components
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
    BeneficioFormComponent,
    BeneficioTransferComponent,
    BeneficioListComponent
  ],
  templateUrl: './beneficios.component.html',
  styleUrl: './beneficios.component.css'
})
export class BeneficiosComponent implements OnInit {
  private readonly service = inject(BeneficioService);
  private readonly messageService = inject(MessageService);

  // Signals for state management
  beneficios = signal<Beneficio[]>([]);
  editingBeneficio = signal<Beneficio | null>(null);
  errorMessage = signal<string>('');
  
  // Modal visibility signals
  showFormModal = signal<boolean>(false);
  showTransferModal = signal<boolean>(false);

  ngOnInit(): void {
    this.loadBeneficios();
  }

  loadBeneficios(): void {
    this.service.list().subscribe({
      next: (items) => {
        this.beneficios.set(items);
        this.errorMessage.set('');
      },
      error: (error) => this.handleError(error, 'Erro ao carregar benefícios')
    });
  }

  onSave(event: { id: number | null, payload: BeneficioPayload }): void {
    const request = event.id
      ? this.service.update(event.id, event.payload)
      : this.service.create(event.payload);

    request.subscribe({
      next: () => {
        this.editingBeneficio.set(null);
        this.showFormModal.set(false);
        this.loadBeneficios();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Benefício salvo com sucesso!' });
      },
      error: (error) => this.handleError(error, 'Erro ao salvar benefício')
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
    this.service.delete(id).subscribe({
      next: () => {
        this.loadBeneficios();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Benefício removido com sucesso!' });
      },
      error: (error) => this.handleError(error, 'Erro ao remover benefício')
    });
  }

  onTransfer(payload: { fromId: number; toId: number; amount: number }): void {
    this.service.transfer(payload).subscribe({
      next: () => {
        this.showTransferModal.set(false);
        this.loadBeneficios();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Transferência realizada com sucesso!' });
      },
      error: (error) => this.handleError(error, 'Erro na transferência')
    });
  }

  private handleError(error: any, defaultMessage: string): void {
    const errorMessage = error.error?.message ?? defaultMessage;
    this.errorMessage.set(errorMessage);
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: errorMessage });
  }
}
