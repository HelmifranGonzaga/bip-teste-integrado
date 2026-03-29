import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { filter } from 'rxjs';
import { HeaderComponent } from './core/layout/header.component';
import { AppToastComponent } from './core/layout/app-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, AppToastComponent],
  template: `
    <div class="app-wrapper">
      <!-- Global Toast Component -->
      <app-toast></app-toast>

      <!-- Header (nunca mostrar em login) -->
      <app-header *ngIf="!isLoginPage()"></app-header>

      <!-- Main Content -->
      <main class="app-main" [class.full-height]="isLoginPage()" @pageAnimation>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
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
  `],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent {
  private readonly router = inject(Router);

  isLoginPage = signal<boolean>(false);

  constructor() {
    // Listen to navigation events and update the signal
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isLoginPage.set(event.urlAfterRedirects.includes('/login'));
      });

    // Set initial value
    this.isLoginPage.set(this.router.url.includes('/login'));
  }
}

