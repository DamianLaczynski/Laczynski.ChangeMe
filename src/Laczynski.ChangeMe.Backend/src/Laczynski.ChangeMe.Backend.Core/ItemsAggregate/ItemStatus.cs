namespace Laczynski.ChangeMe.Backend.Core.ItemsAggregate;

using Ardalis.SmartEnum;

/// <summary>
/// Represents the status of an item in the system.
/// </summary>
public class ItemStatus : SmartEnum<ItemStatus>
{
  /// <summary>
  /// Active status.
  /// </summary>
  public static readonly ItemStatus Active = new(nameof(Active), 1);

  /// <summary>
  /// Inactive status.
  /// </summary>
  public static readonly ItemStatus Inactive = new(nameof(Inactive), 2);

  /// <summary>
  /// Suspended status.
  /// </summary>
  public static readonly ItemStatus Suspended = new(nameof(Suspended), 3);

  /// <summary>
  /// Deleted status.
  /// </summary>
  public static readonly ItemStatus Deleted = new(nameof(Deleted), 4);

  /// <summary>
  /// Constructor of the item status.
  /// </summary>
  protected ItemStatus(string name, int value) : base(name, value) { }
}
