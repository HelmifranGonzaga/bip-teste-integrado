import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/services/auth.service';

describe('HeaderComponent - Logic', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    const authServiceMock = {
      getAuthUser$: jest.fn().mockReturnValue(of(null)),
      logout: jest.fn()
    };
    const messageServiceMock = {
      add: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: MessageService, useValue: messageServiceMock }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    messageService = TestBed.inject(MessageService);

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges to avoid template compilation issues
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('properties', () => {
    it('should have authUser$ observable', () => {
      expect(component.authUser$).toBeDefined();
    });
  });

  describe('onLogout', () => {
    it('should call authService.logout()', () => {
      component.onLogout();
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should show info message', () => {
      component.onLogout();
      expect(messageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'info',
          summary: 'Logout'
        })
      );
    });

    it('should navigate to login', () => {
      component.onLogout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should call all three actions in order', () => {
      const order: string[] = [];

      (authService.logout as jest.Mock).mockImplementation(() => {
        order.push('logout');
      });
      (messageService.add as jest.Mock).mockImplementation(() => {
        order.push('message');
      });
      (router.navigate as jest.Mock).mockImplementation(() => {
        order.push('navigate');
      });

      component.onLogout();

      expect(order).toEqual(['logout', 'message', 'navigate']);
    });
  });
});
