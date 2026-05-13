import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { NotificationsService } from '@features/notifications/services/notifications.service';
import { BadgeComponent, ButtonComponent } from '@laczynski/ui';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BadgeComponent, ButtonComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationsService);

  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly unreadNotificationsCount = this.notificationsService.unreadCount;

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/issues');
  }
}
