using Ardalis.ListStartupServices;
using Laczynski.ChangeMe.Backend.Infrastructure.Data;
using Laczynski.ChangeMe.Backend.Web.ApiBase;
using Microsoft.EntityFrameworkCore;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class MiddlewareConfig
{
  public static async Task<IApplicationBuilder> UseAppMiddlewareAndSeedDatabase(this WebApplication app)
  {
    if (app.Environment.IsDevelopment())
    {
      app.UseDeveloperExceptionPage();
      app.UseShowAllServicesMiddleware(); // see https://github.com/ardalis/AspNetCoreStartupServices
    }
    else
    {
      app.UseApiExceptionHandler();
    }

    // Add CORS middleware - must be called before routing and endpoints
    app.UseCors(CorsConfig.CorsPolicyName);

    app.UseFastEndpoints(cfg =>
    {
      cfg.Endpoints.RoutePrefix = "api";
    })
        .UseSwaggerGen(); // Includes AddFileServer and static files middleware

    app.UseHttpsRedirection(); // Note this will drop Authorization headers

    await SeedDatabase(app);

    return app;
  }

  static async Task SeedDatabase(WebApplication app)
  {
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;

    try
    {
      var context = services.GetRequiredService<ApplicationDbContext>();

      await context.Database.MigrateAsync();

      await SeedData.InitializeAsync(context);
    }
    catch (Exception ex)
    {
      var logger = services.GetRequiredService<ILogger<Program>>();
      logger.LogError(ex, "An error occurred seeding the DB. {exceptionMessage}", ex.Message);
    }
  }
}
