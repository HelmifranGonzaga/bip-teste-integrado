import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent - Lógica', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let messageService: jest.Mocked<MessageService>;

  beforeEach(() => {
    sessionStorage.clear();

    authService = {
      login: jest.fn()
    } as unknown as jest.Mocked<AuthService>;
    router = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;
    messageService = {
      add: jest.fn()
    } as unknown as jest.Mocked<MessageService>;

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
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
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should initialize with loading false', () => {
    expect(component.loading).toBeFalsy();
  });

  describe('Form Control - Username', () => {
    it('should be required', () => {
      const control = component.loginForm.get('username');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should be valid with value', () => {
      const control = component.loginForm.get('username');
      control?.setValue('admin');
      expect(control?.valid).toBeTruthy();
    });
  });

  describe('Form Control - Password', () => {
    it('should be required', () => {
      const control = component.loginForm.get('password');
      control?.setValue('');
      expect(control?.hasError('required')).toBeTruthy();
    });

    it('should be valid with value', () => {
      const control = component.loginForm.get('password');
      control?.setValue('password123');
      expect(control?.valid).toBeTruthy();
    });
  });

  describe('isFieldInvalid', () => {
    it('should return false for valid untouched field', () => {
      const username = component.loginForm.get('username');
      username?.setValue('admin');
      expect(component.isFieldInvalid('username')).toBeFalsy();
    });

    it('should return false for valid touched field', () => {
      const username = component.loginForm.get('username');
      username?.setValue('admin');
      username?.markAsTouched();
      expect(component.isFieldInvalid('username')).toBeFalsy();
    });

    it('should return false for invalid untouched field', () => {
      const username = component.loginForm.get('username');
      username?.setValue('');
      expect(component.isFieldInvalid('username')).toBeFalsy();
    });

    it('should return true for invalid touched field', () => {
      const username = component.loginForm.get('username');
      username?.setValue('');
      username?.markAsTouched();
      expect(component.isFieldInvalid('username')).toBeTruthy();
    });
  });

  describe('onLogin - Validation', () => {
    it('should not call authService.login when form is invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });
      component.onLogin();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when form is invalid', () => {
      component.loginForm.patchValue({
        username: '',
        password: ''
      });

      component.onLogin();

      expect(component.loginForm.get('username')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('should not call authService.login when username is empty', () => {
      component.loginForm.patchValue({
        username: '',
        password: 'password'
      });
      component.onLogin();
      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should not call authService.login when password is empty', () => {
      component.loginForm.patchValue({
        username: 'admin',
        password: ''
      });
      component.onLogin();
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('onLogin - Success', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        username: 'testuser',
        password: 'testpass'
      });
    });

    it('should call authService.login with correct credentials', () => {
      (authService.login as jest.Mock).mockReturnValue(
        of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 })
      );

      component.onLogin();

      expect(authService.login).toHaveBeenCalledWith('testuser', 'testpass');
    });

    it('should persist remembered username when rememberMe is enabled', () => {
      (authService.login as jest.Mock).mockReturnValue(
        of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 })
      );

      component.rememberMe = true;
      component.onLogin();

      expect(sessionStorage.getItem('remembered_username')).toBe('testuser');
    });

    it('should clear remembered username when rememberMe is disabled', () => {
      sessionStorage.setItem('remembered_username', 'old-user');

      (authService.login as jest.Mock).mockReturnValue(
        of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 })
      );

      component.rememberMe = false;
      component.onLogin();

      expect(sessionStorage.getItem('remembered_username')).toBeNull();
    });

    it('should set loading to false after successful login', (done) => {
      (authService.login as jest.Mock).mockReturnValue(
        of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 })
      );

      component.onLogin();

      setTimeout(() => {
        expect(component.loading).toBeFalsy();
        done();
      }, 50);
    });

    it('should show success message after successful login', (done) => {
      (authService.login as jest.Mock).mockReturnValue(
        of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 })
      );

      component.onLogin();

      setTimeout(() => {
        expect(messageService.add).toHaveBeenCalledWith(
          expect.objectContaining({
            severity: 'success',
            summary: 'Login bem-sucedido'
          })
        );
        done();
      }, 50);
    });

    it('should navigate to beneficios after successful login', (done) => {
      (authService.login as jest.Mock).mockReturnValue(
        of({ accessToken: 'token123', tokenType: 'Bearer', expiresIn: 3600000 })
      );

      component.onLogin();

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/beneficios']);
        done();
      }, 50);
    });
  });

  describe('onLogin - Failure', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        username: 'admin',
        password: 'wrongpassword'
      });
    });

    it('should set loading to false on login failure', (done) => {
      (authService.login as jest.Mock).mockReturnValue(
        throwError(() => new Error('Unauthorized'))
      );

      component.onLogin();

      setTimeout(() => {
        expect(component.loading).toBeFalsy();
        done();
      }, 50);
    });

    it('should show error message on login failure', (done) => {
      (authService.login as jest.Mock).mockReturnValue(
        throwError(() => new Error('Unauthorized'))
      );

      component.onLogin();

      setTimeout(() => {
        expect(messageService.add).toHaveBeenCalledWith(
          expect.objectContaining({
            severity: 'error',
            summary: 'Erro na autenticação'
          })
        );
        done();
      }, 100);
    }, 10000);

    it('should not navigate on login failure', (done) => {
      (authService.login as jest.Mock).mockReturnValue(
        throwError(() => new Error('Unauthorized'))
      );

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

    it('should return auth error for UNAUTHORIZED code', () => {
      const error = { code: 'UNAUTHORIZED' };
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

    it('should return generic error for null error', () => {
      const error = null;
      const result = component['getErrorMessage'](error);
      expect(result.summary).toBe('Erro na autenticação');
      expect(result.detail).toContain('Erro desconhecido');
    });
  });
