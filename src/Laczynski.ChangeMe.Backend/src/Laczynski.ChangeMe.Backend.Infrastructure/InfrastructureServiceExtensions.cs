using Laczynski.ChangeMe.Backend.Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

namespace Laczynski.ChangeMe.Backend.Infrastructure;
public static class InfrastructureServiceExtensions
{
  public static IServiceCollection AddInfrastructureServices(
    this IServiceCollection services,
    WebApplicationBuilder builder,
    ILogger logger)
  {
    ConfigureDatabaseConnection(services, builder, logger);

    logger.LogInformation("{Project} services registered", "Infrastructure");

    return services;
  }

  private static void ConfigureDatabaseConnection(
    IServiceCollection services,
    WebApplicationBuilder builder,
    ILogger logger)
  {
    string? postgresConnection = builder.Configuration.GetConnectionString("DefaultConnection");
    Guard.Against.Null(postgresConnection, message: "PostgreSQL connection string not found.");
    logger.LogInformation("Using PostgreSQL database");

    services.AddDbContext<ApplicationDbContext>(options =>
    {
      options.UseNpgsql(postgresConnection,
        npgsqlOptions => npgsqlOptions.MigrationsAssembly("Laczynski.Analyze.Backend.Infrastructure")
          .SetPostgresVersion(16, 0));

      if (builder.Environment.IsDevelopment())
      {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
        logger.LogInformation("Sensitive data logging enabled for development");
      }
    });
  }
}
