import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-table-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-toolbar.component.html',
  styleUrl: './table-toolbar.component.css'
})
export class TableToolbarComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  @Input({ required: true }) title = '';
  @Input() searchPlaceholder = 'Buscar...';
  @Input() searchValue = '';
  @Input() debounceMs = 300;

  @Output() readonly searchChange = new EventEmitter<string>();

  readonly currentValue = signal('');

  constructor() {
    this.searchSubject.pipe(
      debounceTime(this.debounceMs),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => this.searchChange.emit(value));
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.currentValue.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.currentValue.set('');
    this.searchSubject.next('');
  }
}
