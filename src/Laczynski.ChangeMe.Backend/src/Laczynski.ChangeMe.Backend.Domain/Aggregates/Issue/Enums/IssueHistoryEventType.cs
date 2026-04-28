namespace Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

public enum IssueHistoryEventType
{
  ISSUE_CREATED = 0,
  STATUS_CHANGED = 1,
  PRIORITY_CHANGED = 2,
  ASSIGNEE_CHANGED = 3,
  TITLE_CHANGED = 4,
  DESCRIPTION_CHANGED = 5,
}
