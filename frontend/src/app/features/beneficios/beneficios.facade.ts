import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';

import { Beneficio } from '../../core/models/beneficio.model';
import { BeneficioService } from '../../core/services/beneficio.service';
import { SaveBeneficioEvent, TransferBeneficioEvent } from './beneficios.types';

@Injectable({ providedIn: 'root' })
export class BeneficiosFacade {
  private readonly service = inject(BeneficioService);
  private readonly messageService = inject(MessageService);

  list(): Observable<Beneficio[]> {
    return this.service.list();
  }

  save(event: SaveBeneficioEvent): Observable<Beneficio> {
    const request = event.id
      ? this.service.update(event.id, event.payload)
      : this.service.create(event.payload);

    return request.pipe(tap(() => this.showSuccess('Benefício salvo com sucesso!')));
  }

  remove(id: number): Observable<void> {
    return this.service
      .delete(id)
      .pipe(tap(() => this.showSuccess('Benefício removido com sucesso!')));
  }

  transfer(payload: TransferBeneficioEvent): Observable<void> {
    return this.service
      .transfer(payload)
      .pipe(tap(() => this.showSuccess('Transferência realizada com sucesso!')));
  }

  private showSuccess(detail: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail
    });
  }
}
