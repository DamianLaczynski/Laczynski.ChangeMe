using Laczynski.ChangeMe.Backend.UseCases.Items;

namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Request to get all items
/// </summary>
public class GetAllItemsRequest : PaginationRequest<ItemDto>
{
  /// <summary>
  /// Route for get all items
  /// </summary>
  public static string Route => "/items";

  /// <summary>
  /// Builds the route for get all items
  /// </summary>
  public static string BuildRoute() => Route;

  /// <summary>
  /// Item id
  /// </summary>
  public string? SearchTerm { get; set; } = string.Empty;

}
