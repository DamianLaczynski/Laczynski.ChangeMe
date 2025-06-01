using Laczynski.ChangeMe.Backend.Core.ItemsAggregate;

namespace Laczynski.ChangeMe.Backend.UseCases.Items;

/// <summary>
/// DTO for the Item entity
/// </summary>
public class ItemDto
{
  /// <summary>
  /// Unique identifier for the item
  /// </summary>
  public Guid Id { get; set; }

  /// <summary>
  /// Name of the item
  /// </summary>
  public string Name { get; set; } = string.Empty;

  /// <summary>
  /// Description of the item
  /// </summary>
  public string Description { get; set; } = string.Empty;

  /// <summary>
  /// Price of the item
  /// </summary>
  public decimal Price { get; set; }

  /// <summary>
  /// Image of the item
  /// </summary>
  public string Image { get; set; } = string.Empty;
}

/// <summary>
/// Extensions for mapping Item objects to ItemDto
/// </summary>
public static class ItemExtensions
{
  /// <summary>
  /// Converts the Item entity to a ItemDto
  /// </summary>
  public static ItemDto ToDto(this Item item)
  {

    return new ItemDto
    {
      Id = item.Id,
      Name = item.Name,
      Description = item.Description,
      Price = item.Price,
      Image = item.Image
    };
  }

  /// <summary>
  /// Converts the Item entity to a ItemDto expression
  /// </summary>
  public static Expression<Func<Item, ItemDto>> ToDtoExpression()
  {
    return item => new ItemDto
    {
      Id = item.Id,
      Name = item.Name,
      Description = item.Description,
      Price = item.Price,
      Image = item.Image
    };
  }
}