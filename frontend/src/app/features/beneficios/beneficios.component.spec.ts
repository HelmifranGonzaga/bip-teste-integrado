import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { BeneficioService } from '../../core/services/beneficio.service';
import { BeneficiosComponent } from './beneficios.component';

describe('BeneficiosComponent', () => {
  let routeMock: any;

  beforeEach(() => {
    routeMock = {
      queryParams: of({})
    };
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('deve carregar lista de benefícios ao iniciar', () => {
    const serviceMock = {
      list: jest.fn().mockReturnValue(of([])),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      transfer: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    fixture.detectChanges();

    expect(serviceMock.list).toHaveBeenCalled();
  });

  it('deve exibir tela de erro quando ocorrer falha de conexão', () => {
    const serviceMock = {
      list: jest.fn().mockReturnValue(throwError(() => ({ status: 0 }))),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      transfer: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.connectionError()).toBe(true);
    expect(component.reconnecting()).toBe(true);
    expect(component.errorMessage()).toBe('Não conseguimos conexão com o servidor no momento.');
    expect(component.diagnosticCode()).toContain('BIP-CONN-');
  });

  it('deve tentar reconectar apenas 3 vezes e encerrar com troubleshooting', () => {
    jest.useFakeTimers();
    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const serviceMock = {
      list: jest.fn().mockReturnValue(throwError(() => ({ status: 0 }))),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      transfer: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    jest.advanceTimersByTime(15000);

    expect(component.reconnectAttempts()).toBe(3);
    expect(component.reconnecting()).toBe(false);
    expect(component.reconnectExhausted()).toBe(true);
    expect(serviceMock.list).toHaveBeenCalledTimes(4);
  });

  it('deve atualizar o countdown enquanto tenta reconectar', () => {
    jest.useFakeTimers();
    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const serviceMock = {
      list: jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 }))),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      transfer: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.reconnecting()).toBe(true);
    expect(component.reconnectCountdownSeconds()).toBe(5);

    jest.advanceTimersByTime(1000);

    expect(component.reconnectCountdownSeconds()).toBe(4);
    expect(component.diagnosticCode()).toBe('BIP-CONN-1700000000000-A0-ON');
  });

  it('deve se recuperar quando a reconexao voltar a responder', () => {
    jest.useFakeTimers();
    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const serviceMock = {
      list: jest
        .fn()
        .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 0 })))
        .mockReturnValue(of([])),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      transfer: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    jest.advanceTimersByTime(5000);

    expect(serviceMock.list).toHaveBeenCalledTimes(2);
    expect(component.connectionError()).toBe(false);
    expect(component.reconnecting()).toBe(false);
    expect(component.reconnectAttempts()).toBe(0);
    expect(component.reconnectExhausted()).toBe(false);
    expect(component.beneficios()).toEqual([]);
  });

  it('deve reiniciar a reconexao manualmente apos esgotar tentativas', () => {
    jest.useFakeTimers();
    jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const serviceMock = {
      list: jest.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 }))),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      transfer: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    jest.advanceTimersByTime(15000);

    component.retryNow();

    expect(component.reconnectExhausted()).toBe(false);
    expect(component.reconnecting()).toBe(true);
    expect(component.reconnectAttempts()).toBe(1);
    expect(serviceMock.list).toHaveBeenCalledTimes(5);
  });
});
