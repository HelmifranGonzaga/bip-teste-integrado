import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, tap, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';

/**
 * Configuração de aplicação carregada em runtime.
 * Permite mudar URL da API sem recompilar.
 *
 * FASE 5: ADR-004 - Runtime configuration strategy
 */
export interface AppConfig {
  apiUrl: string;
  apiBaseUrl?: string;
  version: string;
  environment: 'development' | 'production';
}

const DEFAULT_CONFIG: AppConfig = {
  apiUrl: 'http://localhost:8082/api/v1',
  version: '0.0.1',
  environment: 'production'
};

/**
 * ConfigService carrega configuração de:
 * 1. /assets/config.json (runtime)
 * 2. Environment variables (Angular build-time)
 * 3. Default values (fallback)
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly http = inject(HttpClient);
  private config$?: Observable<AppConfig>;

  /**
   * Carrega configuração em runtime com fallback automático.
   * Cacheia resultado com shareReplay para evitar múltiplas requisições.
   * Nunca lança erro - retorna valores padrão em caso de falha.
   */
  getConfig(): Observable<AppConfig> {
    this.config$ ??= this.http.get<AppConfig>('/assets/config.json').pipe(
      tap((config) => {
        if (!environment.production) {
          console.log('[ConfigService] Loaded config from /assets/config.json:', config);
        }
      }),
      catchError((error) => {
        if (!environment.production) {
          console.warn('[ConfigService] Failed to load /assets/config.json, using defaults:', error);
        }
        // Retorna config padrão em caso de erro (arquivo não encontrado, sem conexão, etc)
        return of(DEFAULT_CONFIG);
      }),
      shareReplay(1) // Cache + compartilhar entre subscribers
    );

    return this.config$;
  }

  /**
   * Obter URL da API sincronamente (cached).
   * Útil para inicialização rápida.
   */
  getApiUrl(): string {
    // Em prod, /assets/config.json é carregado antes da inicialização do app
    // Aqui retornamos default, o valor real vem de getConfig().pipe(...)
    return DEFAULT_CONFIG.apiUrl;
  }
}
