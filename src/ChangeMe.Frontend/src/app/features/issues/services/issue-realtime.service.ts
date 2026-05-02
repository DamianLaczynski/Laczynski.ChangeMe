import { Injectable, inject } from '@angular/core';
import { NotificationsRealtimeConnectionService } from '@features/notifications/services/notifications-realtime-connection.service';

@Injectable({
  providedIn: 'root'
})
export class IssueRealtimeService {
  private readonly realtimeConnectionService = inject(
    NotificationsRealtimeConnectionService
  );

  readonly lastIssueMessage = this.realtimeConnectionService.lastIssueMessage;
  readonly issueMessageVersion = this.realtimeConnectionService.issueMessageVersion;
  readonly reconnectCount = this.realtimeConnectionService.reconnectCount;
  readonly connectionState = this.realtimeConnectionService.connectionState;
}
