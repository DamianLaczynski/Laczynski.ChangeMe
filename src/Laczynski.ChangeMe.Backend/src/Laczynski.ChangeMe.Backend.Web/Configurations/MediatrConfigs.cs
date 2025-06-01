using System.Reflection;
using Laczynski.ChangeMe.Backend.Core.ItemsAggregate;
using Laczynski.ChangeMe.Backend.Shared.Core;
using Laczynski.ChangeMe.Backend.UseCases.Items;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class MediatrConfigs
{
  public static IServiceCollection AddMediatrConfigs(this IServiceCollection services)
  {
    var mediatRAssemblies = new[]
      {
        Assembly.GetAssembly(typeof(Item)), // Core
        Assembly.GetAssembly(typeof(GetAllItemsQuery)) // UseCases
      };

    services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(mediatRAssemblies!))
            .AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>))
            .AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();

    return services;
  }
}
