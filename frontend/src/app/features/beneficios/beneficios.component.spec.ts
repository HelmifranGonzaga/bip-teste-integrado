import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { BeneficioService } from '../../core/services/beneficio.service';
import { BeneficiosComponent } from './beneficios.component';

describe('BeneficiosComponent', () => {
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
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(BeneficiosComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.connectionError()).toBe(true);
    expect(component.errorMessage()).toBe('Não foi possível conectar ao servidor. Verifique sua conexão.');
  });
});
