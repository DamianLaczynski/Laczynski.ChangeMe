import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationDto } from '@features/notifications/models/notification.model';
import { NotificationsService } from '@features/notifications/services/notifications.service';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-notifications-center',
  imports: [
    CommonModule,
    Card,
    Button,
    Message,
    ProgressSpinner,
    Tag,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
  ],
  templateUrl: './notifications-center.component.html'
})
export class NotificationsCenterComponent {
  private readonly router = inject(Router);

  readonly notificationsService = inject(NotificationsService);
  readonly notifications = this.notificationsService.notifications;
  readonly unreadNotifications = this.notificationsService.unreadNotifications;
  readonly readNotifications = this.notificationsService.readNotifications;
  readonly unreadCount = this.notificationsService.unreadCount;
  readonly isLoading = this.notificationsService.isLoading;
  readonly hasLoaded = this.notificationsService.hasLoaded;
  readonly errorMessage = this.notificationsService.errorMessage;

  constructor() {
    this.notificationsService.loadNotifications();
  }

  openNotification(notification: NotificationDto): void {
    if (!notification.isRead) {
      this.notificationsService.markAsRead(notification.id);
    }

    void this.router.navigateByUrl(notification.link);
  }

  markAsRead(notification: NotificationDto): void {
    if (!notification.isRead) {
      this.notificationsService.markAsRead(notification.id);
    }
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
  }
}
