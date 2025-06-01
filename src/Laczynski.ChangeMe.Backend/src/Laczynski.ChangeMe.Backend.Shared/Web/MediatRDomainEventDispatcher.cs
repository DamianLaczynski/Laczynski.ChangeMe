using Laczynski.ChangeMe.Backend.Shared.Core;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Laczynski.ChangeMe.Backend.Shared.Web;

/// <summary>
/// Dispatches and clears domain events using MediatR.
/// </summary>
public class MediatRDomainEventDispatcher : IDomainEventDispatcher
{
  /// <summary>
  /// The MediatR mediator.
  /// </summary>
  private readonly IMediator _mediator;

  /// <summary>
  /// The logger.
  /// </summary>
  private readonly ILogger<MediatRDomainEventDispatcher> _logger;

  /// <summary>
  /// Initializes a new instance of the <see cref="MediatRDomainEventDispatcher"/> class.
  /// </summary>
  public MediatRDomainEventDispatcher(IMediator mediator, ILogger<MediatRDomainEventDispatcher> logger)
  {
    _mediator = mediator;
    _logger = logger;
  }

  /// <summary>
  /// Dispatches and clears domain events.
  /// </summary>
  public async Task DispatchAndClearEvents(IEnumerable<IHasDomainEvents> entitiesWithEvents)
  {
    foreach (IHasDomainEvents entity in entitiesWithEvents)
    {
      if (entity is HasDomainEventsBase hasDomainEvents)
      {
        DomainEventBase[] events = hasDomainEvents.DomainEvents.ToArray();
        hasDomainEvents.ClearDomainEvents();

        foreach (DomainEventBase domainEvent in events)
          await _mediator.Publish(domainEvent).ConfigureAwait(false);
      }
      else
      {
        _logger.LogError(
          "Entity of type {EntityType} does not inherit from {BaseType}. Unable to clear domain events.",
          entity.GetType().Name,
          nameof(HasDomainEventsBase));
      }
    }
  }
}
