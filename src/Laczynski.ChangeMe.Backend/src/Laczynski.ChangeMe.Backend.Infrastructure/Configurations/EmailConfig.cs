using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.Infrastructure.Auth;
using Laczynski.ChangeMe.Backend.Infrastructure.Email;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Configurations;

public static class ServicesConfig
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, ILogger logger)
    {
        services.AddScoped<IEmailService, EmailService>();
        services.AddSingleton<IPasswordHasher, PasswordHasherAdapter>();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<IUserAccessor, UserAccessor>();
        logger.LogInformation("{Project} services configured", "Infrastructure");
        return services;
    }
}
