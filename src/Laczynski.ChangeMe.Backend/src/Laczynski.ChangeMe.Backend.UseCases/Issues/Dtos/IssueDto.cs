using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues.Dtos;

public class IssueDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public IssueStatus Status { get; set; }
  public IssuePriority Priority { get; set; }
  public Guid CreatedBy { get; set; }
  public string? CreatedByName { get; set; }
  public Guid? AssignedToUserId { get; set; }
  public string? AssignedToUserName { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
  public DateTime LastActivityAt { get; set; }
  public bool IsWatchedByCurrentUser { get; set; }
  public int WatchersCount { get; set; }
}

public class IssueAssignableUserDto
{
  public Guid Id { get; set; }
  public string FullName { get; set; } = string.Empty;
}

public class IssueDetailsDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public IssueStatus Status { get; set; }
  public IssuePriority Priority { get; set; }
  public Guid CreatedBy { get; set; }
  public string? CreatedByName { get; set; }
  public Guid? AssignedToUserId { get; set; }
  public string? AssignedToUserName { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
  public DateTime LastActivityAt { get; set; }
  public bool IsWatchedByCurrentUser { get; set; }
  public int WatchersCount { get; set; }
  public IReadOnlyCollection<AcceptanceCriterionDto> AcceptanceCriteria { get; set; } = [];
  public IReadOnlyCollection<IssueCommentDto> Comments { get; set; } = [];
  public IReadOnlyCollection<IssueHistoryEntryDto> HistoryEntries { get; set; } = [];
}

public class AcceptanceCriterionDto
{
  public Guid Id { get; set; }
  public string Content { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
  public Guid CreatedBy { get; set; }
}

public class IssueCommentDto
{
  public Guid Id { get; set; }
  public string Content { get; set; } = string.Empty;
  public Guid AuthorUserId { get; set; }
  public string? AuthorName { get; set; }
  public DateTime CreatedAt { get; set; }
}

public class IssueHistoryEntryDto
{
  public Guid Id { get; set; }
  public IssueHistoryEventType EventType { get; set; }
  public Guid ActorUserId { get; set; }
  public string? ActorName { get; set; }
  public string Summary { get; set; } = string.Empty;
  public string? PreviousValue { get; set; }
  public string? CurrentValue { get; set; }
  public DateTime CreatedAt { get; set; }
}

public static class IssueExtensions
{
  private const string UnassignedHistoryValue = "Unassigned";

  public static IssueDetailsDto ToDetailsDto(
    this Issue issue,
    IReadOnlyDictionary<Guid, string> userLookup,
    Guid? currentUserId)
  {
    return new IssueDetailsDto
    {
      Id = issue.Id,
      Title = issue.Title,
      Description = issue.Description,
      Status = issue.Status,
      Priority = issue.Priority,
      CreatedBy = issue.CreatedBy,
      CreatedByName = userLookup.GetValueOrDefault(issue.CreatedBy),
      AssignedToUserId = issue.AssignedToUserId,
      AssignedToUserName = issue.AssignedToUserId.HasValue ? userLookup.GetValueOrDefault(issue.AssignedToUserId.Value) : null,
      CreatedAt = issue.CreatedAt,
      UpdatedAt = issue.UpdatedAt,
      LastActivityAt = issue.LastActivityAt,
      IsWatchedByCurrentUser = currentUserId.HasValue && issue.Watchers.Any(w => w.UserId == currentUserId.Value),
      WatchersCount = issue.Watchers.Count,
      AcceptanceCriteria = issue.AcceptanceCriteria
        .OrderBy(c => c.CreatedAt)
        .Select(c => new AcceptanceCriterionDto
        {
          Id = c.Id,
          Content = c.Content,
          CreatedAt = c.CreatedAt,
          CreatedBy = c.CreatedBy,
        })
        .ToList(),
      Comments = issue.Comments
        .OrderBy(c => c.CreatedAt)
        .Select(c => new IssueCommentDto
        {
          Id = c.Id,
          Content = c.Content,
          AuthorUserId = c.CreatedBy,
          AuthorName = userLookup.GetValueOrDefault(c.CreatedBy),
          CreatedAt = c.CreatedAt,
        })
        .ToList(),
      HistoryEntries = issue.HistoryEntries
        .OrderByDescending(h => h.CreatedAt)
        .Select(h => new IssueHistoryEntryDto
        {
          Id = h.Id,
          EventType = h.EventType,
          ActorUserId = h.ActorUserId,
          ActorName = userLookup.GetValueOrDefault(h.ActorUserId),
          Summary = h.Summary,
          PreviousValue = FormatHistoryValue(h.EventType, h.PreviousValue, userLookup),
          CurrentValue = FormatHistoryValue(h.EventType, h.CurrentValue, userLookup),
          CreatedAt = h.CreatedAt,
        })
        .ToList(),
    };
  }

  private static string? FormatHistoryValue(
    IssueHistoryEventType eventType,
    string? value,
    IReadOnlyDictionary<Guid, string> userLookup)
  {
    if (eventType != IssueHistoryEventType.ASSIGNEE_CHANGED)
      return value;

    if (string.IsNullOrWhiteSpace(value))
      return UnassignedHistoryValue;

    return Guid.TryParse(value, out var userId)
      ? userLookup.GetValueOrDefault(userId, value)
      : value;
  }
}
