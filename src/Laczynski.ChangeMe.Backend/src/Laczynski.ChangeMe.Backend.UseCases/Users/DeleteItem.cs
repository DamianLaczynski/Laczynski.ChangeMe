namespace Laczynski.ChangeMe.Backend.UseCases.Items;

public record DeleteItemCommand(Guid ItemId) : ICommand<bool>;

public class DeleteItemHandler : ICommandHandler<DeleteItemCommand, bool>
{
  private readonly ApplicationDbContext _context;

  public DeleteItemHandler(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Result<bool>> Handle(DeleteItemCommand request, CancellationToken cancellationToken)
  {
    try
    {
      var item = await _context.Items.FindAsync(request.ItemId, cancellationToken);
      if (item == null)
      {
        return Result<bool>.NotFound($"Item with ID: {request.ItemId} not found");
      }

      item.Delete();
      await _context.SaveChangesAsync(cancellationToken);

      return Result<bool>.Success(true);
    }
    catch (Exception ex)
    {
      return Result<bool>.Error($"An error occurred while deleting the item: {ex.Message}");
    }
  }
}
