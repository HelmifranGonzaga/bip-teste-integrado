import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  let authService: AuthService;
  let messageService: jest.Mocked<MessageService>;

  beforeEach(() => {
    const messageServiceMock = {
      add: jest.fn()
    } as unknown as jest.Mocked<MessageService>;

    TestBed.configureTestingModule({
      providers: [AuthService, provideRouter([]), { provide: MessageService, useValue: messageServiceMock }]
    });

    authService = TestBed.inject(AuthService);
    messageService = TestBed.inject(MessageService) as jest.Mocked<MessageService>;
  });

  it('allows admin users', () => {
    jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    jest.spyOn(authService, 'getAuthUser').mockReturnValue({
      username: 'admin',
      role: 'ADMIN',
      expiresAt: Date.now() + 1000
    });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, { url: '/usuarios' } as any));

    expect(result).toBe(true);
  });

  it('redirects authenticated non-admin users', () => {
    jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    jest.spyOn(authService, 'getAuthUser').mockReturnValue({
      username: 'user',
      role: 'USER',
      expiresAt: Date.now() + 1000
    });

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, { url: '/usuarios' } as any)) as UrlTree;

    expect(messageService.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'warn',
        summary: 'Acesso negado'
      })
    );
    expect(result.toString()).toContain('/beneficios');
  });

  it('redirects unauthenticated users to login', () => {
    jest.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, { url: '/usuarios' } as any)) as UrlTree;

    expect(result.toString()).toContain('/login');
    expect(result.toString()).toContain('returnUrl=%2Fusuarios');
  });
});
