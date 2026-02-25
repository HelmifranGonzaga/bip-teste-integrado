import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';

@Component({
  selector: 'app-beneficio-transfer',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputNumberModule, 
    CardModule, 
    FluidModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <p-fluid>
        <div class="field mb-3">
          <label for="fromId" class="block mb-2">ID Origem</label>
          <p-inputNumber inputId="fromId" formControlName="fromId" [useGrouping]="false" placeholder="ID Origem"></p-inputNumber>
          @if (form.get('fromId')!.invalid && form.get('fromId')!.touched) {
            <small class="text-red-500">ID de origem é obrigatório.</small>
          }
        </div>
        
        <div class="field mb-3">
          <label for="toId" class="block mb-2">ID Destino</label>
          <p-inputNumber inputId="toId" formControlName="toId" [useGrouping]="false" placeholder="ID Destino"></p-inputNumber>
          @if (form.get('toId')!.invalid && form.get('toId')!.touched) {
            <small class="text-red-500">ID de destino é obrigatório.</small>
          }
        </div>
        
        <div class="field mb-4">
          <label for="amount" class="block mb-2">Valor</label>
          <p-inputNumber inputId="amount" formControlName="amount" mode="currency" currency="BRL" locale="pt-BR" placeholder="R$ 0,00" [minFractionDigits]="2" [maxFractionDigits]="2"></p-inputNumber>
          @if (form.get('amount')!.invalid && form.get('amount')!.touched) {
            <small class="text-red-500">
              @if (form.get('amount')!.hasError('required')) { Valor é obrigatório. }
              @else if (form.get('amount')!.hasError('min')) { Valor deve ser maior que zero. }
            </small>
          }
        </div>
      </p-fluid>

      <div class="flex gap-2 mt-4 justify-end">
        <p-button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" (onClick)="onCancel()"></p-button>
        <p-button type="submit" label="Transferir" icon="pi pi-arrow-right-arrow-left" severity="info" [disabled]="form.invalid"></p-button>
      </div>
    </form>
  `
})
export class BeneficioTransferComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  @Output() transfer = new EventEmitter<{ fromId: number; toId: number; amount: number }>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
    fromId: [null as number | null, [Validators.required]],
    toId: [null as number | null, [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]]
  });

  onSubmit() {
    if (this.form.valid) {
      this.transfer.emit(this.form.getRawValue() as { fromId: number; toId: number; amount: number });
      this.form.reset({ fromId: null, toId: null, amount: null });
    }
  }

  onCancel() {
    this.form.reset({ fromId: null, toId: null, amount: null });
    this.cancel.emit();
  }
}
