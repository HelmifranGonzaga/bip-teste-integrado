import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
    });

    it('should allow access', () => {
      const route = {} as any;
      const state = { url: '/beneficios' } as any;

      const result = TestBed.runInInjectionContext(() => authGuard(route, state));

      expect(result).toBe(true);
    });

    it('should not redirect when authenticated', () => {
      const createUrlTreeSpy = jest.spyOn(router, 'createUrlTree');
      const route = {} as any;
      const state = { url: '/beneficios' } as any;

      TestBed.runInInjectionContext(() => authGuard(route, state));

      expect(createUrlTreeSpy).not.toHaveBeenCalled();
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    });

    it('should redirect to login', () => {
      const route = {} as any;
      const state = { url: '/beneficios' } as any;

      const result = TestBed.runInInjectionContext(() => authGuard(route, state));

      expect(result).toBeInstanceOf(UrlTree);
    });

    it('should redirect to /login with returnUrl query param', () => {
      const route = {} as any;
      const state = { url: '/beneficios' } as any;

      const result = TestBed.runInInjectionContext(() => authGuard(route, state)) as UrlTree;

      expect(result.toString()).toContain('/login');
      expect(result.toString()).toContain('returnUrl=%2Fbeneficios');
    });

    it('should preserve query parameters in returnUrl', () => {
      const route = {} as any;
      const state = { url: '/beneficios?filter=active' } as any;

      const result = TestBed.runInInjectionContext(() => authGuard(route, state)) as UrlTree;

      expect(result.toString()).toContain('returnUrl=%2Fbeneficios%3Ffilter%3Dactive');
    });
  });

  describe('authentication state changes', () => {
    it('should allow access when authenticated', () => {
      const isAuthSpy = jest.spyOn(authService, 'isAuthenticated').mockReturnValue(true);
      const route = {} as any;
      const state = { url: '/beneficios' } as any;

      const result = TestBed.runInInjectionContext(() => authGuard(route, state));

      expect(result).toBe(true);
      expect(isAuthSpy).toHaveBeenCalled();
    });

    it('should redirect when not authenticated', () => {
      jest.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
      const route = {} as any;
      const state = { url: '/beneficios' } as any;

      const result = TestBed.runInInjectionContext(() => authGuard(route, state));

      expect(result).toBeInstanceOf(UrlTree);
    });
  });
});

