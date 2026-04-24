using Laczynski.ChangeMe.Backend.Infrastructure.Auth;
using Laczynski.ChangeMe.Backend.Infrastructure.Configurations;
using Laczynski.ChangeMe.Backend.Infrastructure.Email;

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
    services.Configure<HangfireOptions>(configuration.GetSection("HangfireOptions"));
    services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

    logger.LogInformation("{Project} were configured", "Options");

    return services;
  }
}
