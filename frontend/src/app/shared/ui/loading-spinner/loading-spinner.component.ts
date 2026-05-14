import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <div class="loading-status" role="status" aria-live="polite">
        <i class="pi pi-spin pi-spinner loading-status__icon" aria-hidden="true"></i>
        <div>
          <strong>{{ title }}</strong>
          @if (description) {
            <p>{{ description }}</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: var(--p-primary-50);
      border: 1px solid var(--p-primary-200);
      border-radius: 10px;
      margin-bottom: 1rem;
    }
    .loading-status__icon { font-size: 1.5rem; color: var(--p-primary-500); flex-shrink: 0; }
    .loading-status strong { display: block; color: var(--p-surface-900); }
    .loading-status p { margin: 0.25rem 0 0; font-size: 0.85rem; color: var(--p-surface-600); }
  `]
})
export class LoadingSpinnerComponent {
  @Input() loading = false;
  @Input() title = 'Carregando...';
  @Input() description = 'Aguarde um instante.';
}
