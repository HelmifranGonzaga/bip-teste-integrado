import { HttpInterceptorFn } from '@angular/common/http';

/**
 * JWT Interceptor.
 * Adiciona automaticamente Bearer token em todas as requisições.
 *
 * Token armazenado em localStorage com chave 'jwt_token'.
 * Pode ser substituído por sessionStorage em contextos sensíveis.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getToken();

  if (token && shouldAddToken(req.url)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};

/**
 * Recupera token do localStorage.
 * Em produção, considerar usar sessionStorage ou service worker.
 */
function getToken(): string | null {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage.getItem('jwt_token');
}

/**
 * Determina se deve adicionar token à requisição.
 * Evitar adição a assets estáticos, config, etc.
 */
function shouldAddToken(url: string): boolean {
  // Não adicionar token a requisições de assets/config
  if (url.includes('/assets/') || url.includes('/config')) {
    return false;
  }
  // Adicionar apenas a requisições da API
  return url.includes('/api/');
}

/**
 * Setter para token (chamado após login).
 */
export function setAuthToken(token: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('jwt_token', token);
  }
}

/**
 * Remover token (logout).
 */
export function clearAuthToken(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('jwt_token');
  }
}

/**
 * Decodifica o payload do JWT (base64url) e retorna os claims.
 * Não faz verificação de assinatura — assume token válido (interceptador já validou).
 */
export function parseJwtPayload(token: string): { sub?: string; role?: string } | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Extrai o role do JWT armazenado, ou null se indisponível.
 */
export function getRoleFromToken(): string | null {
  const token = getToken();
  if (!token) {
    return null;
  }
  return parseJwtPayload(token)?.role ?? null;
}
