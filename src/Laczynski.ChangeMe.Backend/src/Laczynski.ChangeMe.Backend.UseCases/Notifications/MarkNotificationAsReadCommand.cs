namespace Laczynski.ChangeMe.Backend.UseCases.Notifications;

public record MarkNotificationAsReadCommand(Guid NotificationId) : ICommand<NotificationDto>;
public record MarkAllNotificationsAsReadCommand(bool doNothing) : ICommand<NotificationListDto>;

public class MarkNotificationAsReadHandler(
  ApplicationDbContext context,
  IUserAccessor userAccessor) : ICommandHandler<MarkNotificationAsReadCommand, NotificationDto>
{
  public async Task<Result<NotificationDto>> Handle(MarkNotificationAsReadCommand command, CancellationToken cancellationToken)
  {
    if (userAccessor.UserId is not Guid currentUserId)
      return Result.Unauthorized();

    var notification = await context.Notifications
      .FirstOrDefaultAsync(n => n.Id == command.NotificationId && n.RecipientUserId == currentUserId, cancellationToken);

    if (notification is null)
      return Result.NotFound();

    notification.MarkAsRead();
    await context.SaveChangesAsync(cancellationToken);

    return Result.Success(new NotificationDto
    {
      Id = notification.Id,
      IssueId = notification.IssueId,
      EventType = notification.EventType,
      IssueTitle = notification.IssueTitle,
      Message = notification.Message,
      Link = notification.Link,
      OccurredAt = notification.OccurredAt,
      IsRead = notification.IsRead,
      ReadAt = notification.ReadAt,
    });
  }
}

public class MarkAllNotificationsAsReadHandler(
  ApplicationDbContext context,
  IUserAccessor userAccessor) : ICommandHandler<MarkAllNotificationsAsReadCommand, NotificationListDto>
{
  public async Task<Result<NotificationListDto>> Handle(MarkAllNotificationsAsReadCommand command, CancellationToken cancellationToken)
  {
    if (userAccessor.UserId is not Guid currentUserId)
      return Result.Unauthorized();

    var notifications = await context.Notifications
      .Where(n => n.RecipientUserId == currentUserId && !n.IsRead)
      .ToListAsync(cancellationToken);

    foreach (var notification in notifications)
      notification.MarkAsRead();

    await context.SaveChangesAsync(cancellationToken);

    var items = await context.Notifications
      .AsNoTracking()
      .Where(n => n.RecipientUserId == currentUserId)
      .OrderByDescending(n => n.OccurredAt)
      .Select(n => new NotificationDto
      {
        Id = n.Id,
        IssueId = n.IssueId,
        EventType = n.EventType,
        IssueTitle = n.IssueTitle,
        Message = n.Message,
        Link = n.Link,
        OccurredAt = n.OccurredAt,
        IsRead = n.IsRead,
        ReadAt = n.ReadAt,
      })
      .ToListAsync(cancellationToken);

    return Result.Success(new NotificationListDto
    {
      Items = items,
      UnreadCount = 0,
    });
  }
}
