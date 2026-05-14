import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-actions',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="action-section" role="group" [attr.aria-label]="label || 'Ações'">
      @if (label) {
        <span class="action-section__label">{{ label }}</span>
      }
      <div class="action-section__actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .action-section { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .action-section__label { font-size: 0.75rem; font-weight: 600; color: var(--p-surface-500); text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }
    .action-section__actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  `]
})
export class PageActionsComponent {
  @Input() label = '';
}
