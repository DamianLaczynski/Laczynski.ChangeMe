using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Entities;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;

public class Issue : Entity, IAggregateRoot
{

  private Issue()
  {
  }

  public string Title { get; private set; } = string.Empty;
  public string? Description { get; private set; } = string.Empty;
  public IssuePriority Priority { get; private set; } = IssuePriority.MEDIUM;


  private readonly List<IssueComment> comments = new();
  public IReadOnlyCollection<IssueComment> Comments => comments.AsReadOnly();


  public static Result<Issue> Create(string title, string? description = null, IssuePriority priority = IssuePriority.MEDIUM)
  {
    var validationErrors = new List<ValidationError>();
    if (string.IsNullOrWhiteSpace(title))
      validationErrors.Add(new ValidationError("title", "Title cannot be empty"));
    if (title.Length < IssueConstraints.TITLE_MIN_LENGTH)
      validationErrors.Add(new ValidationError("title", "Title must be at least 3 characters long"));
    if (title.Length > IssueConstraints.TITLE_MAX_LENGTH)
      validationErrors.Add(new ValidationError("title", "Title cannot be longer than 255 characters"));

    if (description != null && description.Length > IssueConstraints.DESCRIPTION_MAX_LENGTH)
      validationErrors.Add(new ValidationError("description", "Description cannot be longer than 2000 characters"));

    if (!Enum.IsDefined(priority))
      validationErrors.Add(new ValidationError("priority", "Invalid priority"));

    if (validationErrors.Count > 0)
      return Result.Invalid(validationErrors);

    var issue = new Issue()
    {
      Title = title.Trim(),
      Description = description?.Trim() ?? string.Empty,
      Priority = priority,
    };
    return Result.Success(issue);
  }

  public Result<Issue> UpdateDetails(string title, string? description, IssuePriority priority)
  {
    var validationErrors = new List<ValidationError>();

    if (string.IsNullOrWhiteSpace(title))
      validationErrors.Add(new ValidationError("title", "Title cannot be empty"));
    if (title.Length < IssueConstraints.TITLE_MIN_LENGTH)
      validationErrors.Add(new ValidationError("title", "Title must be at least 3 characters long"));
    if (title.Length > IssueConstraints.TITLE_MAX_LENGTH)
      validationErrors.Add(new ValidationError("title", "Title cannot be longer than 255 characters"));

    if (description?.Length > IssueConstraints.DESCRIPTION_MAX_LENGTH)
      validationErrors.Add(new ValidationError("description", "Description cannot be longer than 2000 characters"));

    if (!Enum.IsDefined(priority))
      validationErrors.Add(new ValidationError("priority", "Invalid priority"));

    if (validationErrors.Count > 0)
      return Result.Invalid(validationErrors);

    Title = title.Trim();
    Description = description?.Trim();
    Priority = priority;
    return Result.Success(this);
  }

}

public static class IssueConstraints
{
  public const int TITLE_MIN_LENGTH = 3;
  public const int TITLE_MAX_LENGTH = 255;
  public const int DESCRIPTION_MAX_LENGTH = 2000;
  public const int PRIORITY_MAX_LENGTH = 100;
}
