import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BeneficioService } from './beneficio.service';
import { Beneficio, BeneficioPayload } from '../models/beneficio.model';

describe('BeneficioService', () => {
  let service: BeneficioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BeneficioService]
    });
    service = TestBed.inject(BeneficioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list beneficios', () => {
    const mockBeneficios: Beneficio[] = [{ id: 1, nome: 'Teste', descricao: 'Desc', valor: 100, ativo: true, version: 0 }];

    service.list().subscribe(beneficios => {
      expect(beneficios.length).toBe(1);
      expect(beneficios).toEqual(mockBeneficios);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios');
    expect(req.request.method).toBe('GET');
    req.flush(mockBeneficios);
  });

  it('should create beneficio', () => {
    const payload: BeneficioPayload = { nome: 'Teste', descricao: 'Desc', valor: 100, ativo: true };
    const mockResponse: Beneficio = { id: 1, version: 0, ...payload };

    service.create(payload).subscribe(beneficio => {
      expect(beneficio).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should update beneficio', () => {
    const payload: BeneficioPayload = { nome: 'Teste Atualizado', descricao: 'Desc', valor: 200, ativo: true };
    const mockResponse: Beneficio = { id: 1, version: 0, ...payload };

    service.update(1, payload).subscribe(beneficio => {
      expect(beneficio).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it('should delete beneficio', () => {
    service.delete(1).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should transfer balance', () => {
    const payload = { fromId: 1, toId: 2, amount: 50 };

    service.transfer(payload).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8082/api/v1/beneficios/transfer');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });
});
