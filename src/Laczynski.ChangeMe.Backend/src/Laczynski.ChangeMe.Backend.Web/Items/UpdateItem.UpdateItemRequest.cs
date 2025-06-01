namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Request to update item
/// </summary>
public class UpdateItemRequest
{
  /// <summary>
  /// Route for update item
  /// </summary>
  public static string Route => "/items/{id}";

  /// <summary>
  /// Item id
  /// </summary>
  public Guid Id { get; set; }

  /// <summary>
  /// Item name
  /// </summary>
  public string Name { get; set; } = string.Empty;

  /// <summary>
  /// Item description
  /// </summary>
  public string Description { get; set; } = string.Empty;

  /// <summary>
  /// Item price
  /// </summary>
  public decimal Price { get; set; }

  /// <summary>
  /// Item image
  /// </summary>
  public string Image { get; set; } = string.Empty;
}
