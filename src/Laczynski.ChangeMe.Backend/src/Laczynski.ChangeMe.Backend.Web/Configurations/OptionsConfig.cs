using Laczynski.ChangeMe.Backend.Infrastructure;
using Laczynski.ChangeMe.Backend.Infrastructure.Mail;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class OptionsConfig
{
  public static IServiceCollection AddOptionsConfig(this IServiceCollection services,
                                                    IConfiguration configuration,
                                                    Microsoft.Extensions.Logging.ILogger logger,
                                                    WebApplicationBuilder builder)
  {
    services.Configure<DatabaseOptions>(configuration.GetSection("DatabaseOptions"));
    services.Configure<EmailOptions>(configuration.GetSection("EmailOptions"));

    logger.LogInformation("{Project} were configured", "Options");

    return services;
  }
}

