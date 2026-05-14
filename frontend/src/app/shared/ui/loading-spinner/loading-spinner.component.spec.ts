import { TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  async function setup(inputs: { loading?: boolean; title?: string; description?: string } = {}) {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(LoadingSpinnerComponent);
    const component = fixture.componentInstance;
    if (inputs.loading !== undefined) component.loading = inputs.loading;
    if (inputs.title !== undefined) component.title = inputs.title;
    if (inputs.description !== undefined) component.description = inputs.description;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should have default values', async () => {
    const { component } = await setup();
    expect(component.loading).toBe(false);
    expect(component.title).toBe('Carregando...');
    expect(component.description).toBe('Aguarde um instante.');
  });

  it('should accept inputs', async () => {
    const { component } = await setup({ loading: true, title: 'Carregando usuários', description: 'Buscando lista...' });
    expect(component.loading).toBe(true);
    expect(component.title).toBe('Carregando usuários');
    expect(component.description).toBe('Buscando lista...');
  });
});
