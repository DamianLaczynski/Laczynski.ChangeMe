using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.Infrastructure.Auth;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Configurations;

public static class UserAccessorConfig
{
    public static IServiceCollection AddUserAccessor(this IServiceCollection services)
    {
        services.AddScoped<IUserAccessor, UserAccessor>();
        return services;
    }
}