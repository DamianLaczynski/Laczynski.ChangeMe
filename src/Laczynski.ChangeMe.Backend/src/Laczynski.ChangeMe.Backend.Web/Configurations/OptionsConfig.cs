using Laczynski.ChangeMe.Backend.Infrastructure;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class OptionsConfig
{
  public static IServiceCollection AddOptionsConfig(this IServiceCollection services,
                                                    IConfiguration configuration,
                                                    Microsoft.Extensions.Logging.ILogger logger,
                                                    WebApplicationBuilder builder)
  {
    services.Configure<DatabaseOptions>(configuration.GetSection("DatabaseOptions"));
    services.Configure<SwaggerOptions>(configuration.GetSection("SwaggerOptions"));

    logger.LogInformation("{Project} were configured", "Options");

    return services;
  }
}

public sealed class SwaggerOptions
{
  public string DocumentName { get; set; } = "v1";
  public string ApiTitle { get; set; } = "Laczynski.ChangeMe API";
  public string SwaggerJsonRelativePath { get; set; } = "/swagger/v1/swagger.json";
  public string XmlDocFileName { get; set; } = "Laczynski.ChangeMe.Backend.Web.xml";
}
