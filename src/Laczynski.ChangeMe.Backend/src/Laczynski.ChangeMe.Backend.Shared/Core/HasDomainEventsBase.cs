using System.ComponentModel.DataAnnotations.Schema;

namespace Laczynski.ChangeMe.Backend.Shared.Core;

/// <summary>
/// Base class for entities that support domain events.
/// </summary>
public abstract class HasDomainEventsBase : IHasDomainEvents
{
  /// <summary>
  /// List of domain events.
  /// </summary>
  private readonly List<DomainEventBase> _domainEvents = new();

  /// <summary>
  /// Gets the read-only collection of domain events.
  /// </summary>
  [NotMapped]
  public IReadOnlyCollection<DomainEventBase> DomainEvents => _domainEvents.AsReadOnly();

  /// <summary>
  /// Registers a domain event.
  /// </summary>
  protected void RegisterDomainEvent(DomainEventBase domainEvent) => _domainEvents.Add(domainEvent);

  /// <summary>
  /// Clears the domain events.
  /// </summary>
  internal void ClearDomainEvents() => _domainEvents.Clear();
}
