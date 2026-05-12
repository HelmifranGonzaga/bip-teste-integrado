import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Beneficio, BeneficioPayload, Page, TransferPayload } from '../models/beneficio.model';
import { ConfigService } from '../config/config.service';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  list(): Observable<Beneficio[]> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<Beneficio[]>(`${apiUrl}/beneficios`)),
      map((items) => items.map((b: Beneficio) => this.normalizeBeneficio(b)))
    );
  }

  listPaginated(page: number, size: number): Observable<Page<Beneficio>> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) =>
        this.http.get<Page<Beneficio>>(`${apiUrl}/beneficios`, {
          params: { page, size }
        })
      ),
      map((pageData) => ({
        ...pageData,
        content: pageData.content.map((b: Beneficio) => this.normalizeBeneficio(b))
      }))
    );
  }

  exportCsv(): Observable<string> {
    return this.list().pipe(
      map((items) => {
        const header = 'ID,Nome,Descrição,CNPJ,Valor,Ativo';
        const rows = items.map((b) =>
          [
            b.id,
            `"${b.nome.replace(/"/g, '""')}"`,
            `"${(b.descricao || '').replace(/"/g, '""')}"`,
            b.cnpj || '',
            b.valor,
            b.ativo ? 'Sim' : 'Não'
          ].join(',')
        );
        return [header, ...rows].join('\n');
      })
    );
  }

  create(payload: BeneficioPayload): Observable<Beneficio> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.post<Beneficio>(`${apiUrl}/beneficios`, payload)),
      map((b) => this.normalizeBeneficio(b))
    );
  }

  update(id: number, payload: BeneficioPayload): Observable<Beneficio> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.put<Beneficio>(`${apiUrl}/beneficios/${id}`, payload)),
      map((b) => this.normalizeBeneficio(b))
    );
  }

  delete(id: number): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.delete<void>(`${apiUrl}/beneficios/${id}`))
    );
  }

  transfer(payload: TransferPayload): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.post<void>(`${apiUrl}/beneficios/transfer`, payload))
    );
  }

  private getApiUrl(): Observable<string> {
    return this.configService.getConfig().pipe(
      map((config: { apiUrl?: string }) => this.resolveApiUrl(config.apiUrl))
    );
  }

  private resolveApiUrl(configApiUrl?: string): string {
    if (configApiUrl && configApiUrl !== '/api/v1') {
      return configApiUrl;
    }
    return environment.apiUrl;
  }

  private normalizeBeneficio(b: Beneficio): Beneficio {
    return { ...b, cnpj: b.cnpj ?? null };
  }
}