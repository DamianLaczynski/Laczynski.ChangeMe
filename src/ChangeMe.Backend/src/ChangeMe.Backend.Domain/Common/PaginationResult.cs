namespace ChangeMe.Backend.Domain.Common;

public class PaginationResult<T>
{
  public List<T> Items { get; private set; }
  public int TotalCount { get; private set; }
  public int TotalPages { get; private set; }
  public int CurrentPage { get; private set; }
  public int PageSize { get; private set; }
  public bool HasPrevious => CurrentPage > PaginationParameters<T>.DefaultPageNumber;
  public bool HasNext => CurrentPage < TotalPages;
  public string SortField { get; private set; }
  public bool Ascending { get; private set; }

  private PaginationResult(List<T> items, int totalCount, int currentPage, int pageSize, string sortField, bool ascending)
  {
    Items = items;
    TotalCount = totalCount;
    CurrentPage = currentPage;
    PageSize = pageSize;
    SortField = sortField;
    Ascending = ascending;
    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
  }

  public static PaginationResult<T> Create(List<T> items, int totalCount, int currentPage, int pageSize, string sortField, bool ascending)
  {
    return new PaginationResult<T>(items, totalCount, currentPage, pageSize, sortField, ascending);
  }

  public static PaginationResult<T> Create(List<T> items, int totalCount, PaginationParameters<T> parameters)
  {
    return new PaginationResult<T>(
        items,
        totalCount,
        parameters.PageNumber,
        parameters.PageSize,
        parameters.SortField,
        parameters.Ascending);
  }

  public static PaginationResult<T> Empty()
  {
    return new PaginationResult<T>(
        new List<T>(),
        0,
        PaginationParameters<T>.DefaultPageNumber,
        PaginationParameters<T>.DefaultPageSize,
        PaginationParameters<T>.DefaultSortField,
        PaginationParameters<T>.DefaultAscending);
  }
}
