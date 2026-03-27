import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { BipPreset } from './app/core/theme/bip-theme';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';

registerLocaleData(localePt);

void bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([errorInterceptor])),
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
