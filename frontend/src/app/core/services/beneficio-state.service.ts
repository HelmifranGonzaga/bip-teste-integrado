import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeneficioStateService {
  readonly hasBeneficios = signal<boolean>(true);
  readonly beneficioCount = signal<number>(0);
  
  updateCount(count: number): void {
    this.beneficioCount.set(count);
    this.hasBeneficios.set(count > 0);
  }
}