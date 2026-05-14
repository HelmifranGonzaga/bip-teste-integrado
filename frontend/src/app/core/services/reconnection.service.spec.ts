import { TestBed } from '@angular/core/testing';
import { ReconnectionService } from './reconnection.service';

describe('ReconnectionService', () => {
  let service: ReconnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReconnectionService]
    });
    service = TestBed.inject(ReconnectionService);
    vi.useFakeTimers();
    vi.setSystemTime(1_700_000_000_000);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with default state', () => {
    expect(service.reconnecting()).toBe(false);
    expect(service.reconnectAttempts()).toBe(0);
    expect(service.reconnectExhausted()).toBe(false);
    expect(service.countdown()).toBe(0);
    expect(service.diagnosticCode()).toBe('');
    expect(service.networkOnline()).toBe(true);
  });

  it('should start reconnection loop on start()', () => {
    service.start(() => {});
    expect(service.reconnecting()).toBe(true);
    expect(service.reconnectAttempts()).toBe(0);
    expect(service.countdown()).toBe(5);
    expect(service.diagnosticCode()).toContain('BIP-CONN-');
  });

  it('should call onRetry callback at each interval', () => {
    const onRetry = vi.fn();
    service.start(onRetry);

    vi.advanceTimersByTime(5000);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(service.reconnectAttempts()).toBe(1);

    vi.advanceTimersByTime(5000);
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(service.reconnectAttempts()).toBe(2);
    expect(service.countdown()).toBe(5);
  });

  it('should stop after max attempts', () => {
    const onRetry = vi.fn();
    service.start(onRetry);

    vi.advanceTimersByTime(20000);
    expect(onRetry).toHaveBeenCalledTimes(3);
    expect(service.reconnectAttempts()).toBe(3);
    expect(service.reconnecting()).toBe(false);
    expect(service.reconnectExhausted()).toBe(true);
  });

  it('should update countdown every second', () => {
    const onRetry = vi.fn();
    service.start(onRetry);
    expect(service.countdown()).toBe(5);

    vi.advanceTimersByTime(1000);
    expect(service.countdown()).toBe(4);

    vi.advanceTimersByTime(2000);
    expect(service.countdown()).toBe(2);
  });

  it('should stop loop with stop()', () => {
    const onRetry = vi.fn();
    service.start(onRetry);
    expect(service.reconnecting()).toBe(true);

    service.stop();
    expect(service.reconnecting()).toBe(false);
    expect(service.countdown()).toBe(0);

    vi.advanceTimersByTime(5000);
    expect(onRetry).not.toHaveBeenCalled();
  });

  it('should update network status with setOnline()', () => {
    service.setOnline(false);
    expect(service.networkOnline()).toBe(false);
    expect(service.diagnosticCode()).toContain('-OFF');

    service.setOnline(true);
    expect(service.networkOnline()).toBe(true);
    expect(service.diagnosticCode()).toContain('-ON');
  });

  it('should not exceed max attempts in multiple start calls', () => {
    const onRetry = vi.fn();
    service.start(onRetry);
    vi.advanceTimersByTime(5000);
    expect(service.reconnectAttempts()).toBe(1);

    service.stop();
    vi.advanceTimersByTime(5000);

    service.start(onRetry);
    vi.advanceTimersByTime(15000);
    expect(service.reconnectAttempts()).toBe(3);
    expect(service.reconnectExhausted()).toBe(true);
  });
});
