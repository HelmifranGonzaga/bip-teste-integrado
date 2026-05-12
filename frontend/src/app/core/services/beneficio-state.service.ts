import { Injectable, linkedSignal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeneficioStateService {
  readonly count = linkedSignal(() => 0);
  readonly hasBeneficios = computed(() => this.count() > 0);

  updateCount(count: number): void {
    this.count.set(count);
  }
}