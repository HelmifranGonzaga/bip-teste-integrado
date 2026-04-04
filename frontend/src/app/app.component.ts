import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderComponent } from './core/layout/header.component';
import { AppToastComponent } from './core/layout/app-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, AppToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-wrapper">
      <!-- Global Toast Component -->
      <app-toast></app-toast>

      <!-- Header (nunca mostrar em login) -->
      <app-header *ngIf="!isLoginPage()"></app-header>

      <!-- Main Content -->
      <main class="app-main" [class.full-height]="isLoginPage()">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-wrapper {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: #f8f9fa;
      }

      .app-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      .app-main.full-height {
        height: 100vh;
      }
    `
  ]
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoginPage = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.isLoginPage.set(event.urlAfterRedirects.includes('/login'));
      });

    this.isLoginPage.set(this.router.url.includes('/login'));
  }
}
