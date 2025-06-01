using Laczynski.ChangeMe.Backend.Infrastructure.Data;

namespace Laczynski.ChangeMe.Backend.Infrastructure;
public static class InfrastructureServiceExtensions
{
  public static IServiceCollection AddInfrastructureServices(
    this IServiceCollection services,
    ConfigurationManager config,
    ILogger logger)
  {
    ConfigureDatabaseConnection(services, config, logger);

    logger.LogInformation("{Project} services registered", "Infrastructure");

    return services;
  }

  private static void ConfigureDatabaseConnection(
    IServiceCollection services,
    ConfigurationManager config,
    ILogger logger)
  {
    string? postgresConnection = config.GetConnectionString("DefaultConnection");
    Guard.Against.Null(postgresConnection, message: "PostgreSQL connection string not found.");
    logger.LogInformation("Using PostgreSQL database");

    services.AddDbContext<ApplicationDbContext>(options =>
      options.UseNpgsql(postgresConnection,
        npgsqlOptions => npgsqlOptions.MigrationsAssembly("Laczynski.ChangeMe.Backend.Infrastructure")
          .SetPostgresVersion(16, 0)));
  }
}
