import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { SicoobPreset } from './app/core/theme/sicoob-theme';

registerLocaleData(localePt);

async function bootstrap(): Promise<void> {
  try {
    await bootstrapApplication(AppComponent, {
      providers: [
        provideHttpClient(),
        provideAnimationsAsync(),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        MessageService,
        providePrimeNG({
          theme: {
            preset: SicoobPreset,
            options: {
              darkModeSelector: 'none' // Force light mode for Sicoob theme
            }
          }
        })
      ]
    });
  } catch (error) {
    console.error(error);
  }
}

void bootstrap();
