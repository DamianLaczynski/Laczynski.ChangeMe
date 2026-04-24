using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Configurations;

public sealed class HangfireOptions
{
  public string DashboardPath { get; set; } = "/hangfire";
}

public static class HangfireConfig
{
  public static IServiceCollection AddHangfire(this IServiceCollection services, WebApplicationBuilder builder, ILogger logger)
  {
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
      var keys = string.Join(", ",
          builder.Configuration.GetSection("ConnectionStrings").GetChildren().Select(c => c.Key));
      throw new InvalidOperationException(
          $"Connection string 'DefaultConnection' is not configured. Available connection string keys: {keys}");
    }

    services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString)));

    services.AddHangfireServer();

    logger.LogInformation("{Project} services configured", "Hangfire");
    return services;
  }
}
