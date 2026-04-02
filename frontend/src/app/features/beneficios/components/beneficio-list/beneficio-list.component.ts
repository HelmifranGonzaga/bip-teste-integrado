import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beneficio } from '../../../../core/models/beneficio.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-beneficio-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './beneficio-list.component.html',
  styleUrl: './beneficio-list.component.css'
})
export class BeneficioListComponent {
  @Input() readonly beneficios: Beneficio[] = [];
  @Input() readonly loading = false;
  @Output() readonly edit = new EventEmitter<Beneficio>();
  @Output() readonly remove = new EventEmitter<number>();

  getEditLabel(item: Beneficio): string {
    return `Editar beneficio ${item.nome}`;
  }

  getRemoveLabel(item: Beneficio): string {
    return `Excluir beneficio ${item.nome}`;
  }
}
