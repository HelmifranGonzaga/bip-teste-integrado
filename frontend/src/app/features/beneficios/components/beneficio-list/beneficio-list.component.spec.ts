import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioListComponent } from './beneficio-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BeneficioListComponent', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioListComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BeneficioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit event', () => {
    jest.spyOn(component.edit, 'emit');
    const beneficio = { id: 1, nome: 'Teste', descricao: 'Desc', valor: 100, ativo: true, version: 0 };
    
    component.edit.emit(beneficio);
    
    expect(component.edit.emit).toHaveBeenCalledWith(beneficio);
  });

  it('should emit remove event', () => {
    jest.spyOn(component.remove, 'emit');
    
    component.remove.emit(1);
    
    expect(component.remove.emit).toHaveBeenCalledWith(1);
  });
});
