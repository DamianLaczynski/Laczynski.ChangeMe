using System.Net;
using System.Net.Http.Json;
using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Laczynski.ChangeMe.Backend.IntegrationTests.Fixtures;
using Laczynski.ChangeMe.Backend.IntegrationTests.Support;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace Laczynski.ChangeMe.Backend.IntegrationTests;

[Collection(IntegrationTestCollection.Name)]
public sealed class CreateIssueEndpointTests(BackendWebApplicationFactory factory)
{
  [Fact]
  public async Task PostIssues_WhenUserIsAuthenticated_ShouldCreateIssue()
  {
    var cancellationToken = TestContext.Current.CancellationToken;
    using var client = await TestAuthHelper.CreateAuthenticatedClientAsync(factory, cancellationToken);

    var request = new
    {
      Title = "Issue created from integration test",
      Description = "Created through HTTP",
      Priority = 2
    };

    var response = await client.PostAsJsonAsync("/api/issues", request, cancellationToken);

    Assert.Equal(HttpStatusCode.Created, response.StatusCode);

    await using var scope = factory.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var issue = dbContext.Issues.SingleOrDefault(x => x.Title == request.Title);

    Assert.NotNull(issue);
    Assert.Equal(request.Description, issue.Description);
  }

  [Fact]
  public async Task PostIssues_WhenUserIsAnonymous_ShouldReturnUnauthorized()
  {
    var cancellationToken = TestContext.Current.CancellationToken;

    using var client = factory.CreateClient(new WebApplicationFactoryClientOptions
    {
      BaseAddress = new Uri("https://localhost")
    });

    var response = await client.PostAsJsonAsync("/api/issues", new
    {
      Title = "Unauthorized issue",
      Description = "Should fail",
      Priority = 2
    }, cancellationToken);

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }
}
