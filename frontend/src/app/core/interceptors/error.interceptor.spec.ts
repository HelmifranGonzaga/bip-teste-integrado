import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let environmentInjector: EnvironmentInjector;
  let messageService: { add: jest.Mock };
  let router: { url: string; navigate: jest.Mock };
  let authService: { logout: jest.Mock };

  beforeEach(() => {
    messageService = {
      add: jest.fn()
    };
    router = {
      url: '/beneficios',
      navigate: jest.fn()
    };
    authService = {
      logout: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: authService }
      ]
    });

    environmentInjector = TestBed.inject(EnvironmentInjector);
  });

  it('should redirect to login and logout on 401 for protected requests', (done) => {
    const request = new HttpRequest('GET', 'http://localhost:8082/api/v1/beneficios');
    const error = new HttpErrorResponse({ status: 401, error: { message: 'Unauthorized' } });

    runInInjectionContext(environmentInjector, () => {
      errorInterceptor(request, () => throwError(() => error)).subscribe({
        error: () => {
          expect(authService.logout).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/login'], {
            queryParams: { returnUrl: '/beneficios' }
          });
          expect(messageService.add).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should not redirect or show global toast for auth login errors', (done) => {
    const request = new HttpRequest('POST', 'http://localhost:8082/api/v1/auth/login');
    const error = new HttpErrorResponse({ status: 401, error: { message: 'Unauthorized' } });

    runInInjectionContext(environmentInjector, () => {
      errorInterceptor(request, () => throwError(() => error)).subscribe({
        error: () => {
          expect(authService.logout).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          expect(messageService.add).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });
});
