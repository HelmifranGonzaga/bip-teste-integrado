import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ConfigService } from '../config/config.service';

export interface User {
  id: number;
  username: string;
  nome: string;
  role: string;
  ativo: boolean;
  version: number;
}

export interface UserPayload {
  username: string;
  password?: string;
  nome: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  list(): Observable<User[]> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<User[]>(`${apiUrl}/usuarios`))
    );
  }

  me(): Observable<User> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<User>(`${apiUrl}/usuarios/me`))
    );
  }

  getById(id: number): Observable<User> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.get<User>(`${apiUrl}/usuarios/${id}`))
    );
  }

  create(payload: UserPayload): Observable<User> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.post<User>(`${apiUrl}/usuarios`, payload))
    );
  }

  update(id: number, payload: Partial<UserPayload>): Observable<User> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.put<User>(`${apiUrl}/usuarios/${id}`, payload))
    );
  }

  delete(id: number): Observable<void> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.delete<void>(`${apiUrl}/usuarios/${id}`))
    );
  }

  toggleActive(id: number): Observable<User> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.patch<User>(`${apiUrl}/usuarios/${id}/ativo`, {}))
    );
  }

  resetPassword(id: number): Observable<{ novaSenha: string }> {
    return this.getApiUrl().pipe(
      switchMap((apiUrl) => this.http.post<{ novaSenha: string }>(`${apiUrl}/usuarios/${id}/reset-password`, {}))
    );
  }

  private getApiUrl(): Observable<string> {
    return this.configService.getConfig().pipe(map((config) => {
      const apiUrl = config.apiUrl || environment.apiUrl;
      return apiUrl.endsWith('/api/v1') ? apiUrl : apiUrl;
    }));
  }
}