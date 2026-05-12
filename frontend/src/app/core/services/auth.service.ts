import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { clearAuthToken, getRoleFromToken, setAuthToken } from '../interceptors/jwt.interceptor';
import { ConfigService } from '../config/config.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthUser {
  username: string;
  role: string;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);
  private readonly authUser$ = new BehaviorSubject<AuthUser | null>(null);

  constructor() {
    this.loadStoredUser();
  }

  /**
   * Obter usuário autenticado como Observable
   */
  getAuthUser$(): Observable<AuthUser | null> {
    return this.authUser$.asObservable();
  }

  /**
   * Obter usuário autenticado sincronamente
   */
  getAuthUser(): AuthUser | null {
    return this.authUser$.value;
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    const user = this.authUser$.value;
    if (!user) {
      return false;
    }
    // Verificar se token não expirou
    return user.expiresAt > Date.now();
  }

  /**
   * Fazer login com username/password
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.configService.getConfig().pipe(
      switchMap((config) => {
        const loginRequest: LoginRequest = { username, password };
        const loginUrl = `${config.apiUrl}/auth/login`;
        return this.http.post<LoginResponse>(loginUrl, loginRequest);
      }),
      tap((response) => {
        // Armazenar token
        setAuthToken(response.accessToken);

        // Armazenar usuário
        // Backend retorna expiresIn em segundos; Date.now() usa milissegundos.
        const expiresAt = Date.now() + response.expiresIn * 1000;
        const authUser: AuthUser = { username, role: getRoleFromToken() ?? 'USER', expiresAt };
        this.authUser$.next(authUser);
        this.storeUser(authUser);
      })
    );
  }

  /**
   * Fazer logout
   */
  logout(): void {
    clearAuthToken();
    this.authUser$.next(null);
    this.clearStoredUser();
  }

  /**
   * Armazenar usuário em sessionStorage
   */
  private storeUser(user: AuthUser): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('auth_user', JSON.stringify(user));
    }
  }

  /**
   * Carregar usuário de sessionStorage
   */
  private loadStoredUser(): void {
    if (typeof sessionStorage === 'undefined') {
      return;
    }
    const stored = sessionStorage.getItem('auth_user');
    if (stored) {
      try {
        const user: AuthUser = JSON.parse(stored);
        // Verificar se não expirou
        if (user.expiresAt > Date.now()) {
          // Garante que o role vem do JWT (sempre atualizado)
          user.role = getRoleFromToken() ?? user.role ?? 'USER';
          this.authUser$.next(user);
        } else {
          this.clearStoredUser();
        }
      } catch (error) {
        console.warn('[AuthService] Failed to parse stored auth user', error);
        this.clearStoredUser();
      }
    }
  }

  /**
   * Limpar usuário armazenado
   */
  private clearStoredUser(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('auth_user');
    }
  }
}
