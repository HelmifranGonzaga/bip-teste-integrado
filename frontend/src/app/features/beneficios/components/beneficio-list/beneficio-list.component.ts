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
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    CardModule,
    TooltipModule
  ],
  template: `
    <p-card header="Benefícios">
      <p-table [value]="beneficios" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5, 10, 20]" styleClass="p-datatable-striped">
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Ativo</th>
            <th style="width: 12rem">Ações</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.nome }}</td>
            <td>{{ item.descricao }}</td>
            <td>{{ item.valor | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
            <td>
              <i class="pi" [ngClass]="{ 'text-green-500 pi-check-circle': item.ativo, 'text-red-500 pi-times-circle': !item.ativo }"></i>
            </td>
            <td>
              <div class="flex gap-2">
                <p-button icon="pi pi-pencil" severity="success" [rounded]="true" [text]="true" (onClick)="edit.emit(item)" pTooltip="Editar"></p-button>
                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [text]="true" (onClick)="remove.emit(item.id)" pTooltip="Excluir"></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class BeneficioListComponent {
  @Input() beneficios: Beneficio[] = [];
  @Output() edit = new EventEmitter<Beneficio>();
  @Output() remove = new EventEmitter<number>();
}
