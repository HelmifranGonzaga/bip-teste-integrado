import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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

interface BeneficioRow extends Beneficio {
  // Campos virtuais para o filtro global da tabela:
  //   cnpjNormalizado — alfanumérico puro (formato persistido); casa quando o usuário digita sem máscara
  //   cnpjMascarado   — formato XX.XXX.XXX/XXXX-XX; casa quando o usuário digita com máscara
  //   cnpjFiltro      — concatenação deduplicada (normalizado + mascarado + bruto da API) para contains
  //                     encontrar tanto termo sem máscara quanto fragmentos com máscara
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
    InputIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './beneficio-list.component.html',
  styleUrl: './beneficio-list.component.css'
})
export class BeneficioListComponent {
  private static readonly INVISIBLE_CHARS = /[\u200B-\u200D\uFEFF]/g;

  private _rows: ReadonlyArray<BeneficioRow> = [];

  @Input()
  set beneficios(value: ReadonlyArray<Beneficio> | null | undefined) {
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
  }
  get beneficios(): ReadonlyArray<BeneficioRow> {
    return this._rows;
  }

  @Input() readonly loading = false;
  @Output() readonly edit = new EventEmitter<Beneficio>();
  @Output() readonly remove = new EventEmitter<number>();

  getEditLabel(item: Beneficio): string {
    return `Editar beneficio ${item.nome}`;
  }

  getRemoveLabel(item: Beneficio): string {
    return `Excluir beneficio ${item.nome}`;
  }

  onGlobalFilter(table: Table, event: Event): void {
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
