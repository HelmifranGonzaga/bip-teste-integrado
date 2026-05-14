import { TestBed } from '@angular/core/testing';
import { BeneficioStateService } from './beneficio-state.service';

describe('BeneficioStateService', () => {
  let service: BeneficioStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeneficioStateService]
    });
    service = TestBed.inject(BeneficioStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with count 0', () => {
    expect(service.count()).toBe(0);
  });

  it('should return hasBeneficios as false when count is 0', () => {
    expect(service.hasBeneficios()).toBe(false);
  });

  it('should update count', () => {
    service.updateCount(5);
    expect(service.count()).toBe(5);
  });

  it('should return hasBeneficios as true when count is greater than 0', () => {
    service.updateCount(3);
    expect(service.hasBeneficios()).toBe(true);
  });

  it('should update count multiple times', () => {
    service.updateCount(10);
    expect(service.count()).toBe(10);

    service.updateCount(0);
    expect(service.count()).toBe(0);
    expect(service.hasBeneficios()).toBe(false);

    service.updateCount(1);
    expect(service.count()).toBe(1);
    expect(service.hasBeneficios()).toBe(true);
  });
});
