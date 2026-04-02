import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService, LoginResponse } from './auth.service';
import { ConfigService } from '../config/config.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let store: Record<string, string>;

  function defineSessionStorage(initialStore: Record<string, string> = {}): void {
    store = { ...initialStore };
    const mockSessionStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      }
    };

    Object.defineProperty(globalThis, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
  }

  function setupService(initialStore: Record<string, string> = {}, now?: number): void {
    TestBed.resetTestingModule();
    defineSessionStorage(initialStore);
    if (typeof now === 'number') {
      jest.spyOn(Date, 'now').mockReturnValue(now);
    }

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            getConfig: () =>
              of({
                apiUrl: 'http://localhost:8082/api/v1',
                version: '0.0.1',
                environment: 'development'
              })
          }
        },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    setupService();
  });

  afterEach(() => {
    httpMock.verify();
    jest.restoreAllMocks();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully', (done) => {
      const mockResponse: LoginResponse = {
        accessToken: 'jwt-token-123',
        tokenType: 'Bearer',
        expiresIn: 3600000
      };
      const now = 1_700_000_000_000;
      jest.spyOn(Date, 'now').mockReturnValue(now);

      service.login('testuser', 'password').subscribe(() => {
        expect(service.getAuthUser()?.username).toBe('testuser');
        expect(service.getAuthUser()?.expiresAt).toBe(now + mockResponse.expiresIn);
        expect(service.isAuthenticated()).toBe(true);
        expect(JSON.parse(store.auth_user)).toEqual({
          username: 'testuser',
          expiresAt: now + mockResponse.expiresIn
        });
        done();
      });

      const req = httpMock.expectOne('http://localhost:8082/api/v1/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no user', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when user with valid expiration', (done) => {
      const mockResponse: LoginResponse = {
        accessToken: 'jwt-token-123',
        tokenType: 'Bearer',
        expiresIn: 3600000
      };
      jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

      service.login('testuser', 'password').subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8082/api/v1/auth/login');
      req.flush(mockResponse);
    });

    it('should return false when user is expired', () => {
      setupService({
        auth_user: JSON.stringify({
          username: 'expired-user',
          expiresAt: 1_699_999_999_999
        })
      });

      jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

      expect(service.getAuthUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(store.auth_user).toBeUndefined();
    });
  });

  describe('getAuthUser', () => {
    it('should return null when not authenticated', () => {
      expect(service.getAuthUser()).toBeNull();
    });

    it('should restore stored valid user', () => {
      setupService({
        auth_user: JSON.stringify({
          username: 'remembered-user',
          expiresAt: 1_700_000_001_000
        })
      }, 1_700_000_000_000);

      expect(service.getAuthUser()).toEqual({
        username: 'remembered-user',
        expiresAt: 1_700_000_001_000
      });
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear token, in-memory user and storage', (done) => {
      const mockResponse: LoginResponse = {
        accessToken: 'jwt-token-123',
        tokenType: 'Bearer',
        expiresIn: 3600000
      };
      jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

      service.login('testuser', 'password').subscribe(() => {
        service.logout();

        expect(service.getAuthUser()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(store.auth_user).toBeUndefined();
        done();
      });

      const req = httpMock.expectOne('http://localhost:8082/api/v1/auth/login');
      req.flush(mockResponse);
    });
  });
});
