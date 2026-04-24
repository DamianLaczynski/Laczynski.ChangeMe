using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.Infrastructure.Email;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Configurations;

public static class EmailConfig
{
    public static IServiceCollection AddEmail(this IServiceCollection services, ILogger logger)
    {
        services.AddScoped<IEmailService, EmailService>();
        logger.LogInformation("{Project} services configured", "Email");
        return services;
    }
}