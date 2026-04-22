using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.Infrastructure.Auth;
using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Npgsql;

namespace Laczynski.ChangeMe.Backend.Infrastructure;

public static class DependencyInjection
{
  public static IServiceCollection AddInfrastructure(
    this IServiceCollection services,
    WebApplicationBuilder builder,
    ILogger logger)
  {
    ConfigureDatabaseConnection(services, builder, logger);
    ConfigureUserAccessor(services, builder, logger);

    logger.LogInformation("{Project} services registered", "Infrastructure");
    return services;
  }

  private static void ConfigureDatabaseConnection(
    IServiceCollection services,
    WebApplicationBuilder builder,
    ILogger logger)
  {
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
      var keys = string.Join(", ",
          builder.Configuration.GetSection("ConnectionStrings").GetChildren().Select(c => c.Key));
      throw new InvalidOperationException(
          $"Connection string 'ConnectionStrings__DefaultConnection' is not configured. Available connection string keys: {keys}");
    }

    logger.LogInformation("Using PostgreSQL database");

    services.AddDbContext<ApplicationDbContext>(options =>
    {
      options.UseNpgsql(connectionString, npgsql =>
        npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "laczynski_changeme"));

      if (builder.Environment.IsDevelopment())
      {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
        logger.LogInformation("Sensitive data logging enabled for development");
      }
    });


    services.AddHealthChecks()
        .AddNpgSql(connectionString, name: "postgres", tags: ["db", "ready"]);

    logger.LogInformation("PostgreSQL database connection configured");
  }

  private static void ConfigureUserAccessor(
    IServiceCollection services,
    WebApplicationBuilder builder,
    ILogger logger)
  {
    builder.Services.AddHttpContextAccessor();
    services.AddScoped<IUserAccessor, UserAccessor>();

    logger.LogInformation("Authentication services configured");
  }

}
