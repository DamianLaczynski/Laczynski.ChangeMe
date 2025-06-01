import { computed, Injectable, signal } from '@angular/core';
import { CurrentUser, MOCK_USER } from '../models/current-user.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserContextService {
  private readonly currentUser = signal<CurrentUser | null>(null);
  $currentUser = this.currentUser.asReadonly();

  constructor() {
    if (environment.mockUser) {
      this.currentUser.set(MOCK_USER);
    }
  }

  /**
   * Checks if user is currently authenticated (has a valid token)
   */
  public isAuthenticated = computed(() => {
    return this.currentUser() !== null;
  });

  /**
   * Returns the current user
   */
  public getCurrentUser = computed(() => {
    return this.currentUser();
  });
}
