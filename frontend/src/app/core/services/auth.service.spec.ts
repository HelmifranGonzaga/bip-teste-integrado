import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginResponse } from './auth.service';
import { ConfigService } from '../config/config.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Clear sessionStorage mock before each test
    const store: Record<string, string> = {};
    const mockSessionStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(key => delete store[key]);
      }
    };

    // Replace the global sessionStorage with our mock
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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
        }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
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

      service.login('testuser', 'password').subscribe(() => {
        expect(service.getAuthUser()?.username).toBe('testuser');
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

      service.login('testuser', 'password').subscribe(() => {
        expect(service.isAuthenticated()).toBe(true);
        done();
      });

      const req = httpMock.expectOne('http://localhost:8082/api/v1/auth/login');
      req.flush(mockResponse);
    });
  });

  describe('getAuthUser', () => {
    it('should return null when not authenticated', () => {
      expect(service.getAuthUser()).toBeNull();
    });
  });
});
