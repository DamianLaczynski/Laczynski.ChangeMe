using Ardalis.Result;

namespace Laczynski.ChangeMe.Backend.Domain.Common;

/// <summary>
/// A base class for DDD Entities. Includes support for domain events dispatched post-persistence.
/// If you prefer GUID Ids, change it here.
/// If you need to support both GUID and int IDs, change to EntityBase&lt;TId&gt; and use TId as the type for Id.
/// </summary>
public abstract class Entity : HasDomainEventsBase
{
  /// <summary>
  /// The unique identifier for the entity.
  /// </summary>
  public Guid Id { get; set; } = Guid.NewGuid();

  public Guid CreatedBy { get; set; }
  public Guid? UpdatedBy { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }

  public bool IsDeleted { get; set; } = false;
}

public abstract class EntityBase<TId> : HasDomainEventsBase
  where TId : struct, IEquatable<TId>
{
  /// <summary>
  /// The unique identifier for the entity.
  /// </summary>
  public TId Id { get; set; } = default!;

  public Guid CreatedBy { get; set; }
  public Guid? ModifiedBy { get; set; }

  public DateTime CreatedAt { get; set; }
  public DateTime? ModifiedAt { get; set; }

  public bool IsDeleted { get; set; } = false;
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

