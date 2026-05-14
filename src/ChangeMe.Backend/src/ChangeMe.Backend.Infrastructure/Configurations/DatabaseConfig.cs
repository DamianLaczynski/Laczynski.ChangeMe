using ChangeMe.Backend.Infrastructure.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

namespace ChangeMe.Backend.Infrastructure.Configurations;

public sealed class DatabaseOptions
{
  public bool ApplyMigrationsOnStartup { get; set; }
}

public static class DatabaseConfig
{
  public static IServiceCollection AddDatabase(this IServiceCollection services, WebApplicationBuilder builder, ILogger logger)
  {
    services.Configure<DatabaseOptions>(builder.Configuration.GetSection("Database"));

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
      var keys = string.Join(", ",
          builder.Configuration.GetSection("ConnectionStrings").GetChildren().Select(c => c.Key));
      throw new InvalidOperationException(
          $"Connection string 'DefaultConnection' is not configured. Available connection string keys: {keys}");
    }

#if PostgreSQL
    logger.LogInformation("Using PostgreSQL database");

    services.AddDbContext<ApplicationDbContext>(options =>
    {
      options.UseNpgsql(connectionString, npgsql =>
          npgsql.MigrationsHistoryTable("__EFMigrationsHistory", DatabaseSchema.Default));

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
#else
    logger.LogInformation("Using SQL Server database");

    services.AddDbContext<ApplicationDbContext>(options =>
    {
      options.UseSqlServer(connectionString, sql =>
          sql.MigrationsHistoryTable("__EFMigrationsHistory", DatabaseSchema.Default));

      if (builder.Environment.IsDevelopment())
      {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
        logger.LogInformation("Sensitive data logging enabled for development");
      }
    });

    services.AddHealthChecks()
        .AddSqlServer(connectionString, name: "sqlserver", tags: ["db", "ready"]);

    logger.LogInformation("SQL Server database connection configured");
#endif
    return services;
  }

  public static async Task UseDatabase(this WebApplication app)
  {
    if (!app.Configuration.GetValue("Database:ApplyMigrationsOnStartup", false))
      return;

    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
  }

}
