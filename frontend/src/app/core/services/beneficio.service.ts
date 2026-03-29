import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Beneficio, BeneficioPayload, TransferPayload } from '../models/beneficio.model';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  /**
   * Listar todos os beneficiários
   */
  list(): Observable<Beneficio[]> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.get<Beneficio[]>(`${apiUrl}/beneficios`))
    );
  }

  /**
   * Criar novo beneficiário
   */
  create(payload: BeneficioPayload): Observable<Beneficio> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.post<Beneficio>(`${apiUrl}/beneficios`, payload))
    );
  }

  /**
   * Atualizar beneficiário
   */
  update(id: number, payload: BeneficioPayload): Observable<Beneficio> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.put<Beneficio>(`${apiUrl}/beneficios/${id}`, payload))
    );
  }

  /**
   * Deletar beneficiário
   */
  delete(id: number): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.delete<void>(`${apiUrl}/beneficios/${id}`))
    );
  }

  /**
   * Transferir saldo entre beneficiários
   */
  transfer(payload: TransferPayload): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap(apiUrl => this.http.post<void>(`${apiUrl}/beneficios/transfer`, payload))
    );
  }

  /**
   * Obter URL da API - prioriza config.json em produção
   * Fallback para environment.apiUrl em desenvolvimento
   */
  private getApiUrl(): Observable<string> {
    return this.configService.getConfig().pipe(
      switchMap(config => {
        // Se config tem apiUrl diferente da env padrão, usar dele
        if (config.apiUrl && config.apiUrl !== '/api/v1') {
          return from([config.apiUrl]);
        }
        // Fallback para environment
        return from([environment.apiUrl]);
      })
    );
  }
}
