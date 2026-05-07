import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Beneficio, BeneficioPayload, TransferPayload } from '../models/beneficio.model';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  /**
   * Lista todos os benefícios.
   */
  list(): Observable<Beneficio[]> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<Beneficio[]>(`${apiUrl}/beneficios`)),
      map((items) => items.map((b) => this.normalizeBeneficio(b)))
    );
  }

  /**
   * Cria um novo benefício.
   */
  create(payload: BeneficioPayload): Observable<Beneficio> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.post<Beneficio>(`${apiUrl}/beneficios`, payload)),
      map((b) => this.normalizeBeneficio(b))
    );
  }

  /**
   * Atualiza um benefício existente.
   */
  update(id: number, payload: BeneficioPayload): Observable<Beneficio> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.put<Beneficio>(`${apiUrl}/beneficios/${id}`, payload)),
      map((b) => this.normalizeBeneficio(b))
    );
  }

  /**
   * Remove um benefício pelo id.
   */
  delete(id: number): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.delete<void>(`${apiUrl}/beneficios/${id}`))
    );
  }

  /**
   * Transfere saldo entre dois benefícios.
   */
  transfer(payload: TransferPayload): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.post<void>(`${apiUrl}/beneficios/transfer`, payload))
    );
  }

  /**
   * Obter URL da API - prioriza config.json em produção
   * Fallback para environment.apiUrl em desenvolvimento
   */
  private getApiUrl(): Observable<string> {
    return this.configService.getConfig().pipe(map((config) => this.resolveApiUrl(config.apiUrl)));
  }

  private resolveApiUrl(configApiUrl?: string): string {
    if (configApiUrl && configApiUrl !== '/api/v1') {
      return configApiUrl;
    }

    return environment.apiUrl;
  }

  /** Garante `cnpj` quando a API omite o campo (JSON sem propriedade). */
  private normalizeBeneficio(b: Beneficio): Beneficio {
    return { ...b, cnpj: b.cnpj ?? null };
  }
}
