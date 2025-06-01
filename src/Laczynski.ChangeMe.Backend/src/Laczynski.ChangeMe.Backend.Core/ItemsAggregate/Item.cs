namespace Laczynski.ChangeMe.Backend.Core.ItemsAggregate;

/// <summary>
/// Represents a item in the system.
/// </summary>
public class Item : EntityBase<Guid>, IAggregateRoot
{
  #region Properties

  /// <summary>
  /// Name.
  /// </summary>
  public string Name { get; private set; } = string.Empty;

  /// <summary>
  /// Description.
  /// </summary>
  public string Description { get; private set; } = string.Empty;

  /// <summary>
  /// Price.
  /// </summary>
  public decimal Price { get; private set; }

  /// <summary>
  /// Image.
  /// </summary>
  public string Image { get; private set; } = string.Empty;

  #endregion

  #region Constructors

  /// <summary>
  /// Private constructor for EF Core.
  /// </summary>
  private Item() { }

  /// <summary>
  /// Constructor creating a new item.
  /// </summary>
  public Item(string name, string description, decimal price, string image)
  {
    Name = Guard.Against.NullOrEmpty(name, nameof(name));
    Description = Guard.Against.NullOrEmpty(description, nameof(description));
    Price = Guard.Against.Null(price, nameof(price));
    Image = Guard.Against.NullOrEmpty(image, nameof(image));
    CreatedAt = DateTime.UtcNow;
  }

  #endregion

  #region Public Methods
  /// <summary>
  /// Updates the details of the item.
  /// </summary>
  public void UpdateDetails(string name, string description, decimal price, string image)
  {
    Name = Guard.Against.NullOrEmpty(name, nameof(name));
    Description = Guard.Against.NullOrEmpty(description, nameof(description));
    Price = Guard.Against.Null(price, nameof(price));
    Image = Guard.Against.NullOrEmpty(image, nameof(image));
    ModifiedAt = DateTime.UtcNow;
  }

  /// <summary>
  /// Updates the name of the item.
  /// </summary>
  public void UpdateName(string name)
  {
    Name = Guard.Against.NullOrEmpty(name, nameof(name));
    ModifiedAt = DateTime.UtcNow;
  }

  /// <summary>
  /// Updates the description of the item.
  /// </summary>
  public void UpdateDescription(string description)
  {
    Description = Guard.Against.NullOrEmpty(description, nameof(description));
    ModifiedAt = DateTime.UtcNow;
  }

  /// <summary>
  /// Updates the price of the item.
  /// </summary>
  public void UpdatePrice(decimal price)
  {
    Price = Guard.Against.Null(price, nameof(price));
    ModifiedAt = DateTime.UtcNow;
  }

  /// <summary>
  /// Updates the image of the item.
  /// </summary>
  public void UpdateImage(string image)
  {
    Image = Guard.Against.NullOrEmpty(image, nameof(image));
    ModifiedAt = DateTime.UtcNow;
  }

  /// <summary>
  /// Deletes the item.
  /// </summary>
  public void Delete()
  {
    IsDeleted = true;
    ModifiedAt = DateTime.UtcNow;
  }

  #endregion
}
