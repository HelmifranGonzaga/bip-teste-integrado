import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beneficio } from '../../../../core/models/beneficio.model';
import {
  CNPJ_ALLOWED_INPUT_PATTERN,
  formatCnpjMasked,
  normalizeCnpjAlfanumerico
} from '../../../../core/utils/cnpj-alfanumerico';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';

interface BeneficioRow extends Beneficio {
  cnpjNormalizado: string;
  cnpjMascarado: string;
  cnpjFiltro: string;
}

@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TooltipModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TagModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './beneficio-list.component.html',
  styleUrl: './beneficio-list.component.css'
})
export class BeneficioListComponent {
  private static readonly INVISIBLE_CHARS = /[\u200B-\u200D\uFEFF]/g;

  readonly table = viewChild.required<Table>('dt');

  private _rows: ReadonlyArray<BeneficioRow> = [];
  private _prevLength = 0;

  @Input()
  set beneficios(value: ReadonlyArray<Beneficio> | null | undefined) {
    const newLength = value?.length ?? 0;
    const dataChanged = newLength !== this._prevLength;
    this._prevLength = newLength;

    this._rows = (value ?? []).map((b) => {
      const normalizado = b.cnpj ? normalizeCnpjAlfanumerico(b.cnpj) : '';
      const mascarado = normalizado ? formatCnpjMasked(normalizado) : '';
      const bruto = (b.cnpj ?? '').trim().replace(/\s+/g, '');
      const cnpjFiltro = BeneficioListComponent.buildCnpjFiltro(normalizado, mascarado, bruto);
      return {
        ...b,
        cnpjNormalizado: normalizado,
        cnpjMascarado: mascarado,
        cnpjFiltro
      };
    });

    if (dataChanged && this.table()) {
      setTimeout(() => this.table()?.sortSingle(), 0);
    }
  }
  get beneficios(): ReadonlyArray<BeneficioRow> {
    return this._rows;
  }

  @Input() readonly loading = false;
  @Input() totalRecords = 0;
  @Input() lazy = false;
  @Output() readonly edit = new EventEmitter<Beneficio>();
  @Output() readonly remove = new EventEmitter<number>();
  @Output() readonly lazyLoad = new EventEmitter<{ page: number; size: number }>();

  first = 0;
  rows = 10;

  getEditLabel(item: Beneficio): string {
    return `Editar beneficio ${item.nome}`;
  }

  getRemoveLabel(item: Beneficio): string {
    return `Excluir beneficio ${item.nome}`;
  }

  onLazyLoad(event: { first?: number; rows?: number }): void {
    if (!this.lazy) return;
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    const page = Math.floor(this.first / this.rows);
    this.lazyLoad.emit({ page, size: this.rows });
  }

onGlobalFilter(table: Table, event: Event): void {
     if (this.lazy) return;
     const raw = (event.target as HTMLInputElement | null)?.value ?? '';
     const cleaned = raw.replace(BeneficioListComponent.INVISIBLE_CHARS, '');
     const trimmed = cleaned.trim();
     let term = cleaned;
     if (trimmed && CNPJ_ALLOWED_INPUT_PATTERN.test(trimmed)) {
       const n = normalizeCnpjAlfanumerico(trimmed);
       if (n.length >= 3) {
         const hasDigit = /\d/.test(n);
         const hasLetter = /[A-Z]/i.test(n);
         if ((hasDigit && hasLetter) || (/^\d+$/.test(n) && n.length >= 8)) {
           term = n;
         }
       }
     }
     table.filterGlobal(term, 'contains');
   }

  private static buildCnpjFiltro(normalizado: string, mascarado: string, bruto: string): string {
    const parts = new Set<string>();
    if (normalizado) {
      parts.add(normalizado);
    }
    if (mascarado) {
      parts.add(mascarado);
    }
    if (bruto) {
      parts.add(bruto);
    }
    return [...parts].join(' ');
  }
}
