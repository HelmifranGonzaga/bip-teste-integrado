import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { Beneficio, BeneficioPayload } from '../../../../core/models/beneficio.model';
import { SaveBeneficioEvent } from '../../beneficios.types';

@Component({
  selector: 'app-beneficio-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    CheckboxModule,
    CardModule,
    FluidModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './beneficio-form.component.html'
})
export class BeneficioFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  @Input() readonly submitting = false;

  @Input() set editingBeneficio(val: Beneficio | null) {
    this._editingBeneficio = val;
    if (val) {
      this.form.setValue({
        nome: val.nome,
        descricao: val.descricao ?? '',
        valor: val.valor,
        ativo: val.ativo
      });
    } else {
      this.form.reset({ nome: '', descricao: '', valor: null, ativo: true });
    }
  }
  get editingBeneficio(): Beneficio | null {
    return this._editingBeneficio;
  }
  private _editingBeneficio: Beneficio | null = null;

  @Output() readonly save = new EventEmitter<SaveBeneficioEvent>();
  @Output() readonly cancelOperation = new EventEmitter<void>();

  readonly form = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    descricao: ['', [Validators.maxLength(500)]],
    valor: [null as number | null, [Validators.required, Validators.min(0.01)]],
    ativo: [true, [Validators.required]]
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid && !this.submitting) {
      this.save.emit({
        id: this.editingBeneficio?.id ?? null,
        payload: this.form.getRawValue() as BeneficioPayload
      });
      if (!this.editingBeneficio) {
        this.form.reset({ nome: '', descricao: '', valor: null, ativo: true });
      }
    }
  }

  onCancel(): void {
    this.cancelOperation.emit();
  }
}
