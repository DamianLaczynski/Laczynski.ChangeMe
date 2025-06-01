namespace Laczynski.ChangeMe.Backend.Shared.Core;

/// <summary>
/// A base class for DDD Entities. Includes support for domain events dispatched post-persistence.
/// If you prefer GUID Ids, change it here.
/// If you need to support both GUID and int IDs, change to EntityBase&lt;TId&gt; and use TId as the type for Id.
/// </summary>
public abstract class EntityBase : HasDomainEventsBase
{
  /// <summary>
  /// The unique identifier for the entity.
  /// </summary>
  public int Id { get; set; }
}

public abstract class EntityBase<TId> : HasDomainEventsBase
  where TId : struct, IEquatable<TId>
{
  /// <summary>
  /// The unique identifier for the entity.
  /// </summary>
  public TId Id { get; set; } = default!;

  public DateTime CreatedAt { get; set; }

  public DateTime? ModifiedAt { get; set; }

  public bool IsDeleted { get; set; }
}

/// <summary>
/// For use with Vogen or similar tools for generating code for 
/// strongly typed Ids.
/// </summary>
/// <typeparam name="T"></typeparam>
/// <typeparam name="TId"></typeparam>
public abstract class EntityBase<T, TId> : HasDomainEventsBase
  where T : EntityBase<T, TId>
{
  /// <summary>
  /// The unique identifier for the entity.
  /// </summary>
  public TId Id { get; set; } = default!;
}

