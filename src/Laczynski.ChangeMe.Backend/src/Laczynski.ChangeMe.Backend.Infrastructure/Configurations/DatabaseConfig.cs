using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Configurations;

public sealed class DatabaseOptions
{
    public bool ApplyMigrationsOnStartup { get; set; }
}

public static class DatabaseConfig
{
    public static IServiceCollection AddDatabase(this IServiceCollection services, WebApplicationBuilder builder, ILogger logger)
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            var keys = string.Join(", ",
                builder.Configuration.GetSection("ConnectionStrings").GetChildren().Select(c => c.Key));
            throw new InvalidOperationException(
                $"Connection string 'DefaultConnection' is not configured. Available connection string keys: {keys}");
        }

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
        return services;
    }

    public static async Task UseDatabase(this WebApplication app)
    {
        if (!app.Configuration.GetValue("DatabaseOptions:ApplyMigrationsOnStartup", false))
            return;

        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }

}