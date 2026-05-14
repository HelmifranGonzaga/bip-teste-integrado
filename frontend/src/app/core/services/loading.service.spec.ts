import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', () => {
    expect(service.loading()).toBe(false);
    expect(service.uiLoading()).toBe(false);
    expect(service.pendingRequests()).toBe(0);
  });

  it('should increment pending requests on begin', () => {
    service.begin();
    expect(service.pendingRequests()).toBe(1);
    expect(service.loading()).toBe(true);
  });

  it('should decrement pending requests on end', () => {
    service.begin();
    service.begin();
    service.end();
    expect(service.pendingRequests()).toBe(1);
    service.end();
    expect(service.pendingRequests()).toBe(0);
    expect(service.loading()).toBe(false);
  });

  it('should not show uiLoading immediately', () => {
    service.begin();
    expect(service.uiLoading()).toBe(false);
  });

  it('should show uiLoading after delay', () => {
    service.begin();
    vi.advanceTimersByTime(201);
    expect(service.uiLoading()).toBe(true);
  });

  it('should hide uiLoading after end with min visible time', () => {
    service.begin();
    vi.advanceTimersByTime(201);
    expect(service.uiLoading()).toBe(true);

    service.end();
    expect(service.uiLoading()).toBe(true);

    vi.advanceTimersByTime(600);
    expect(service.uiLoading()).toBe(false);
  });

  it('should not show uiLoading if request completes before delay', () => {
    service.begin();
    vi.advanceTimersByTime(100);
    service.end();
    vi.advanceTimersByTime(200);

    expect(service.uiLoading()).toBe(false);
  });

  it('should handle multiple concurrent requests', () => {
    service.begin();
    service.begin();
    service.begin();
    vi.advanceTimersByTime(201);
    expect(service.uiLoading()).toBe(true);

    service.end();
    expect(service.uiLoading()).toBe(true);

    service.end();
    expect(service.uiLoading()).toBe(true);

    service.end();
    vi.advanceTimersByTime(600);
    expect(service.uiLoading()).toBe(false);
  });

  it('should not go negative on end without begin', () => {
    service.end();
    expect(service.pendingRequests()).toBe(0);
    expect(service.loading()).toBe(false);
  });

  it('should reset with reset method', () => {
    service.begin();
    service.begin();
    vi.advanceTimersByTime(201);
    expect(service.pendingRequests()).toBe(2);
    expect(service.loading()).toBe(true);

    service.reset();
    expect(service.pendingRequests()).toBe(0);
    expect(service.loading()).toBe(false);
    expect(service.uiLoading()).toBe(false);
  });
});
