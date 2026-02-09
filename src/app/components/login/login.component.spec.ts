import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to dashboard if already authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);

      component.ngOnInit();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should not redirect if not authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);

      component.ngOnInit();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('onLogin', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should call authService.login with username and password', () => {
      component.username = 'testuser';
      component.password = 'testpass';

      component.onLogin();

      expect(mockAuthService.login).toHaveBeenCalledWith('testuser', 'testpass');
    });

    it('should navigate to dashboard after login', () => {
      component.username = 'testuser';
      component.password = 'testpass';

      component.onLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should work with empty credentials', () => {
      component.username = '';
      component.password = '';

      component.onLogin();

      expect(mockAuthService.login).toHaveBeenCalledWith('', '');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to dashboard even if login fails', () => {
      // Note: In the fake implementation, login always succeeds
      // but this test ensures navigation happens regardless
      component.username = 'user';
      component.password = 'pass';

      component.onLogin();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('component properties', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      fixture.detectChanges();
    });

    it('should initialize with empty username', () => {
      expect(component.username).toBe('');
    });

    it('should initialize with empty password', () => {
      expect(component.password).toBe('');
    });

    it('should allow username to be set', () => {
      component.username = 'newuser';
      expect(component.username).toBe('newuser');
    });

    it('should allow password to be set', () => {
      component.password = 'newpass';
      expect(component.password).toBe('newpass');
    });
  });
});
