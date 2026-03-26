import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  templateUrl: './beneficio-list.component.html'
})
export class BeneficioListComponent {
  @Input() beneficios: Beneficio[] = [];
  @Output() edit = new EventEmitter<Beneficio>();
  @Output() remove = new EventEmitter<number>();
}
