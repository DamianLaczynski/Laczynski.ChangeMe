using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.IntegrationTests.Support.Fakes;
using Laczynski.ChangeMe.Backend.Web;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace Laczynski.ChangeMe.Backend.IntegrationTests.Fixtures;

public sealed class BackendWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
  private readonly Dictionary<string, string?> environmentOverrides = new();
  private readonly PostgreSqlContainer postgresContainer = new PostgreSqlBuilder("postgres:15.1")
    .Build();

  public async ValueTask InitializeAsync()
  {
    var cancellationToken = TestContext.Current.CancellationToken;

    await postgresContainer.StartAsync(cancellationToken);
    ApplyEnvironmentOverrides();

    using var client = CreateClient(new WebApplicationFactoryClientOptions
    {
      BaseAddress = new Uri("https://localhost")
    });

    await using var scope = Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.MigrateAsync(cancellationToken);
  }

  public new async ValueTask DisposeAsync()
  {
    var cancellationToken = TestContext.Current.CancellationToken;

    ClearEnvironmentOverrides();
    await postgresContainer.DisposeAsync().AsTask().WaitAsync(cancellationToken);
    await base.DisposeAsync();
  }

  protected override void ConfigureWebHost(IWebHostBuilder builder)
  {
    builder.UseEnvironment("Testing");
    builder.ConfigureServices(services =>
    {
      var emailServiceDescriptor = services.FirstOrDefault(x => x.ServiceType == typeof(IEmailService));
      if (emailServiceDescriptor is not null)
      {
        services.Remove(emailServiceDescriptor);
      }

      services.AddSingleton<IEmailService, FakeEmailService>();
    });
  }

  private void ApplyEnvironmentOverrides()
  {
    environmentOverrides["ConnectionStrings__DefaultConnection"] = postgresContainer.GetConnectionString();
    environmentOverrides["Database__ApplyMigrationsOnStartup"] = "false";
    environmentOverrides["DatabaseOptions__ApplyMigrationsOnStartup"] = "false";
    environmentOverrides["Jwt__Issuer"] = "Laczynski.ChangeMe.Tests";
    environmentOverrides["Jwt__Audience"] = "Laczynski.ChangeMe.Tests";
    environmentOverrides["Jwt__SigningKey"] = "Integration-Tests-Signing-Key-Needs-32-Chars";
    environmentOverrides["Jwt__ExpirationMinutes"] = "60";
    environmentOverrides["Email__Host"] = "localhost";
    environmentOverrides["Email__Port"] = "1025";
    environmentOverrides["Email__EnableSsl"] = "false";
    environmentOverrides["Email__FromEmail"] = "tests@example.local";
    environmentOverrides["Email__FromName"] = "Integration Tests";

    foreach (var pair in environmentOverrides)
    {
      Environment.SetEnvironmentVariable(pair.Key, pair.Value);
    }
  }

  private void ClearEnvironmentOverrides()
  {
    foreach (var pair in environmentOverrides)
    {
      Environment.SetEnvironmentVariable(pair.Key, null);
    }
  }
}
