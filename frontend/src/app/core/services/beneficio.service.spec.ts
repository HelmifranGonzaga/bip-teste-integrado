import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BeneficioService } from './beneficio.service';
import { Beneficio, BeneficioPayload } from '../models/beneficio.model';
import { ConfigService } from '../config/config.service';
import { of } from 'rxjs';

describe('BeneficioService', () => {
  let service: BeneficioService;
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
        BeneficioService,
        {
          provide: ConfigService,
          useValue: configServiceMock
        },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BeneficioService);
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

  it('should list beneficios', () => {
    const mockBeneficios: Beneficio[] = [
      { id: 1, nome: 'Teste', descricao: 'Desc', valor: 100, ativo: true, version: 0, cnpj: null }
    ];

    service.list().subscribe((beneficios) => {
      expect(beneficios.length).toBe(1);
      expect(beneficios).toEqual(mockBeneficios);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios');
    expect(req.request.method).toBe('GET');
    req.flush(mockBeneficios);
  });

  it('should create beneficio', () => {
    const payload: BeneficioPayload = {
      nome: 'Teste',
      descricao: 'Desc',
      valor: 100,
      ativo: true,
      cnpj: null
    };
    const mockResponse: Beneficio = { id: 1, version: 0, ...payload };

    service.create(payload).subscribe((beneficio) => {
      expect(beneficio).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should update beneficio', () => {
    const payload: BeneficioPayload = {
      nome: 'Teste Atualizado',
      descricao: 'Desc',
      valor: 200,
      ativo: true,
      cnpj: '12.ABC.345/0001-90'
    };
    const mockResponse: Beneficio = { id: 1, version: 0, ...payload };

    service.update(1, payload).subscribe((beneficio) => {
      expect(beneficio).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should delete beneficio', () => {
    service.delete(1).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should transfer balance', () => {
    const payload = { fromId: 1, toId: 2, amount: 50 };

    service.transfer(payload).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios/transfer');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });

  it('should use ConfigService apiUrl', () => {
    const mockBeneficios: Beneficio[] = [];

    service.list().subscribe();

    // Verify ConfigService.getConfig was called
    expect(configServiceMock.getConfig).toHaveBeenCalled();

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios');
    req.flush(mockBeneficios);
  });

  it('should use custom apiUrl from config when provided', () => {
    configureTestingModule('https://api.example.com/v2');

    service.list().subscribe();

    const req = httpMock.expectOne('https://api.example.com/v2/beneficios');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should fallback to environment apiUrl when config apiUrl is default', () => {
    configureTestingModule('/api/v1');

    service.list().subscribe();

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should normalize beneficio when API omits cnpj', () => {
    const rawFromApi = {
      id: 1,
      nome: 'Teste',
      descricao: 'Desc',
      valor: 100,
      ativo: true,
      version: 0
    } as Beneficio;

    service.list().subscribe((beneficios) => {
      expect(beneficios[0].cnpj).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios');
    req.flush([rawFromApi]);
  });
});
