import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { formatCnpjMasked, normalizeCnpjAlfanumerico } from '../../../../core/utils/cnpj-alfanumerico';
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
  cnpjNormalizado: string;
  cnpjMascarado: string;
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
  private _rows: ReadonlyArray<BeneficioRow> = [];

  @Input()
  set beneficios(value: ReadonlyArray<Beneficio> | null | undefined) {
    this._rows = (value ?? []).map((b) => {
      const normalizado = b.cnpj ? normalizeCnpjAlfanumerico(b.cnpj) : '';
      return {
        ...b,
        cnpjNormalizado: normalizado,
        cnpjMascarado: normalizado ? formatCnpjMasked(normalizado) : ''
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
    // O texto bruto cobre buscas formatadas (ex.: "12.ABC") e em qualquer campo.
    // Como a tabela faz contains case-insensitive, isso já casa nome/descricao/valor
    // e o CNPJ no formato com máscara que vem da API.
    table.filterGlobal(raw, 'contains');
  }
}
