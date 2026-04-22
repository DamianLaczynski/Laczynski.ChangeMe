using System.Reflection;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Common;
using Laczynski.ChangeMe.Backend.UseCases.Issues;
using Laczynski.ChangeMe.Backend.Web.Common;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class MediatrConfigs
{
  public static IServiceCollection AddMediatrConfigs(this IServiceCollection services)
  {
    var mediatRAssemblies = new[]
      {
        Assembly.GetAssembly(typeof(Issue)), // Core
        Assembly.GetAssembly(typeof(GetIssueByIdQuery)) // UseCases
      };

    services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(mediatRAssemblies!))
            .AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>))
            .AddScoped<IDomainEventDispatcher, MediatRDomainEventDispatcher>();

    return services;
  }
}
