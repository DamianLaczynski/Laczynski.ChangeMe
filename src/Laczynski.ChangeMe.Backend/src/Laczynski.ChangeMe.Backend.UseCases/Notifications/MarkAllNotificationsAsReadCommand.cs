using Laczynski.ChangeMe.Backend.UseCases.Notifications.Dtos;
using Laczynski.ChangeMe.Backend.UseCases.Notifications.Services;

namespace Laczynski.ChangeMe.Backend.UseCases.Notifications;

public record MarkAllNotificationsAsReadCommand(bool doNothing) : ICommand<NotificationListDto>;

public class MarkAllNotificationsAsReadHandler(
  ApplicationDbContext context,
  IUserAccessor userAccessor,
  NotificationRetentionPolicy retentionPolicy) : ICommandHandler<MarkAllNotificationsAsReadCommand, NotificationListDto>
{
  public async Task<Result<NotificationListDto>> Handle(MarkAllNotificationsAsReadCommand command, CancellationToken cancellationToken)
  {
    if (userAccessor.UserId is not Guid currentUserId)
      return Result.Unauthorized();

    var notifications = await retentionPolicy.ApplyActiveFilter(context.Notifications)
      .Where(n => n.RecipientUserId == currentUserId && !n.IsRead)
      .ToListAsync(cancellationToken);

    foreach (var notification in notifications)
      notification.MarkAsRead();

    await context.SaveChangesAsync(cancellationToken);

    var items = await retentionPolicy.ApplyActiveFilter(
        context.Notifications
          .AsNoTracking()
          .Where(n => n.RecipientUserId == currentUserId))
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
      UnreadCount = items.Count(n => !n.IsRead),
    });
  }
}
