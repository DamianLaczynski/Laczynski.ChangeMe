namespace Laczynski.ChangeMe.Backend.UseCases.Items;

public class GetAllItemsQuery : PaginationQuery<ItemDto>
{
  public string? SearchTerm { get; set; }
}

public class GetAllItemsHandler : IQueryHandler<GetAllItemsQuery, PaginationResult<ItemDto>>
{
  private readonly ApplicationDbContext _context;

  public GetAllItemsHandler(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Result<PaginationResult<ItemDto>>> Handle(GetAllItemsQuery query, CancellationToken cancellationToken)
  {
    try
    {
      var queryable = _context.Items.AsQueryable();

      if (!string.IsNullOrWhiteSpace(query.SearchTerm))
      {
        var searchTerm = query.SearchTerm.ToLower();
        queryable = queryable.Where(i => i.Name.ToLower().Contains(searchTerm) ||
                      i.Description.ToLower().Contains(searchTerm) ||
                      i.Price.ToString().Contains(searchTerm));
      }

      var paginatedResult = await queryable.ToPaginationResultAsync(
          ItemExtensions.ToDtoExpression(),
          query.PaginationParameters,
          cancellationToken);

      return Result<PaginationResult<ItemDto>>.Success(paginatedResult);
    }
    catch (Exception ex)
    {
      return Result<PaginationResult<ItemDto>>.Error($"An error occurred while fetching items: {ex.Message}");
    }
  }
}
