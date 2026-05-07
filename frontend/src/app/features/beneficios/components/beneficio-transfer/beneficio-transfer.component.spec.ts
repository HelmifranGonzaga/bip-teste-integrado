import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioTransferComponent } from './beneficio-transfer.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('BeneficioTransferComponent', () => {
  let component: BeneficioTransferComponent;
  let fixture: ComponentFixture<BeneficioTransferComponent>;

  const beneficios = [
    {
      id: 1,
      nome: 'Alimentação',
      descricao: 'Vale refeição',
      valor: 1234.56,
      ativo: true,
      version: 1,
      cnpj: null
    },
    {
      id: 2,
      nome: 'Transporte',
      descricao: 'Vale transporte',
      valor: 789.1,
      ativo: true,
      version: 1,
      cnpj: null
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioTransferComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form.value).toEqual({
      fromId: null,
      toId: null,
      amount: null
    });
    expect(component.form.valid).toBe(false);
  });

  it('should mark the form invalid when transferring to the same beneficio', () => {
    component.form.setValue({
      fromId: 1,
      toId: 1,
      amount: 100
    });

    expect(component.form.errors).toEqual({ sameBeneficio: true });
    expect(component.form.valid).toBe(false);
  });

  it('should format beneficio label with currency and id', () => {
    component.beneficios = beneficios;

    expect(component.getBeneficioLabel(beneficios[0])).toBe('Alimentação (#1) - R$\u00a01.234,56');
  });

  it('should emit transfer event on valid submit', () => {
    jest.spyOn(component.transfer, 'emit');

    component.form.setValue({
      fromId: 1,
      toId: 2,
      amount: 100
    });

    component.onSubmit();

    expect(component.transfer.emit).toHaveBeenCalledWith({
      fromId: 1,
      toId: 2,
      amount: 100
    });
    expect(component.form.value).toEqual({ fromId: null, toId: null, amount: null });
  });

  it('should not emit transfer event while submitting', () => {
    jest.spyOn(component.transfer, 'emit');

    component.submitting = true;
    component.form.setValue({
      fromId: 1,
      toId: 2,
      amount: 100
    });

    component.onSubmit();

    expect(component.transfer.emit).not.toHaveBeenCalled();
    expect(component.form.value).toEqual({
      fromId: 1,
      toId: 2,
      amount: 100
    });
  });

  it('should emit cancel event on cancel', () => {
    jest.spyOn(component.cancelTransfer, 'emit');

    component.form.setValue({
      fromId: 1,
      toId: 2,
      amount: 100
    });

    component.onCancel();

    expect(component.cancelTransfer.emit).toHaveBeenCalled();
    expect(component.form.value).toEqual({ fromId: null, toId: null, amount: null });
  });
});
