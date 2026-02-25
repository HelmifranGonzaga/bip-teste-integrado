import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Beneficio, BeneficioPayload } from '../../../../core/models/beneficio.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';

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
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
      <p-fluid>
        <div class="field mb-3">
          <label for="nome" class="block mb-2">Nome</label>
          <input pInputText id="nome" formControlName="nome" placeholder="Nome" />
          @if (form.get('nome')!.invalid && form.get('nome')!.touched) {
            <small class="text-red-500">Nome é obrigatório.</small>
          }
        </div>
        
        <div class="field mb-3">
          <label for="valor" class="block mb-2">Valor</label>
          <p-inputNumber inputId="valor" formControlName="valor" mode="currency" currency="BRL" locale="pt-BR" placeholder="R$ 0,00" [minFractionDigits]="2" [maxFractionDigits]="2"></p-inputNumber>
          @if (form.get('valor')!.invalid && form.get('valor')!.touched) {
            <small class="text-red-500">
              @if (form.get('valor')!.hasError('required')) { Valor é obrigatório. }
              @else if (form.get('valor')!.hasError('min')) { Valor deve ser maior ou igual a zero. }
            </small>
          }
        </div>
        
        <div class="field mb-3">
          <label for="descricao" class="block mb-2">Descrição</label>
          <textarea pTextarea id="descricao" formControlName="descricao" rows="3" placeholder="Descrição"></textarea>
        </div>
        
        <div class="field-checkbox mb-4 flex items-center gap-2">
          <p-checkbox inputId="ativo" formControlName="ativo" [binary]="true"></p-checkbox>
          <label for="ativo">Ativo</label>
        </div>
      </p-fluid>

      <div class="flex gap-2 mt-4 justify-end">
        <p-button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" (onClick)="onCancel()"></p-button>
        <p-button type="submit" [label]="editingBeneficio ? 'Atualizar' : 'Criar'" icon="pi pi-check"></p-button>
      </div>
    </form>
  `
})
export class BeneficioFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  
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
  get editingBeneficio(): Beneficio | null { return this._editingBeneficio; }
  private _editingBeneficio: Beneficio | null = null;

  @Output() save = new EventEmitter<{ id: number | null, payload: BeneficioPayload }>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.group({
    nome: ['', [Validators.required]],
    descricao: [''],
    valor: [null as number | null, [Validators.required, Validators.min(0)]],
    ativo: [true, [Validators.required]]
  });

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.save.emit({
        id: this.editingBeneficio?.id ?? null,
        payload: this.form.getRawValue() as BeneficioPayload
      });
      if (!this.editingBeneficio) {
        this.form.reset({ nome: '', descricao: '', valor: null, ativo: true });
      }
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
