namespace Laczynski.ChangeMe.Backend.UseCases.Items;

public record GetItemByIdQuery(Guid Id) : IQuery<ItemDto>;

public class GetItemByIdHandler : IQueryHandler<GetItemByIdQuery, ItemDto>
{
  private readonly ApplicationDbContext _context;

  public GetItemByIdHandler(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Result<ItemDto>> Handle(GetItemByIdQuery query, CancellationToken cancellationToken)
  {
    try
    {
      var item = await _context.Items.FindAsync(query.Id, cancellationToken);

      if (item == null)
      {
        return Result<ItemDto>.NotFound($"Item with ID: {query.Id} not found");
      }

      return Result<ItemDto>.Success(item.ToDto());
    }
    catch (Exception ex)
    {
      return Result<ItemDto>.Error($"An error occurred while fetching the item: {ex.Message}");
    }
  }
}
