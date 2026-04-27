using System.Net;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;
using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Laczynski.ChangeMe.Backend.IntegrationTests.Fixtures;
using Laczynski.ChangeMe.Backend.IntegrationTests.Support;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Laczynski.ChangeMe.Backend.IntegrationTests;

[Collection(IntegrationTestCollection.Name)]
public sealed class DeleteIssueEndpointTests(BackendWebApplicationFactory factory)
{
  [Fact]
  public async Task DeleteIssue_WhenIssueExists_ShouldDeleteIssue()
  {
    var cancellationToken = TestContext.Current.CancellationToken;
    using var client = await TestAuthHelper.CreateAuthenticatedClientAsync(factory, cancellationToken);

    var issueId = await IssueTestHelper.SeedIssueAsync(
      factory,
      "Issue to delete",
      "Delete me",
      IssuePriority.LOW,
      null,
      cancellationToken);

    var response = await client.DeleteAsync($"/api/issues/{issueId}", cancellationToken);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    await using var scope = factory.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var issueExists = dbContext.Issues.Any(x => x.Id == issueId);

    Assert.False(issueExists);
  }
}
