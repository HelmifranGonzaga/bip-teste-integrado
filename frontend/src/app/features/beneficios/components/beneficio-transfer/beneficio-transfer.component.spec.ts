import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioTransferComponent } from './beneficio-transfer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BeneficioTransferComponent', () => {
  let component: BeneficioTransferComponent;
  let fixture: ComponentFixture<BeneficioTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioTransferComponent, ReactiveFormsModule, NoopAnimationsModule]
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

  it('should emit cancel event on cancel', () => {
    jest.spyOn(component.cancel, 'emit');
    
    component.form.setValue({
      fromId: 1,
      toId: 2,
      amount: 100
    });

    component.onCancel();

    expect(component.cancel.emit).toHaveBeenCalled();
    expect(component.form.value).toEqual({ fromId: null, toId: null, amount: null });
  });
});
