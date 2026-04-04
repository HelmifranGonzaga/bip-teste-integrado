import { jwtInterceptor, setAuthToken, clearAuthToken } from './jwt.interceptor';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';

describe('JWT Interceptor', () => {
  beforeEach(() => {
    // Mock localStorage
    let store: Record<string, string> = {};

    const mockLocalStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  });

  describe('jwtInterceptor', () => {
    const mockHandler: HttpHandlerFn = (
      req: HttpRequest<unknown>
    ): Observable<HttpEvent<unknown>> => {
      return of({} as HttpEvent<unknown>);
    };

    it('should add Authorization header for API requests', (done) => {
      setAuthToken('test-token-123');

      const request = new HttpRequest('GET', 'http://localhost:8082/api/v1/beneficios');
      let modifiedRequest: HttpRequest<unknown> | null = null;

      const handler: HttpHandlerFn = (req: HttpRequest<unknown>) => {
        modifiedRequest = req;
        return mockHandler(req);
      };

      jwtInterceptor(request, handler).subscribe(() => {
        expect(modifiedRequest?.headers.get('Authorization')).toBe('Bearer test-token-123');
        done();
      });
    });

    it('should not add Authorization header for /assets/ requests', (done) => {
      setAuthToken('test-token-123');

      const request = new HttpRequest('GET', 'http://localhost:8082/assets/config.json');
      let modifiedRequest: HttpRequest<unknown> | null = null;

      const handler: HttpHandlerFn = (req: HttpRequest<unknown>) => {
        modifiedRequest = req;
        return mockHandler(req);
      };

      jwtInterceptor(request, handler).subscribe(() => {
        expect(modifiedRequest?.headers.get('Authorization')).toBeNull();
        done();
      });
    });

    it('should not add Authorization header when no token', (done) => {
      clearAuthToken();

      const request = new HttpRequest('GET', 'http://localhost:8082/api/v1/beneficios');
      let modifiedRequest: HttpRequest<unknown> | null = null;

      const handler: HttpHandlerFn = (req: HttpRequest<unknown>) => {
        modifiedRequest = req;
        return mockHandler(req);
      };

      jwtInterceptor(request, handler).subscribe(() => {
        expect(modifiedRequest?.headers.get('Authorization')).toBeNull();
        done();
      });
    });
  });

  describe('setAuthToken', () => {
    it('should store token in localStorage', () => {
      setAuthToken('my-jwt-token');
      expect(localStorage.getItem('jwt_token')).toBe('my-jwt-token');
    });
  });

  describe('clearAuthToken', () => {
    it('should remove token from localStorage', () => {
      setAuthToken('test-token');
      clearAuthToken();
      expect(localStorage.getItem('jwt_token')).toBeNull();
    });
  });
});
