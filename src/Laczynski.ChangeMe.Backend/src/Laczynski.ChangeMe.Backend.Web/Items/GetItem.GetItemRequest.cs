namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Request to get item
/// </summary>
public class GetItemRequest
{
  /// <summary>
  /// Route for get item
  /// </summary>
  public static string Route => "/items/{id}";

  /// <summary>
  /// Builds the route for get item
  /// </summary>
  public static string BuildRoute(Guid id) => Route.Replace("{Id:guid}", id.ToString());

  /// <summary>
  /// Item id
  /// </summary>
  public Guid Id { get; set; }
}

