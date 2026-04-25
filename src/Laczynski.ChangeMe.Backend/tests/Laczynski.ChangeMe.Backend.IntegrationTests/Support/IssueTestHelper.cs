using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;
using Laczynski.ChangeMe.Backend.Domain.Common;
using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Laczynski.ChangeMe.Backend.IntegrationTests.Fixtures;
using Microsoft.Extensions.DependencyInjection;

namespace Laczynski.ChangeMe.Backend.IntegrationTests.Support;

internal static class IssueTestHelper
{
  public static async Task<Guid> SeedIssueAsync(
    BackendWebApplicationFactory factory,
    string title,
    string? description,
    IssuePriority priority,
    string[]? comments,
    CancellationToken cancellationToken)
  {
    await using var scope = factory.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var actorId = Guid.CreateVersion7();

    var issueResult = Issue.Create(title, description, priority);
    var issue = issueResult.Value;
    ApplyAudit(issue, actorId);

    foreach (var comment in comments ?? [])
    {
      var commentResult = issue.AddComment(comment);
      if (commentResult.IsSuccess)
      {
        ApplyAudit(commentResult.Value, actorId);
      }
    }

    dbContext.Issues.Add(issue);
    await dbContext.SaveChangesAsync(cancellationToken);

    return issue.Id;
  }

  private static void ApplyAudit(Entity entity, Guid actorId)
  {
    entity.CreatedBy = actorId;
    entity.UpdatedBy = actorId;
  }
}
