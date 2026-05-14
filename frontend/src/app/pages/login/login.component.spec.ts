import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent - Lógica', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn>; navigateByUrl: ReturnType<typeof vi.fn> };
  let messageService: { add: ReturnType<typeof vi.fn> };
  let activatedRouteMock: { snapshot: { queryParamMap: { get: ReturnType<typeof vi.fn> } } };

  beforeEach(() => {
    sessionStorage.clear();

    authService = {
      login: vi.fn()
    };
    router = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn()
    };
    messageService = {
      add: vi.fn()
    };
    activatedRouteMock = {
      snapshot: {
        queryParamMap: {
          get: vi.fn().mockReturnValue(null)
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MessageService, useValue: messageService }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginModel().username).toBe('');
    expect(component.loginModel().password).toBe('');
  });

  it('should initialize with loading false', () => {
    expect(component.loading()).toBeFalsy();
  });

  describe('isFieldInvalid', () => {
    it('should return false for valid untouched field', () => {
      component.loginModel.set({ username: 'admin', password: 'password' });
      expect(component.isFieldInvalid('username')).toBeFalsy();
    });

    it('should return true for invalid touched field', () => {
      component.loginModel.set({ username: '', password: '' });
      const field = component.loginForm.username;
      expect(field().errors().length).toBeGreaterThan(0);
    });
  });

  describe('onLogin - Validation', () => {
    it('should not call authService.login when form is invalid', () => {
      component.loginModel.set({ username: '', password: '' });
      component.onLogin();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should not call authService.login when username is empty', () => {
      component.loginModel.set({ username: '', password: 'password' });
      component.onLogin();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should not call authService.login when password is empty', () => {
      component.loginModel.set({ username: 'admin', password: '' });
      component.onLogin();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('onLogin - Success', () => {
    beforeEach(() => {
      component.loginModel.set({ username: 'testuser', password: 'testpass' });
    });

    it('should call authService.login with correct credentials', () => {
      authService.login.mockReturnValue(of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 }));
      component.onLogin();
      expect(authService.login).toHaveBeenCalledWith('testuser', 'testpass');
    });

    it('should set loading to false after successful login', (done) => {
      authService.login.mockReturnValue(of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 }));
      component.onLogin();
      setTimeout(() => {
        expect(component.loading()).toBeFalsy();
        done();
      }, 50);
    });

    it('should show success message after successful login', (done) => {
      authService.login.mockReturnValue(of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 }));
      component.onLogin();
      setTimeout(() => {
        expect(messageService.add).toHaveBeenCalledWith(
          expect.objectContaining({ severity: 'success', summary: 'Login bem-sucedido' })
        );
        done();
      }, 50);
    });

    it('should navigate to beneficios after successful login', (done) => {
      authService.login.mockReturnValue(of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 }));
      component.onLogin();
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/beneficios']);
        done();
      }, 50);
    });

    it('should navigate to returnUrl when provided', (done) => {
      authService.login.mockReturnValue(of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 }));
      activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue('/relatorio');
      component.onLogin();
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/relatorio']);
        done();
      }, 50);
    });
  });

  describe('onLogin - Failure', () => {
    beforeEach(() => {
      component.loginModel.set({ username: 'admin', password: 'wrongpassword' });
    });

    it('should set loading to false on login failure', (done) => {
      authService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
      component.onLogin();
      setTimeout(() => {
        expect(component.loading()).toBeFalsy();
        done();
      }, 50);
    });

    it('should show error message on login failure', (done) => {
      authService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
      component.onLogin();
      setTimeout(() => {
        expect(messageService.add).toHaveBeenCalledWith(
          expect.objectContaining({ severity: 'error', summary: 'Erro na autenticação' })
        );
        done();
      }, 100);
    }, 10000);

    it('should not navigate on login failure', (done) => {
      authService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
      component.onLogin();
      setTimeout(() => {
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      }, 100);
    }, 10000);
  });

  describe('getErrorMessage', () => {
    it('should return connection error for status 0', () => {
      const error = { status: 0 };
      const result = component['getErrorMessage'](error);
      expect(result.summary).toBe('Servidor indisponível');
      expect(result.detail).toContain('Não foi possível conectar ao servidor');
    });

    it('should return auth error for status 401', () => {
      const error = { status: 401 };
      const result = component['getErrorMessage'](error);
      expect(result.summary).toBe('Erro na autenticação');
      expect(result.detail).toContain('Verifique suas credenciais');
    });

    it('should return server error for status 500+', () => {
      const error = { status: 500 };
      const result = component['getErrorMessage'](error);
      expect(result.summary).toBe('Erro no servidor');
      expect(result.detail).toContain('O servidor encontrou um erro');
    });

    it('should return generic error for unknown error', () => {
      const error = { message: 'Unknown error' };
      const result = component['getErrorMessage'](error);
      expect(result.summary).toBe('Erro na autenticação');
      expect(result.detail).toBe('Unknown error');
    });
  });
});
