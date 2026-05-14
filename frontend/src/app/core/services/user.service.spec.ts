import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService, User, UserPayload } from './user.service';
import { ConfigService } from '../config/config.service';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let configServiceMock: { getConfig: ReturnType<typeof vi.fn> };
  let currentApiUrl = 'http://localhost:8082/api/v1';

  const defaultConfig = {
    apiUrl: 'http://localhost:8082/api/v1',
    version: '0.0.1',
    environment: 'development'
  };

  function configureTestingModule(apiUrl = defaultConfig.apiUrl): void {
    TestBed.resetTestingModule();
    currentApiUrl = apiUrl;
    configServiceMock = {
      getConfig: vi.fn(() =>
        of({
          ...defaultConfig,
          apiUrl: currentApiUrl
        })
      )
    };

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: ConfigService, useValue: configServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    configureTestingModule();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list users', () => {
    const mockUsers: User[] = [
      { id: 1, username: 'joao', nome: 'João Silva', role: 'USER', ativo: true, version: 0 }
    ];

    service.list().subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get current user', () => {
    const mockUser: User = { id: 1, username: 'joao', nome: 'João Silva', role: 'USER', ativo: true, version: 0 };

    service.me().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get user by id', () => {
    const mockUser: User = { id: 2, username: 'maria', nome: 'Maria Souza', role: 'ADMIN', ativo: true, version: 0 };

    service.getById(2).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios/2');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create user', () => {
    const payload: UserPayload = { username: 'novo', password: 'senha123', nome: 'Novo User', role: 'USER' };
    const mockResponse: User = { id: 3, ...payload };

    service.create(payload).subscribe((user) => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should update user', () => {
    const payload = { nome: 'João Atualizado' };
    const mockResponse: User = { id: 1, username: 'joao', nome: 'João Atualizado', role: 'USER', ativo: true, version: 1 };

    service.update(1, payload).subscribe((user) => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should delete user', () => {
    service.delete(1).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should toggle user active status', () => {
    const mockResponse: User = { id: 1, username: 'joao', nome: 'João Silva', role: 'USER', ativo: false, version: 1 };

    service.toggleActive(1).subscribe((user) => {
      expect(user.ativo).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios/1/ativo');
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('should reset user password', () => {
    const mockResponse = { novaSenha: 'NovaSenha123' };

    service.resetPassword(1).subscribe((res) => {
      expect(res.novaSenha).toBe('NovaSenha123');
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios/1/reset-password');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should use ConfigService apiUrl', () => {
    service.list().subscribe();

    expect(configServiceMock.getConfig).toHaveBeenCalled();

    const req = httpMock.expectOne('http://localhost:8082/api/v1/usuarios');
    req.flush([]);
  });

  it('should use custom apiUrl from config when provided', () => {
    configureTestingModule('https://api.example.com/v2');

    service.list().subscribe();

    const req = httpMock.expectOne('https://api.example.com/v2/usuarios');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
