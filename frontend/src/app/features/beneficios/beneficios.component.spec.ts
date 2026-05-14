import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { BeneficioService } from '../../core/services/beneficio.service';
import { BeneficiosComponent } from './beneficios.component';
import { LoadingService } from '../../core/services/loading.service';
import { ReconnectionService } from '../../core/services/reconnection.service';

describe('BeneficiosComponent', () => {
  let routeMock: any;

  beforeEach(() => {
    routeMock = {
      queryParams: of({})
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function createServiceMock(overrides: Record<string, any> = {}) {
    return {
      list: vi.fn().mockReturnValue(of([])),
      listPaginated: vi.fn().mockReturnValue(of({ content: [], totalElements: 0, totalPages: 0, size: 10, number: 0, numberOfElements: 0, first: true, last: true, empty: true })),
      exportCsv: vi.fn().mockReturnValue(of('')),
      create: vi.fn().mockReturnValue(of({})),
      update: vi.fn().mockReturnValue(of({})),
      delete: vi.fn().mockReturnValue(of(undefined)),
      transfer: vi.fn().mockReturnValue(of(undefined)),
      ...overrides
    };
  }

  it('deve carregar lista de benefícios ao iniciar', () => {
    const serviceMock = createServiceMock({ list: vi.fn().mockReturnValue(of([])) });

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService,
        LoadingService,
        ReconnectionService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    fixture.detectChanges();

    expect(serviceMock.list).toHaveBeenCalled();
  });

  it('deve exibir tela de erro quando ocorrer falha de conexão', () => {
    const serviceMock = createServiceMock({ list: vi.fn().mockReturnValue(throwError(() => ({ status: 0 }))) });

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService,
        LoadingService,
        ReconnectionService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.connectionError()).toBe(true);
    expect(component.reconnectionService.reconnecting()).toBe(true);
    expect(component.errorMessage()).toBe('Não foi possível conectar ao servidor. Verifique sua conexão.');
    expect(component.reconnectionService.diagnosticCode()).toContain('BIP-CONN-');
  });

  it('deve resetar estado ao reconectar com sucesso', () => {
    const serviceMock = createServiceMock({
      list: vi.fn()
        .mockReturnValueOnce(throwError(() => ({ status: 0 })))
        .mockReturnValueOnce(of([]))
    });

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService,
        LoadingService,
        ReconnectionService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.connectionError()).toBe(true);

    component.retryNow();
    fixture.detectChanges();

    expect(component.connectionError()).toBe(false);
    expect(component.reconnectionService.reconnecting()).toBe(false);
    expect(component.reconnectionService.reconnectAttempts()).toBe(0);
    expect(component.reconnectionService.reconnectExhausted()).toBe(false);
  });
});
