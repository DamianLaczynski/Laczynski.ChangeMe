using System.Security.Claims;
using ChangeMe.Backend.Domain.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace ChangeMe.Backend.Web.Notifications;

public class NotificationHub : Hub
{
  public const string IssuesGroupName = "issues";

  public override async Task OnConnectedAsync()
  {
    await Groups.AddToGroupAsync(Context.ConnectionId, IssuesGroupName);

    var userIdValue = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    if (Guid.TryParse(userIdValue, out var userId))
      await Groups.AddToGroupAsync(Context.ConnectionId, UserGroup(userId));

    await base.OnConnectedAsync();
  }

  public override async Task OnDisconnectedAsync(Exception? exception)
  {
    var userIdValue = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    if (Guid.TryParse(userIdValue, out var userId))
      await Groups.RemoveFromGroupAsync(Context.ConnectionId, UserGroup(userId));

    await base.OnDisconnectedAsync(exception);
  }

  public static string UserGroup(Guid userId) => $"notifications:{userId}";
}

public class SignalRNotificationRealtimePublisher(IHubContext<NotificationHub> hubContext) : INotificationRealtimePublisher
{
  public Task PublishAsync(Guid userId, NotificationRealtimeMessage message, CancellationToken cancellationToken)
  {
    return hubContext.Clients.Group(NotificationHub.UserGroup(userId))
      .SendAsync("notificationReceived", message, cancellationToken);
  }
}

public class SignalRIssueRealtimePublisher(IHubContext<NotificationHub> hubContext) : IIssueRealtimePublisher
{
  public Task PublishAsync(IssueRealtimeMessage message, CancellationToken cancellationToken)
  {
    return hubContext.Clients.Group(NotificationHub.IssuesGroupName)
      .SendAsync("issueChanged", message, cancellationToken);
  }
}
