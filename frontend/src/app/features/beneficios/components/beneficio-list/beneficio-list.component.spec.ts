import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { BeneficioListComponent } from './beneficio-list.component';

describe('BeneficioListComponent', () => {
  let component: BeneficioListComponent;
  let fixture: ComponentFixture<BeneficioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficioListComponent]
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
    const beneficio = {
      id: 1,
      nome: 'Teste',
      descricao: 'Desc',
      valor: 100,
      ativo: true,
      version: 0,
      cnpj: null as string | null
    };

    component.edit.emit(beneficio);

    expect(component.edit.emit).toHaveBeenCalledWith(beneficio);
  });

  it('should emit remove event', () => {
    jest.spyOn(component.remove, 'emit');

    component.remove.emit(1);

    expect(component.remove.emit).toHaveBeenCalledWith(1);
  });

  it('should expose global search with PT placeholder and aria-label', () => {
    const el = fixture.nativeElement.querySelector('#beneficio-list-global-filter') as HTMLInputElement;

    expect(el).toBeTruthy();
    expect(el.placeholder).toBe('Buscar por nome, descrição, valor ou CNPJ');
    expect(el.getAttribute('aria-label')).toBe('Buscar na tabela por nome, descrição, valor ou CNPJ');
  });

  it('should delegate global filter to table.filterGlobal', () => {
    const table = { filterGlobal: jest.fn() } as Pick<Table, 'filterGlobal'> as Table;
    const input = document.createElement('input');
    input.value = 'acme';

    component.onGlobalFilter(table, { target: input } as unknown as Event);

    expect(table.filterGlobal).toHaveBeenCalledWith('acme', 'contains');
  });

  it('should derive cnpjNormalizado and cnpjMascarado from raw API value (stored without mask)', () => {
    component.beneficios = [
      {
        id: 1,
        nome: 'Vale Alimentação',
        descricao: 'Auxílio',
        valor: 850,
        ativo: true,
        version: 0,
        // Backend persiste sem máscara, em caixa alta.
        cnpj: '12ABC34501DE35'
      }
    ];

    const rows = component.beneficios;

    expect(rows).toHaveLength(1);
    expect(rows[0].cnpj).toBe('12ABC34501DE35');
    expect(rows[0].cnpjNormalizado).toBe('12ABC34501DE35');
    expect(rows[0].cnpjMascarado).toBe('12.ABC.345/01DE-35');
  });

  it('should leave cnpjNormalizado and cnpjMascarado empty when cnpj is null', () => {
    component.beneficios = [
      {
        id: 2,
        nome: 'Plano de Saúde',
        descricao: 'Cobertura',
        valor: 1200,
        ativo: true,
        version: 0,
        cnpj: null
      }
    ];

    expect(component.beneficios[0].cnpjNormalizado).toBe('');
    expect(component.beneficios[0].cnpjMascarado).toBe('');
  });

  it('should declare cnpjNormalizado and cnpjMascarado as global filter fields (matches with or without mask)', () => {
    const tableInstance = fixture.debugElement.query(By.directive(Table))?.componentInstance as Table;

    expect(tableInstance).toBeTruthy();
    expect(tableInstance.globalFilterFields).toEqual(
      expect.arrayContaining(['nome', 'descricao', 'valor', 'cnpjNormalizado', 'cnpjMascarado'])
    );
  });
});
