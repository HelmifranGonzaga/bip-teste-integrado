import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { Beneficio, BeneficioPayload } from '../../../../core/models/beneficio.model';
import { formatCnpjMasked, normalizeCnpjAlfanumerico } from '../../../../core/utils/cnpj-alfanumerico';
import { cnpjAlfanumericoOpcionalValidator } from '../../../../core/validators/cnpj-alfanumerico.validator';
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
  private readonly cdr = inject(ChangeDetectorRef);
  @Input() readonly submitting = false;

  @Input() set editingBeneficio(val: Beneficio | null) {
    const isSameBeneficio = val && this._editingBeneficio?.id === val.id;
    if (isSameBeneficio) {
      return;
    }
    this._editingBeneficio = val;
    if (val) {
      const cnpjDisplay = val.cnpj
        ? formatCnpjMasked(normalizeCnpjAlfanumerico(val.cnpj))
        : '';
      this.form.setValue({
        nome: val.nome,
        descricao: val.descricao ?? '',
        valor: val.valor,
        ativo: val.ativo,
        cnpj: cnpjDisplay
      });
    } else {
      this.form.reset({ nome: '', descricao: '', valor: null, ativo: true, cnpj: '' });
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
    ativo: [true, [Validators.required]],
    cnpj: ['', [cnpjAlfanumericoOpcionalValidator()]]
  });

  onCnpjInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    const ctrl = this.form.get('cnpj');
    if (!ctrl) {
      return;
    }
    const raw = String(ctrl.value ?? '');
    const pos = el.selectionStart ?? raw.length;
    const sigBefore = normalizeCnpjAlfanumerico(raw.slice(0, pos)).length;
    const norm = normalizeCnpjAlfanumerico(raw).slice(0, 14);
    const formatted = formatCnpjMasked(norm);
    if (formatted !== raw) {
      ctrl.setValue(formatted, { emitEvent: true });
      let idx = 0;
      let counted = 0;
      while (idx < formatted.length && counted < sigBefore) {
        const ch = formatted.charAt(idx);
        if (/[0-9A-Z]/.test(ch)) {
          counted++;
        }
        idx++;
      }
      this.cdr.markForCheck();
      requestAnimationFrame(() => {
        try {
          el.setSelectionRange(idx, idx);
        } catch {
          /* ignore */
        }
      });
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid && !this.submitting) {
      this.save.emit({
        id: this.editingBeneficio?.id ?? null,
        payload: this.buildPayload()
      });
      if (!this.editingBeneficio) {
        this.form.reset({ nome: '', descricao: '', valor: null, ativo: true, cnpj: '' });
      }
    }
  }

  private buildPayload(): BeneficioPayload {
    const v = this.form.getRawValue();
    const trimmed = (v.cnpj ?? '').trim();
    // O backend persiste sem máscara (apenas alfanuméricos em caixa alta).
    // Enviamos já normalizado para manter a request idempotente com o storage.
    const cnpj = trimmed === '' ? null : normalizeCnpjAlfanumerico(trimmed);
    return {
      nome: v.nome,
      descricao: v.descricao,
      valor: v.valor!,
      ativo: v.ativo,
      cnpj
    };
  }

  onCancel(): void {
    this.cancelOperation.emit();
  }
}
