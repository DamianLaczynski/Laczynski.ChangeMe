using Laczynski.ChangeMe.Backend.Infrastructure;
using Laczynski.ChangeMe.Backend.Infrastructure.Email;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class ServiceConfigs
{
  public static IServiceCollection AddServiceConfigs(this IServiceCollection services, Microsoft.Extensions.Logging.ILogger logger, WebApplicationBuilder builder)
  {
    services.AddInfrastructureServices(builder.Configuration, logger)
            .AddMediatrConfigs()
            .AddCorsConfig(builder.Configuration);

    services.AddHttpContextAccessor();

    if (builder.Environment.IsDevelopment())
    {
      services.AddScoped<IEmailService, SmtpEmailService>();
    }
    else
    {
      services.AddScoped<IEmailService, SmtpEmailService>();
    }


    logger.LogInformation("{Project} services registered", "Mediatr, Email Services");

    return services;
  }
}
