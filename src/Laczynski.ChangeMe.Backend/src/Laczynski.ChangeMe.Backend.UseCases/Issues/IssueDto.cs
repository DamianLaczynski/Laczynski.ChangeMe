using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public class IssueDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string? Description { get; set; }
  public IssuePriority Priority { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
  public Guid CreatedBy { get; set; }
  public Guid? UpdatedBy { get; set; }
}

public class IssueDetailsDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string? Description { get; set; }
  public IssuePriority Priority { get; set; }
  public IReadOnlyCollection<IssueCommentDto> Comments { get; set; } = new List<IssueCommentDto>();
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
  public Guid CreatedBy { get; set; }
  public Guid? UpdatedBy { get; set; }
}

public class IssueCommentDto
{
  public Guid Id { get; set; }
  public string Content { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
  public Guid CreatedBy { get; set; }
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

  public static IssueDetailsDto ToDetailsDto(this Issue issue)
  {
    return new IssueDetailsDto
    {
      Id = issue.Id,
      Title = issue.Title,
      Description = issue.Description,
      Priority = issue.Priority,
      Comments = issue.Comments.Select(c => new IssueCommentDto
      {
        Id = c.Id,
        Content = c.Content,
        CreatedAt = c.CreatedAt,
        CreatedBy = c.CreatedBy,
      }).ToList(),
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

  public static Expression<Func<Issue, IssueDetailsDto>> ToIssueDetailsDtoExpression()
  {
    return issue => new IssueDetailsDto
    {
      Id = issue.Id,
      Title = issue.Title,
      Description = issue.Description,
      Priority = issue.Priority,
      Comments = issue.Comments.Select(c => new IssueCommentDto
      {
        Id = c.Id,
        Content = c.Content,
        CreatedAt = c.CreatedAt,
        CreatedBy = c.CreatedBy,
      }).ToList(),
      CreatedAt = issue.CreatedAt,
      UpdatedAt = issue.UpdatedAt,
      CreatedBy = issue.CreatedBy,
      UpdatedBy = issue.UpdatedBy,
    };
  }
}