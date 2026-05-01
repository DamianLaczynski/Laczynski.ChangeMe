using Laczynski.ChangeMe.Backend.UseCases.Notifications.Dtos;
using Laczynski.ChangeMe.Backend.UseCases.Notifications.Services;

namespace Laczynski.ChangeMe.Backend.UseCases.Notifications;

public record GetNotificationsQuery(bool? IsRead = null) : IQuery<NotificationListDto>;

public class GetNotificationsHandler(
  ApplicationDbContext context,
  IUserAccessor userAccessor,
  NotificationRetentionPolicy retentionPolicy) : IQueryHandler<GetNotificationsQuery, NotificationListDto>
{
  public async Task<Result<NotificationListDto>> Handle(GetNotificationsQuery query, CancellationToken cancellationToken)
  {
    if (userAccessor.UserId is not Guid currentUserId)
      return Result<NotificationListDto>.Unauthorized();

    var notificationsQuery = retentionPolicy.ApplyActiveFilter(
        context.Notifications
          .AsNoTracking()
          .Where(n => n.RecipientUserId == currentUserId));

    if (query.IsRead.HasValue)
      notificationsQuery = notificationsQuery.Where(n => n.IsRead == query.IsRead.Value);

    var items = await notificationsQuery
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

    var unreadNotificationsQuery = context.Notifications
      .AsNoTracking()
      .Where(n => n.RecipientUserId == currentUserId);

    var unreadCount = await retentionPolicy.ApplyActiveFilter(unreadNotificationsQuery)
      .CountAsync(n => !n.IsRead, cancellationToken);

    return Result.Success(new NotificationListDto
    {
      Items = items,
      UnreadCount = unreadCount,
    });
  }
}
