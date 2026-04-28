import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from '@shared/api/services/api.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly authStorageService = inject(AuthStorageService);

  private readonly session = signal<AuthResponse | null>(
    this.authStorageService.getSession()
  );

  readonly currentSession = this.session.asReadonly();
  readonly isAuthenticated = computed(
    () => this.session() !== null && !this.isSessionExpired(this.session())
  );
  readonly token = computed(() =>
    this.isAuthenticated() ? (this.session()?.token ?? null) : null
  );
  readonly currentUser = computed(() => {
    const session = this.session();
    if (!session) {
      return null;
    }

    return {
      id: session.userId,
      firstName: session.firstName,
      lastName: session.lastName,
      fullName: `${session.firstName} ${session.lastName}`,
      email: session.email
    };
  });

  constructor() {
    if (this.isSessionExpired(this.session())) {
      this.logout();
    }
  }

  login(request: LoginRequest) {
    return this.apiService
      .post<AuthResponse>('auth/login', request)
      .pipe(tap((session) => this.setSession(session)));
  }

  register(request: RegisterRequest) {
    return this.apiService
      .post<AuthResponse>('auth/register', request)
      .pipe(tap((session) => this.setSession(session)));
  }

  logout(): void {
    this.session.set(null);
    this.authStorageService.clearSession();
  }

  private setSession(session: AuthResponse): void {
    this.session.set(session);
    this.authStorageService.setSession(session);
  }

  private isSessionExpired(session: AuthResponse | null): boolean {
    if (!session) {
      return true;
    }

    return new Date(session.expiresAtUtc).getTime() <= Date.now();
  }
}
