import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let cookieStore: { [key: string]: string } = {};
  let setCookieSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);

    // Reset cookie store
    cookieStore = {};

    // Mock document.cookie getter
    spyOnProperty(document, 'cookie', 'get').and.callFake(() => {
      return Object.keys(cookieStore)
        .map(key => `${key}=${cookieStore[key]}`)
        .join('; ');
    });

    // Mock document.cookie setter
    setCookieSpy = spyOnProperty(document, 'cookie', 'set').and.callFake((cookieString: string) => {
      const parts = cookieString.split(';');
      const [keyValue] = parts;
      const [key, value] = keyValue.split('=');

      if (value === undefined || value === '') {
        // Check for max-age=0 (deletion)
        const maxAgePart = parts.find(part => part.trim().startsWith('max-age'));
        if (maxAgePart && maxAgePart.includes('0')) {
          delete cookieStore[key.trim()];
        }
      } else {
        cookieStore[key.trim()] = value.trim();
      }
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should return true for any credentials', () => {
      const result = service.login('testuser', 'testpass');
      expect(result).toBe(true);
    });

    it('should set session cookie with correct value', () => {
      service.login('user', 'pass');
      expect(cookieStore['planner_session']).toBe('auth_token_123456789');
    });

    it('should accept empty credentials', () => {
      const result = service.login('', '');
      expect(result).toBe(true);
      expect(cookieStore['planner_session']).toBe('auth_token_123456789');
    });
  });

  describe('logout', () => {
    it('should remove session cookie', () => {
      // First login to set cookie
      service.login('user', 'pass');
      expect(cookieStore['planner_session']).toBeDefined();

      // Then logout
      service.logout();
      expect(cookieStore['planner_session']).toBeUndefined();
    });

    it('should work even when no cookie exists', () => {
      expect(() => service.logout()).not.toThrow();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when session cookie exists with correct value', () => {
      service.login('user', 'pass');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no cookie exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when cookie has wrong value', () => {
      cookieStore['planner_session'] = 'wrong_token';
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false after logout', () => {
      service.login('user', 'pass');
      expect(service.isAuthenticated()).toBe(true);

      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('cookie management', () => {
    it('should handle multiple cookies', () => {
      cookieStore['other_cookie'] = 'other_value';
      service.login('user', 'pass');

      expect(cookieStore['planner_session']).toBe('auth_token_123456789');
      expect(cookieStore['other_cookie']).toBe('other_value');
    });

    it('should set cookie with path=/', () => {
      service.login('user', 'pass');

      expect(setCookieSpy).toHaveBeenCalled();
      const cookieString = (setCookieSpy.calls.mostRecent().args as any)[0] as string;
      expect(cookieString).toContain('path=/');
    });

    it('should set cookie with expiration date', () => {
      service.login('user', 'pass');

      expect(setCookieSpy).toHaveBeenCalled();
      const cookieString = (setCookieSpy.calls.mostRecent().args as any)[0] as string;
      expect(cookieString).toContain('expires=');
    });

    it('should calculate expiration 7 days in the future', () => {
      const beforeDate = new Date();

      service.login('user', 'pass');

      const cookieString = (setCookieSpy.calls.mostRecent().args as any)[0] as string;
      const expiresMatch = cookieString.match(/expires=([^;]+)/);
      expect(expiresMatch).toBeTruthy();

      if (expiresMatch) {
        const expirationDate = new Date(expiresMatch[1]);
        const daysDifference = Math.round((expirationDate.getTime() - beforeDate.getTime()) / (1000 * 60 * 60 * 24));
        expect(daysDifference).toBe(7);
      }
    });
  });
});
