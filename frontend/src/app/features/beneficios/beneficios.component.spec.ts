import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BeneficiosComponent } from './beneficios.component';
import { BeneficioService } from '../../core/services/beneficio.service';
import { MessageService } from 'primeng/api';

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
});
