import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioFormComponent } from './beneficio-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BeneficioFormComponent', () => {
  let component: BeneficioFormComponent;
  let fixture: ComponentFixture<BeneficioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioFormComponent, ReactiveFormsModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form.value).toEqual({
      nome: '',
      descricao: '',
      valor: null,
      ativo: true
    });
    expect(component.form.valid).toBe(false);
  });

  it('should populate form when editingBeneficio is set', () => {
    component.editingBeneficio = { id: 1, nome: 'Teste', descricao: 'Desc', valor: 100, ativo: false, version: 0 };
    expect(component.form.value).toEqual({
      nome: 'Teste',
      descricao: 'Desc',
      valor: 100,
      ativo: false
    });
    expect(component.form.valid).toBe(true);
  });

  it('should emit save event on valid submit', () => {
    jest.spyOn(component.save, 'emit');
    
    component.form.setValue({
      nome: 'Novo',
      descricao: 'Nova desc',
      valor: 50,
      ativo: true
    });

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith({
      id: null,
      payload: { nome: 'Novo', descricao: 'Nova desc', valor: 50, ativo: true }
    });
  });

  it('should emit cancel event on cancel', () => {
    jest.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});
