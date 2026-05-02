using ChangeMe.Backend.Domain.Aggregates.Notifications.Enums;

namespace ChangeMe.Backend.UseCases.Notifications.Dtos;

public class NotificationDto
{
  public Guid Id { get; set; }
  public Guid IssueId { get; set; }
  public NotificationEventType EventType { get; set; }
  public string IssueTitle { get; set; } = string.Empty;
  public string Message { get; set; } = string.Empty;
  public string Link { get; set; } = string.Empty;
  public DateTime OccurredAt { get; set; }
  public bool IsRead { get; set; }
  public DateTime? ReadAt { get; set; }
}

public class NotificationListDto
{
  public int UnreadCount { get; set; }
  public IReadOnlyCollection<NotificationDto> Items { get; set; } = [];
}
