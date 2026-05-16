using ChangeMe.Backend.Domain.Interfaces;
using ChangeMe.Backend.Infrastructure.Configurations;
using ChangeMe.Backend.Infrastructure.Persistence;
using ChangeMe.Backend.IntegrationTests.Support.Fakes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
#if PostgreSQL
using Testcontainers.PostgreSql;
#else
using Testcontainers.MsSql;
#endif

namespace ChangeMe.Backend.IntegrationTests.Fixtures;

public sealed class BackendWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
  private readonly Dictionary<string, string?> environmentOverrides = new();
#if PostgreSQL
  private readonly PostgreSqlContainer postgresContainer = new PostgreSqlBuilder("postgres:15.1")
    .Build();
#else
  private readonly MsSqlContainer msSqlContainer = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2022-latest")
    .Build();
#endif

  public async ValueTask InitializeAsync()
  {
    var cancellationToken = TestContext.Current.CancellationToken;

#if PostgreSQL
    await postgresContainer.StartAsync(cancellationToken);
#else
    await msSqlContainer.StartAsync(cancellationToken);
#endif
    ApplyEnvironmentOverrides();

    using var client = CreateClient(new WebApplicationFactoryClientOptions
    {
      BaseAddress = new Uri("https://localhost")
    });

    await using var scope = Services.CreateAsyncScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await DatabaseConfig.ApplyPendingMigrationsAsync(dbContext, cancellationToken);
  }

  public new async ValueTask DisposeAsync()
  {
    var cancellationToken = TestContext.Current.CancellationToken;

    ClearEnvironmentOverrides();
#if PostgreSQL
    await postgresContainer.DisposeAsync().AsTask().WaitAsync(cancellationToken);
#else
    await msSqlContainer.DisposeAsync().AsTask().WaitAsync(cancellationToken);
#endif
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
#if PostgreSQL
    environmentOverrides["ConnectionStrings__DefaultConnection"] = postgresContainer.GetConnectionString();
#else
    environmentOverrides["ConnectionStrings__DefaultConnection"] = msSqlContainer.GetConnectionString();
#endif
    environmentOverrides["Database__ApplyMigrationsOnStartup"] = "false";
    environmentOverrides["DatabaseOptions__ApplyMigrationsOnStartup"] = "false";
    environmentOverrides["Jwt__Issuer"] = "ChangeMe.Tests";
    environmentOverrides["Jwt__Audience"] = "ChangeMe.Tests";
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
