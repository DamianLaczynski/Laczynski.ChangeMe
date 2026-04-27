using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Entities;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;

public class Issue : Entity, IAggregateRoot
{
  private Issue() { }

  public string Title { get; private set; } = string.Empty;
  public string? Description { get; private set; } = string.Empty;
  public IssuePriority Priority { get; private set; } = IssuePriority.MEDIUM;


  private readonly List<IssueAcceptanceCriterion> acceptanceCriteria = new();
  public IReadOnlyCollection<IssueAcceptanceCriterion> AcceptanceCriteria => acceptanceCriteria.AsReadOnly();


  public static Result<Issue> Create(string title, string? description = null, IssuePriority priority = IssuePriority.MEDIUM)
  {
    var validationErrors = new List<ValidationError>();
    if (string.IsNullOrWhiteSpace(title))
      validationErrors.Add(new ValidationError(nameof(Title), "cannot be empty"));
    if (title.Length < IssueConstraints.TITLE_MIN_LENGTH)
      validationErrors.Add(new ValidationError(nameof(Title), $"must be at least {IssueConstraints.TITLE_MIN_LENGTH} characters long"));
    if (title.Length > IssueConstraints.TITLE_MAX_LENGTH)
      validationErrors.Add(new ValidationError(nameof(Title), $"cannot be longer than {IssueConstraints.TITLE_MAX_LENGTH} characters"));

    if (description != null && description.Length > IssueConstraints.DESCRIPTION_MAX_LENGTH)
      validationErrors.Add(new ValidationError(nameof(Description), $"cannot be longer than {IssueConstraints.DESCRIPTION_MAX_LENGTH} characters"));

    if (!Enum.IsDefined(priority))
      validationErrors.Add(new ValidationError(nameof(Priority), "invalid priority"));

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
      validationErrors.Add(new ValidationError(nameof(Title), "cannot be empty"));
    if (title.Length < IssueConstraints.TITLE_MIN_LENGTH)
      validationErrors.Add(new ValidationError(nameof(Title), $"must be at least {IssueConstraints.TITLE_MIN_LENGTH} characters long"));
    if (title.Length > IssueConstraints.TITLE_MAX_LENGTH)
      validationErrors.Add(new ValidationError(nameof(Title), $"cannot be longer than {IssueConstraints.TITLE_MAX_LENGTH} characters"));

    if (description?.Length > IssueConstraints.DESCRIPTION_MAX_LENGTH)
      validationErrors.Add(new ValidationError(nameof(Description), $"cannot be longer than {IssueConstraints.DESCRIPTION_MAX_LENGTH} characters"));

    if (!Enum.IsDefined(priority))
      validationErrors.Add(new ValidationError(nameof(Priority), "invalid priority"));

    if (validationErrors.Count > 0)
      return Result.Invalid(validationErrors);

    Title = title.Trim();
    Description = description?.Trim();
    Priority = priority;
    return Result.Success(this);
  }

  public Result<IssueAcceptanceCriterion> AddAcceptanceCriterion(string content)
  {
    var acceptanceCriterion = IssueAcceptanceCriterion.Create(Id, content);
    if (!acceptanceCriterion.IsSuccess)
      return acceptanceCriterion.Map();

    acceptanceCriteria.Add(acceptanceCriterion.Value);
    return Result.Success(acceptanceCriterion.Value);
  }

  public Result<IssueAcceptanceCriterion> UpdateAcceptanceCriterion(Guid acceptanceCriterionId, string content)
  {
    var acceptanceCriterion = acceptanceCriteria.FirstOrDefault(c => c.Id == acceptanceCriterionId);
    if (acceptanceCriterion is null)
      return Result.NotFound();

    return acceptanceCriterion.UpdateContent(content);
  }

  public Result<IssueAcceptanceCriterion> RemoveAcceptanceCriterion(Guid acceptanceCriterionId)
  {
    var acceptanceCriterion = acceptanceCriteria.FirstOrDefault(c => c.Id == acceptanceCriterionId);
    if (acceptanceCriterion is null)
      return Result.NotFound();

    acceptanceCriteria.Remove(acceptanceCriterion);
    return Result.Success(acceptanceCriterion);
  }

}

public static class IssueConstraints
{
  public const int TITLE_MIN_LENGTH = 3;
  public const int TITLE_MAX_LENGTH = 255;
  public const int DESCRIPTION_MAX_LENGTH = 2000;
}
