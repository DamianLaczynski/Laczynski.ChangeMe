
namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Request to create item
/// </summary>
public class CreateItemRequest
{
  /// <summary>
  /// Route for create item
  /// </summary>
  public static string Route => "/items";

  /// <summary>
  /// Builds the route for create item
  /// </summary>
  public static string BuildRoute() => Route;

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
