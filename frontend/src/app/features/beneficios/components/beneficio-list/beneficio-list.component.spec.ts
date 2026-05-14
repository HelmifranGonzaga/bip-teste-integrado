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
    vi.spyOn(component.edit, 'emit');
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
    vi.spyOn(component.remove, 'emit');

    component.remove.emit(1);

    expect(component.remove.emit).toHaveBeenCalledWith(1);
  });

  it('should delegate global filter to table.filterGlobal', () => {
    const table = { filterGlobal: vi.fn() } as Pick<Table, 'filterGlobal'> as Table;

    component.onGlobalFilter(table, 'acme');

    expect(table.filterGlobal).toHaveBeenCalledWith('acme', 'contains');
  });

  it('should normalize CNPJ-like global filter term (masked input)', () => {
    const table = { filterGlobal: vi.fn() } as Pick<Table, 'filterGlobal'> as Table;

    component.onGlobalFilter(table, 'YK.4B6.MX4/0001-46');

    expect(table.filterGlobal).toHaveBeenCalledWith('YK4B6MX4000146', 'contains');
  });

  it('should strip invisible characters from global filter input', () => {
    const table = { filterGlobal: vi.fn() } as Pick<Table, 'filterGlobal'> as Table;

    component.onGlobalFilter(table, 'YK4B6\u200BMX4000146');

    expect(table.filterGlobal).toHaveBeenCalledWith('YK4B6MX4000146', 'contains');
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
    expect(rows[0].cnpjFiltro).toBe('12ABC34501DE35 12.ABC.345/01DE-35');
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
    expect(component.beneficios[0].cnpjFiltro).toBe('');
  });

  it('should declare cnpjFiltro as global filter field (CNPJ com ou sem máscara)', () => {
    const tableInstance = fixture.debugElement.query(By.directive(Table))?.componentInstance as Table;

    expect(tableInstance).toBeTruthy();
    expect(tableInstance.globalFilterFields).toEqual(
      expect.arrayContaining(['nome', 'descricao', 'valor', 'cnpjFiltro'])
    );
  });
});
