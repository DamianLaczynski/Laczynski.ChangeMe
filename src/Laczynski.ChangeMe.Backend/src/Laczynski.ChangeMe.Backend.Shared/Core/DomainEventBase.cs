using MediatR;

namespace Laczynski.ChangeMe.Backend.Shared.Core;

/// <summary>
/// A base type for domain events. Depends on MediatR INotification.
/// Includes DateOccurred which is set on creation.
/// </summary>
public abstract class DomainEventBase : EntityBase<Guid>, IHasDomainEvents, INotification
{
  /// <summary>
  /// The date and time the event occurred.
  /// </summary>
  public DateTime DateOccurred { get; protected set; } = DateTime.UtcNow;
}

