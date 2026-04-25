using System.Net;
using System.Net.Http.Json;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;
using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Laczynski.ChangeMe.Backend.IntegrationTests.Fixtures;
using Laczynski.ChangeMe.Backend.IntegrationTests.Support;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Laczynski.ChangeMe.Backend.IntegrationTests;

[Collection(IntegrationTestCollection.Name)]
public sealed class UpdateIssueEndpointTests(BackendWebApplicationFactory factory)
{
  [Fact]
  public async Task PutIssue_WhenRequestIsValid_ShouldUpdateIssueAndSynchronizeComments()
  {
    var cancellationToken = TestContext.Current.CancellationToken;
    using var client = await TestAuthHelper.CreateAuthenticatedClientAsync(factory, cancellationToken);

    var issueId = await IssueTestHelper.SeedIssueAsync(
      factory,
      "Initial title",
      "Initial description",
      IssuePriority.MEDIUM,
      ["Old comment", "Remove me"],
      cancellationToken);

    await using var arrangeScope = factory.Services.CreateAsyncScope();
    var arrangeDb = arrangeScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var existingCommentId = await arrangeDb.Issues
      .AsNoTracking()
      .Where(x => x.Id == issueId)
      .SelectMany(x => x.Comments)
      .Select(x => x.Id)
      .FirstAsync(cancellationToken);

    var response = await client.PutAsJsonAsync($"/api/issues/{issueId}", new
    {
      Id = issueId,
      Title = "Updated title",
      Description = "Updated description",
      Priority = 4,
      Comments = new object[]
      {
        new
        {
          Id = existingCommentId,
          Content = "Updated comment"
        },
        new
        {
          Content = "New comment"
        }
      }
    }, cancellationToken);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    await using var assertScope = factory.Services.CreateAsyncScope();
    var assertDb = assertScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var issue = await assertDb.Issues
      .Include(x => x.Comments)
      .SingleAsync(x => x.Id == issueId, cancellationToken);

    Assert.Equal("Updated title", issue.Title);
    Assert.Equal("Updated description", issue.Description);
    Assert.Equal(IssuePriority.CRITICAL, issue.Priority);
    Assert.Equal(2, issue.Comments.Count);
    Assert.Contains(issue.Comments, x => x.Content == "Updated comment");
    Assert.Contains(issue.Comments, x => x.Content == "New comment");
    Assert.DoesNotContain(issue.Comments, x => x.Content == "Remove me");
  }
}
