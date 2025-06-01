namespace Laczynski.ChangeMe.Backend.Shared.Pagination;

/// <summary>
/// Pagination parameters
/// </summary>
public class PaginationParameters<T>
{
  private static readonly int MaxPageSize = 100;
  public const int DefaultPageSize = 10;
  public const int DefaultPageNumber = 1;
  public const string DefaultSortField = "Id";
  public const bool DefaultAscending = true;

  private int _pageSize = DefaultPageSize;

  /// <summary>
  /// Page number
  /// </summary>
  public int PageNumber { get; set; } = DefaultPageNumber;

  /// <summary>
  /// Number of elements per page.
  /// </summary>
  public int PageSize
  {
    get => _pageSize;
    set => _pageSize = value > MaxPageSize ? MaxPageSize : (value <= 0 ? DefaultPageSize : value);
  }

  /// <summary>
  /// Field to sort by.
  /// </summary>
  public string SortField { get; set; } = DefaultSortField;

  /// <summary>
  /// Whether to sort ascending.
  /// </summary>
  public bool Ascending { get; set; } = DefaultAscending;

  /// <summary>
  /// Validates and normalizes pagination parameters
  /// </summary>
  /// <returns>Validated and normalized pagination parameters</returns>
  public PaginationParameters<T> Validate()
  {
    if (PageNumber < DefaultPageNumber)
    {
      PageNumber = DefaultPageNumber;
    }

    SortField = string.IsNullOrWhiteSpace(SortField) ? DefaultSortField : SortField;

    return this;
  }

  /// <summary>
  /// Creates a new instance of pagination parameters
  /// </summary>
  /// <param name="pageNumber">Page number</param>
  /// <param name="pageSize">Page size</param>
  /// <param name="sortField">Sort field</param>
  /// <param name="ascending">Sorting direction</param>
  /// <returns>New instance of pagination parameters</returns>
  public static PaginationParameters<T> Create(int pageNumber = DefaultPageNumber, int pageSize = DefaultPageSize, string sortField = DefaultSortField, bool ascending = DefaultAscending)
  {
    return new PaginationParameters<T>
    {
      PageNumber = pageNumber,
      PageSize = pageSize,
      SortField = sortField,
      Ascending = ascending
    }.Validate();
  }
}
