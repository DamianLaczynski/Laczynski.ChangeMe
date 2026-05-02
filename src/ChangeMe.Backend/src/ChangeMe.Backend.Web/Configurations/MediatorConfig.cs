using System.Reflection;
using ChangeMe.Backend.Domain.Aggregates.Issue;
using ChangeMe.Backend.UseCases.Issues;

namespace ChangeMe.Backend.Web.Configurations;

public static class MediatorConfig
{
  public static IServiceCollection AddMediator(this IServiceCollection services)
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
