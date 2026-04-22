using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public class IssueDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
  public Guid CreatedBy { get; set; }
  public Guid? UpdatedBy { get; set; }
}

public static class IssueExtensions
{
  public static IssueDto ToDto(this Issue issue)
  {
    return new IssueDto
    {
      Id = issue.Id,
      Title = issue.Title,
      Description = issue.Description,
      CreatedAt = issue.CreatedAt,
      UpdatedAt = issue.UpdatedAt,
      CreatedBy = issue.CreatedBy,
      UpdatedBy = issue.UpdatedBy,
    };
  }

  public static Expression<Func<Issue, IssueDto>> ToIssueDtoExpression()
  {
    return issue => new IssueDto
    {
      Id = issue.Id,
      Title = issue.Title,
      Description = issue.Description,
      CreatedAt = issue.CreatedAt,
      UpdatedAt = issue.UpdatedAt,
      CreatedBy = issue.CreatedBy,
      UpdatedBy = issue.UpdatedBy,
    };
  }
}