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
  public async Task PutIssue_WhenRequestIsValid_ShouldUpdateIssueAndSynchronizeAcceptanceCriteria()
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
    var existingAcceptanceCriterionId = await arrangeDb.Issues
      .AsNoTracking()
      .Where(x => x.Id == issueId)
      .SelectMany(x => x.AcceptanceCriteria)
      .Select(x => x.Id)
      .FirstAsync(cancellationToken);

    var response = await client.PutAsJsonAsync($"/api/issues/{issueId}", new
    {
      Id = issueId,
      Title = "Updated title",
      Description = "Updated description",
      Priority = 4,
      AcceptanceCriteria = new object[]
      {
        new
        {
          Id = existingAcceptanceCriterionId,
          Content = "Updated acceptance criterion"
        },
        new
        {
          Content = "New acceptance criterion"
        }
      }
    }, cancellationToken);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    await using var assertScope = factory.Services.CreateAsyncScope();
    var assertDb = assertScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var issue = await assertDb.Issues
      .Include(x => x.AcceptanceCriteria)
      .SingleAsync(x => x.Id == issueId, cancellationToken);

    Assert.Equal("Updated title", issue.Title);
    Assert.Equal("Updated description", issue.Description);
    Assert.Equal(IssuePriority.CRITICAL, issue.Priority);
    Assert.Equal(2, issue.AcceptanceCriteria.Count);
    Assert.Contains(issue.AcceptanceCriteria, x => x.Content == "Updated acceptance criterion");
    Assert.Contains(issue.AcceptanceCriteria, x => x.Content == "New acceptance criterion");
    Assert.DoesNotContain(issue.AcceptanceCriteria, x => x.Content == "Remove me");
  }
}
