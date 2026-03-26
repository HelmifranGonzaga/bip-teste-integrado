import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
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
  @Output() transfer = new EventEmitter<TransferBeneficioEvent>();
  @Output() cancelTransfer = new EventEmitter<void>();

  form = this.fb.group({
    fromId: [null as number | null, [Validators.required]],
    toId: [null as number | null, [Validators.required]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]]
  });

  onSubmit() {
    if (this.form.valid) {
      this.transfer.emit(
        this.form.getRawValue() as { fromId: number; toId: number; amount: number }
      );
      this.form.reset({ fromId: null, toId: null, amount: null });
    }
  }

  onCancel() {
    this.form.reset({ fromId: null, toId: null, amount: null });
    this.cancelTransfer.emit();
  }
}
