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
      validationErrors.Add(new ValidationError("content", "cannot be empty"));
    if (content.Length > IssueCommentConstraints.CONTENT_MAX_LENGTH)
      validationErrors.Add(new ValidationError("content", $"cannot be longer than {IssueCommentConstraints.CONTENT_MAX_LENGTH} characters"));
    if (validationErrors.Count > 0)
      return Result.Invalid(validationErrors);

    var issueComment = new IssueComment()
    {
      IssueId = issueId,
      Content = content.Trim(),
    };
    return Result.Success(issueComment);
  }

  public Result<IssueComment> UpdateContent(string content)
  {
    var validationErrors = new List<ValidationError>();
    if (string.IsNullOrWhiteSpace(content))
      validationErrors.Add(new ValidationError("content", "cannot be empty"));
    if (content.Length > IssueCommentConstraints.CONTENT_MAX_LENGTH)
      validationErrors.Add(new ValidationError("content", $"cannot be longer than {IssueCommentConstraints.CONTENT_MAX_LENGTH} characters"));
    if (validationErrors.Count > 0)
      return Result.Invalid(validationErrors);

    Content = content.Trim();
    return Result.Success(this);
  }

}


public static class IssueCommentConstraints
{
  public const int CONTENT_MAX_LENGTH = 2000;
}
