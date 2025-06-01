using Laczynski.ChangeMe.Backend.Core.ItemsAggregate;
using Microsoft.EntityFrameworkCore;

namespace Laczynski.ChangeMe.Backend.UseCases.Items;

public record CreateItemCommand(
    string Name,
    string Description,
    decimal Price,
    string Image) : ICommand<Guid>;

public class CreateItemHandler : ICommandHandler<CreateItemCommand, Guid>
{
  private readonly ApplicationDbContext _context;

  public CreateItemHandler(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Result<Guid>> Handle(CreateItemCommand command, CancellationToken cancellationToken)
  {
    try
    {

      var existingItem = await _context.Items.FirstOrDefaultAsync(i => i.Name == command.Name, cancellationToken);
      if (existingItem != null)
      {
        return Result<Guid>.Invalid(new List<ValidationError>
        {
          new("Name", $"Item with name {command.Name} already exists")
        });
      }

      var item = new Item(command.Name, command.Description, command.Price, command.Image);

      await _context.Items.AddAsync(item, cancellationToken);
      await _context.SaveChangesAsync(cancellationToken);

      return Result<Guid>.Success(item.Id);
    }
    catch (Exception ex)
    {
      return Result<Guid>.Error($"An error occurred while creating the item: {ex.Message}");
    }
  }
}
