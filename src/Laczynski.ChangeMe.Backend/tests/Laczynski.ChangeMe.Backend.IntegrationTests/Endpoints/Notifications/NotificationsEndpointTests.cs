using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;
using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Laczynski.ChangeMe.Backend.IntegrationTests.Fixtures;
using Laczynski.ChangeMe.Backend.IntegrationTests.Support.Fakes;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Laczynski.ChangeMe.Backend.IntegrationTests;

[Collection(IntegrationTestCollection.Name)]
public sealed class NotificationsEndpointTests(BackendWebApplicationFactory factory)
{
  [Fact]
  public async Task GetNotifications_AfterWatchedIssueIsUpdated_ShouldReturnUnreadNotificationAndAllowMarkAsRead()
  {
    var cancellationToken = TestContext.Current.CancellationToken;
    var owner = await CreateAuthenticatedUserAsync(cancellationToken);
    var watcher = await CreateAuthenticatedUserAsync(cancellationToken);
    using var ownerClient = owner.Client;
    using var watcherClient = watcher.Client;

    await using (var clearScope = factory.Services.CreateAsyncScope())
    {
      var emailService = (FakeEmailService)clearScope.ServiceProvider.GetRequiredService<IEmailService>();
      emailService.Clear();
    }

    var createResponse = await ownerClient.PostAsJsonAsync("/api/issues", new
    {
      Title = "Issue that will notify watchers",
      Description = "Issue description",
      Status = IssueStatus.NEW,
      Priority = IssuePriority.MEDIUM,
      AssignedToUserId = watcher.UserId,
      WatchAfterCreate = false
    }, cancellationToken);
    createResponse.EnsureSuccessStatusCode();

    var createBody = await createResponse.Content.ReadAsStringAsync(cancellationToken);
    var issueId = ExtractId(createBody);

    var watchResponse = await watcherClient.PostAsJsonAsync($"/api/issues/{issueId}/watch", new
    {
      IssueId = issueId
    }, cancellationToken);
    watchResponse.EnsureSuccessStatusCode();

    var updateResponse = await ownerClient.PutAsJsonAsync($"/api/issues/{issueId}", new
    {
      Id = issueId,
      Title = "Issue that will notify watchers",
      Description = "Issue description",
      Status = IssueStatus.IN_PROGRESS,
      Priority = IssuePriority.CRITICAL,
      AssignedToUserId = watcher.UserId,
      AcceptanceCriteria = Array.Empty<object>()
    }, cancellationToken);

    Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

    var notificationsResponse = await watcherClient.GetAsync("/api/notifications", cancellationToken);
    var notificationsBody = await notificationsResponse.Content.ReadAsStringAsync(cancellationToken);

    Assert.Equal(HttpStatusCode.OK, notificationsResponse.StatusCode);
    Assert.Contains("Issue that will notify watchers", notificationsBody, StringComparison.OrdinalIgnoreCase);
    Assert.Contains("PRIORITY_CHANGED", notificationsBody, StringComparison.OrdinalIgnoreCase);

    var notificationId = ExtractFirstNotificationId(notificationsBody);

    var markAsReadResponse = await watcherClient.PutAsJsonAsync($"/api/notifications/{notificationId}/read", new
    {
      NotificationId = notificationId
    }, cancellationToken);

    Assert.Equal(HttpStatusCode.OK, markAsReadResponse.StatusCode);

    await using var scope = factory.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var notification = await dbContext.Notifications.FindAsync([notificationId], cancellationToken);

    Assert.NotNull(notification);
    Assert.Equal(watcher.UserId, notification.RecipientUserId);
    Assert.True(notification.IsRead);
    Assert.NotNull(notification.EmailSentAt);
  }

  private async Task<AuthenticatedNotificationUser> CreateAuthenticatedUserAsync(CancellationToken cancellationToken)
  {
    var email = $"user-{Guid.NewGuid():N}@example.com";
    const string password = "StrongPass123!";

    using var anonymousClient = factory.CreateClient(new WebApplicationFactoryClientOptions
    {
      BaseAddress = new Uri("https://localhost")
    });

    await anonymousClient.PostAsJsonAsync("/api/auth/register", new
    {
      FirstName = "Notification",
      LastName = "User",
      Email = email,
      Password = password
    }, cancellationToken);

    var loginResponse = await anonymousClient.PostAsJsonAsync("/api/auth/login", new
    {
      Email = email,
      Password = password
    }, cancellationToken);

    loginResponse.EnsureSuccessStatusCode();

    var responseBody = await loginResponse.Content.ReadAsStringAsync(cancellationToken);
    var token = ExtractToken(responseBody);

    var authenticatedClient = factory.CreateClient(new WebApplicationFactoryClientOptions
    {
      BaseAddress = new Uri("https://localhost")
    });

    authenticatedClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

    await using var scope = factory.Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var userId = await dbContext.Users
      .AsNoTracking()
      .Where(u => u.Email == email)
      .Select(u => u.Id)
      .SingleAsync(cancellationToken);

    return new AuthenticatedNotificationUser(authenticatedClient, userId);
  }

  private static string ExtractToken(string responseBody)
  {
    using var document = JsonDocument.Parse(responseBody);

    if (document.RootElement.TryGetProperty("value", out var valueElement)
        && valueElement.TryGetProperty("token", out var tokenElement))
    {
      return tokenElement.GetString() ?? throw new InvalidOperationException("Token value is null.");
    }

    throw new InvalidOperationException("Token was not found in login response.");
  }

  private static Guid ExtractId(string responseBody)
  {
    using var document = JsonDocument.Parse(responseBody);
    return document.RootElement.GetProperty("value").GetProperty("id").GetGuid();
  }

  private static Guid ExtractFirstNotificationId(string responseBody)
  {
    using var document = JsonDocument.Parse(responseBody);
    return document.RootElement.GetProperty("value").GetProperty("items")[0].GetProperty("id").GetGuid();
  }

  private sealed record AuthenticatedNotificationUser(HttpClient Client, Guid UserId);
}
