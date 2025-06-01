
namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Request to delete item
/// </summary>
public class DeleteItemRequest
{
  /// <summary>
  /// Route for delete item
  /// </summary>
  public static string Route => "/items/{id}";

  /// <summary>
  /// Builds the route for delete item
  /// </summary>
  public static string BuildRoute() => Route;

  /// <summary>
  /// Item id
  /// </summary>
  public Guid Id { get; set; }
}
