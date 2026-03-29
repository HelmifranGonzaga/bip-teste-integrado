import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { BipPreset } from './app/core/theme/bip-theme';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';

registerLocaleData(localePt);

void bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    MessageService,
    providePrimeNG({
      theme: {
        preset: BipPreset,
        options: {
          darkModeSelector: 'none'
        }
      }
    })
  ]
});
