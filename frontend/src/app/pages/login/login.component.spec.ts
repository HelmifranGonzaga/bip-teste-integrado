import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginComponent - Lógica', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn()
    };
    const routerMock = {
      navigate: jest.fn()
    };
    const messageServiceMock = {
      add: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MessageService, useValue: messageServiceMock }
      ]
    }).overrideComponent(LoginComponent, {
      remove: {
        imports: [] // Remove problematic imports in test
      }
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);

    // Skip creating component view to avoid template initialization
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid template compilation
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
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (authService.login as jest.Mock).mockReturnValue(
        throwError(() => new Error('Unauthorized'))
      );

      component.onLogin();

      setTimeout(() => {
        expect(component.loading).toBeFalsy();
        consoleSpy.mockRestore();
        done();
      }, 50);
    });

    it('should show error message on login failure', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
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
        consoleSpy.mockRestore();
        done();
      }, 100);
    }, 10000);

    it('should not navigate on login failure', (done) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (authService.login as jest.Mock).mockReturnValue(
        throwError(() => new Error('Unauthorized'))
      );

      component.onLogin();

      setTimeout(() => {
        expect(router.navigate).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
        done();
      }, 100);
    }, 10000);
  });
});
