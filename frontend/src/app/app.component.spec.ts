import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BeneficiosComponent } from './features/beneficios/beneficios.component';
import { BeneficioService } from './core/services/beneficio.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

describe('AppComponent', () => {
  it('deve criar o app', () => {
    const serviceMock = {
      list: jest.fn().mockReturnValue(of([]))
    };

    TestBed.configureTestingModule({
      imports: [AppComponent, BeneficiosComponent],
      providers: [
        { provide: BeneficioService, useValue: serviceMock },
        MessageService
      ]
    });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
