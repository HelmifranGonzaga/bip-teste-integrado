import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ErrorService } from './error.service';
import { AppError, DisplayError } from '../errors/app-error.model';

describe('ErrorService', () => {
  let service: ErrorService;
  let messageService: vi.Mocked<MessageService>;

  beforeEach(() => {
    const messageServiceMock = {
      add: vi.fn()
    } as unknown as vi.Mocked<MessageService>;

    TestBed.configureTestingModule({
      providers: [ErrorService, { provide: MessageService, useValue: messageServiceMock }]
    });

    service = TestBed.inject(ErrorService);
    messageService = TestBed.inject(MessageService) as vi.Mocked<MessageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showError', () => {
    it('should show AppError correctly', () => {
      const error: AppError = {
        code: 'CONFLICT',
        message: 'Saldo insuficiente',
        timestamp: '2026-03-29T01:25:09Z',
        correlationId: 'test-123'
      };

      const result = service.showError(error);

      expect(result.code).toBe('CONFLICT');
      expect(result.detail).toBe('Saldo insuficiente');
      expect(result.correlationId).toBe('test-123');
    });

    it('should show success toast', () => {
      service.showSuccess('Operação realizada', 'Sucesso!');

      expect(messageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
          summary: 'Operação realizada'
        })
      );
    });
  });

  describe('getCorrelationId', () => {
    it('should extract correlationId from AppError', () => {
      const error: AppError = {
        code: 'CONFLICT',
        message: 'Error',
        timestamp: '2026-03-29T01:25:09Z',
        correlationId: 'ABC-123'
      };

      const id = service.getCorrelationId(error);
      expect(id).toBe('ABC-123');
    });

    it('should return undefined if no correlationId', () => {
      const error: DisplayError = {
        summary: 'Error',
        detail: 'Something happened',
        code: 'GENERIC',
        isConnectionError: false,
        httpStatus: 500
      };

      const id = service.getCorrelationId(error);
      expect(id).toBeUndefined();
    });
  });

  describe('isCriticalError', () => {
    it('should identify server errors as critical', () => {
      const error: DisplayError = {
        summary: 'Server Error',
        detail: 'Internal error',
        code: 'INTERNAL_ERROR',
        isConnectionError: false,
        httpStatus: 500
      };

      expect(service.isCriticalError(error)).toBe(true);
    });

    it('should not identify validation errors as critical', () => {
      const error: DisplayError = {
        summary: 'Invalid data',
        detail: 'Please check your inputs',
        code: 'VALIDATION_ERROR',
        isConnectionError: false,
        httpStatus: 400
      };

      expect(service.isCriticalError(error)).toBe(false);
    });
  });
});
