import { TestBed } from '@angular/core/testing';
import { ConnectionErrorComponent } from './connection-error.component';

describe('ConnectionErrorComponent', () => {
  async function setup(inputs: Partial<{
    errorMessage: string;
    networkOnline: boolean;
    reconnecting: boolean;
    reconnectAttempts: number;
    reconnectExhausted: boolean;
    countdown: number;
    diagnosticCode: string;
    isProduction: boolean;
  }> = {}) {
    await TestBed.configureTestingModule({
      imports: [ConnectionErrorComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(ConnectionErrorComponent);
    const component = fixture.componentInstance;

    if (inputs.errorMessage !== undefined) component.errorMessage = inputs.errorMessage;
    if (inputs.networkOnline !== undefined) component.networkOnline = inputs.networkOnline;
    if (inputs.reconnecting !== undefined) component.reconnecting = inputs.reconnecting;
    if (inputs.reconnectAttempts !== undefined) component.reconnectAttempts = inputs.reconnectAttempts;
    if (inputs.reconnectExhausted !== undefined) component.reconnectExhausted = inputs.reconnectExhausted;
    if (inputs.countdown !== undefined) component.countdown = inputs.countdown;
    if (inputs.diagnosticCode !== undefined) component.diagnosticCode = inputs.diagnosticCode;
    if (inputs.isProduction !== undefined) component.isProduction = inputs.isProduction;

    fixture.detectChanges();
    return { fixture, component };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should emit retry event', async () => {
    const { component } = await setup();
    const spy = vi.fn();
    component.retry.subscribe(spy);
    component.onRetry();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit reload event', async () => {
    const { component } = await setup();
    const spy = vi.fn();
    component.reload.subscribe(spy);
    component.onReload();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit contactSupport event', async () => {
    const { component } = await setup();
    const spy = vi.fn();
    component.contactSupport.subscribe(spy);
    component.onContactSupport();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit copyDiagnostic event', async () => {
    const { component } = await setup();
    const spy = vi.fn();
    component.copyDiagnostic.subscribe(spy);
    component.onCopyDiagnostic();
    expect(spy).toHaveBeenCalled();
  });

  it('should use default input values', async () => {
    const { component } = await setup();
    expect(component.errorMessage).toBe('');
    expect(component.networkOnline).toBe(true);
    expect(component.reconnecting).toBe(false);
    expect(component.reconnectAttempts).toBe(0);
    expect(component.reconnectExhausted).toBe(false);
    expect(component.countdown).toBe(0);
    expect(component.diagnosticCode).toBe('');
    expect(component.isProduction).toBe(false);
  });

  it('should accept input values', async () => {
    const { component } = await setup({
      errorMessage: 'Erro de conexão',
      networkOnline: false,
      reconnecting: true,
      reconnectAttempts: 2,
      reconnectExhausted: false,
      countdown: 3,
      diagnosticCode: 'BIP-CONN-123',
      isProduction: true
    });
    expect(component.errorMessage).toBe('Erro de conexão');
    expect(component.networkOnline).toBe(false);
    expect(component.reconnecting).toBe(true);
    expect(component.reconnectAttempts).toBe(2);
    expect(component.countdown).toBe(3);
    expect(component.diagnosticCode).toBe('BIP-CONN-123');
    expect(component.isProduction).toBe(true);
  });
});
