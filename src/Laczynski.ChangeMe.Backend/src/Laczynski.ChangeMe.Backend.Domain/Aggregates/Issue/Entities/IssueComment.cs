namespace Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Entities;

public class IssueComment : Entity
{

  public string Content { get; private set; } = string.Empty;
  public Guid IssueId { get; private set; }

  private IssueComment() { }


  public static Result<IssueComment> Create(Guid issueId, string content)
  {
    var validationErrors = new List<ValidationError>();
    if (string.IsNullOrWhiteSpace(content))
      validationErrors.Add(new ValidationError("content", "Content cannot be empty"));
    if (content.Length > IssueCommentConstraints.CONTENT_MAX_LENGTH)
      validationErrors.Add(new ValidationError("content", "Content cannot be longer than 2000 characters"));
    if (validationErrors.Count > 0)
      return Result.Invalid(validationErrors);

    var issueComment = new IssueComment()
    {
      IssueId = issueId,
      Content = content.Trim(),
    };
    return Result.Success(issueComment);
  }

}


public static class IssueCommentConstraints
{
  public const int CONTENT_MAX_LENGTH = 2000;
}
