import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioFormComponent } from './beneficio-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('BeneficioFormComponent', () => {
  let component: BeneficioFormComponent;
  let fixture: ComponentFixture<BeneficioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioFormComponent, ReactiveFormsModule]
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
    component.editingBeneficio = {
      id: 1,
      nome: 'Teste',
      descricao: 'Desc',
      valor: 100,
      ativo: false,
      version: 0
    };
    expect(component.form.value).toEqual({
      nome: 'Teste',
      descricao: 'Desc',
      valor: 100,
      ativo: false
    });
    expect(component.form.valid).toBe(true);
  });

  it('should emit save event with id when editing existing beneficio', () => {
    jest.spyOn(component.save, 'emit');

    component.editingBeneficio = {
      id: 7,
      nome: 'Editado',
      descricao: 'Descricao editada',
      valor: 120,
      ativo: false,
      version: 2
    };

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith({
      id: 7,
      payload: {
        nome: 'Editado',
        descricao: 'Descricao editada',
        valor: 120,
        ativo: false
      }
    });
  });

  it.each([
    { nome: 'ab', valid: false },
    { nome: 'abc', valid: true },
    { nome: 'a'.repeat(101), valid: false }
  ])('should validate nome boundaries for %#', ({ nome, valid }) => {
    component.form.patchValue({
      nome,
      descricao: '',
      valor: 10,
      ativo: true
    });

    expect(component.form.get('nome')?.valid).toBe(valid);
  });

  it.each([
    { valor: null, valid: false },
    { valor: 0, valid: false },
    { valor: 0.01, valid: true },
    { valor: 10, valid: true }
  ])('should validate valor boundaries for %#', ({ valor, valid }) => {
    component.form.patchValue({
      nome: 'Beneficio valido',
      descricao: '',
      valor,
      ativo: true
    });

    expect(component.form.get('valor')?.valid).toBe(valid);
  });

  it('should invalidate descricao above max length', () => {
    component.form.patchValue({
      nome: 'Beneficio valido',
      descricao: 'a'.repeat(501),
      valor: 10,
      ativo: true
    });

    expect(component.form.get('descricao')?.valid).toBe(false);
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
    expect(component.form.value).toEqual({
      nome: '',
      descricao: '',
      valor: null,
      ativo: true
    });
  });

  it('should emit cancel event on cancel', () => {
    jest.spyOn(component.cancelOperation, 'emit');
    component.onCancel();
    expect(component.cancelOperation.emit).toHaveBeenCalled();
  });
});
