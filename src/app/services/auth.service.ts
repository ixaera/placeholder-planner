import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly COOKIE_NAME = 'planner_session';
  private readonly COOKIE_VALUE = 'auth_token_123456789';
  private readonly COOKIE_DAYS = 7;

  constructor() { }

  /**
   * Fake login - accepts any username/password and sets session cookie
   */
  login(username: string, password: string): boolean {
    // Accept any credentials (fake authentication)
    this.setCookie(this.COOKIE_NAME, this.COOKIE_VALUE, this.COOKIE_DAYS);
    return true;
  }

  /**
   * Logout - removes session cookie
   */
  logout(): void {
    this.deleteCookie(this.COOKIE_NAME);
  }

  /**
   * Check if user is authenticated by verifying cookie exists
   */
  isAuthenticated(): boolean {
    const cookie = this.getCookie(this.COOKIE_NAME);
    return cookie === this.COOKIE_VALUE;
  }

  /**
   * Set a cookie with expiration
   */
  private setCookie(name: string, value: string, days: number): void {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const expires = `expires=${expirationDate.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  /**
   * Get a cookie value by name
   */
  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookiesArray = document.cookie.split(';');

    for (let cookie of cookiesArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length);
      }
    }
    return null;
  }

  /**
   * Delete a cookie by setting max-age to 0
   */
  private deleteCookie(name: string): void {
    document.cookie = `${name}=; path=/; max-age=0`;
  }
}
