import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Beneficio, BeneficioPayload, TransferPayload } from '../models/beneficio.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BeneficioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/beneficios`;

  list(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(this.apiUrl);
  }

  create(payload: BeneficioPayload): Observable<Beneficio> {
    return this.http.post<Beneficio>(this.apiUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, payload: BeneficioPayload): Observable<Beneficio> {
    return this.http.put<Beneficio>(`${this.apiUrl}/${id}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  transfer(payload: TransferPayload): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/transfer`, payload).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error?.message ?? 'Ocorreu um erro inesperado';
    return throwError(() => new Error(errorMessage));
  }
}
