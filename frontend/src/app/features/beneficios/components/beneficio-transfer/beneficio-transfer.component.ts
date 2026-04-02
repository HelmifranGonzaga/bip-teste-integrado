import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { TransferBeneficioEvent } from '../../beneficios.types';

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
  templateUrl: './beneficio-transfer.component.html'
})
export class BeneficioTransferComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  @Input() beneficios: Beneficio[] = [];
  @Input() submitting = false;
  @Output() transfer = new EventEmitter<TransferBeneficioEvent>();
  @Output() cancelTransfer = new EventEmitter<void>();

  form = this.fb.group(
    {
      fromId: [null as number | null, [Validators.required, Validators.min(1)]],
      toId: [null as number | null, [Validators.required, Validators.min(1)]],
      amount: [null as number | null, [Validators.required, Validators.min(0.01)]]
    },
    { validators: [this.sameBeneficioValidator] }
  );

  getBeneficioLabel(beneficio: Beneficio): string {
    return `${beneficio.nome} (#${beneficio.id}) - ${this.currencyFormatter.format(beneficio.valor)}`;
  }

  onSubmit(): void {
    if (this.canSubmit()) {
      this.transfer.emit(this.form.getRawValue() as TransferBeneficioEvent);
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancelTransfer.emit();
  }

  private canSubmit(): boolean {
    return this.form.valid && !this.submitting;
  }

  private resetForm(): void {
    this.form.reset({ fromId: null, toId: null, amount: null });
  }

  private sameBeneficioValidator(control: AbstractControl): ValidationErrors | null {
    const fromId = control.get('fromId')?.value;
    const toId = control.get('toId')?.value;

    if (fromId && toId && fromId === toId) {
      return { sameBeneficio: true };
    }

    return null;
  }
}
