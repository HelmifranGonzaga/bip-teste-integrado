import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { SicoobPreset } from './app/core/theme/sicoob-theme';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';
import { environment } from './environments/environment';

registerLocaleData(localePt);

async function bootstrap(): Promise<void> {
  try {
    await bootstrapApplication(AppComponent, {
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        MessageService,
        providePrimeNG({
          theme: {
            preset: SicoobPreset,
            options: {
              darkModeSelector: 'none'
            }
          }
        })
      ]
    });
  } catch (error) {
    if (!environment.production) {
      console.error(error);
    }
  }
}

void bootstrap();
