import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.model';

const AUTH_STORAGE_KEY = 'auth_session';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  getSession(): AuthResponse | null {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as AuthResponse;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }

  setSession(session: AuthResponse): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  }

  clearSession(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}
