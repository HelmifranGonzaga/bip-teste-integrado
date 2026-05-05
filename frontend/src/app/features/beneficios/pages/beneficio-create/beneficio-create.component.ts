import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BeneficioFormComponent } from '../../components/beneficio-form/beneficio-form.component';
import { BeneficiosFacade } from '../../beneficios.facade';
import { SaveBeneficioEvent } from '../../beneficios.types';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-beneficio-create',
  standalone: true,
  imports: [CommonModule, RouterModule, BeneficioFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './beneficio-create.component.html',
  styleUrl: './beneficio-create.component.css'
})
export class BeneficioCreateComponent {
  private readonly router = inject(Router);
  private readonly facade = inject(BeneficiosFacade);
  
  loading = signal<boolean>(false);

  onSave(event: SaveBeneficioEvent): void {
    this.loading.set(true);
    this.facade.save(event)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/beneficios']);
        },
        error: () => {
          // O interceptor já trata mensagens de erro, mas poderiamos fazer algo aqui.
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/beneficios']);
  }
}
