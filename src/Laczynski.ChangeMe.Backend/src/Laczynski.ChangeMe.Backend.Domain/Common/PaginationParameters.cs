namespace Laczynski.ChangeMe.Backend.Domain.Common;

public class PaginationParameters<T>
{
  private static readonly int MaxPageSize = 100;
  public const int DefaultPageSize = 10;
  public const int DefaultPageNumber = 1;
  public const string DefaultSortField = "Id";
  public const bool DefaultAscending = true;

  private int _pageSize = DefaultPageSize;

  public int PageNumber { get; set; } = DefaultPageNumber;

  public int PageSize
  {
    get => _pageSize;
    set => _pageSize = value > MaxPageSize ? MaxPageSize : (value <= 0 ? DefaultPageSize : value);
  }

  public string SortField { get; set; } = DefaultSortField;

  public bool Ascending { get; set; } = DefaultAscending;

  public PaginationParameters<T> Validate()
  {
    if (PageNumber < DefaultPageNumber)
    {
      PageNumber = DefaultPageNumber;
    }

    SortField = string.IsNullOrWhiteSpace(SortField) ? DefaultSortField : SortField;

    return this;
  }

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
