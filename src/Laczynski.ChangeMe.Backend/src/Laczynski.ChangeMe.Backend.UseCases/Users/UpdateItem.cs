using Laczynski.ChangeMe.Backend.UseCases.Items;
using Microsoft.EntityFrameworkCore;

namespace Laczynski.ChangeMe.Backend.UseCases.Users;

public record UpdateItemCommand(
    Guid Id,
    string? Name,
    string? Description,
    decimal? Price,
    string? Image) : ICommand<ItemDto>;

public class UpdateItemHandler : ICommandHandler<UpdateItemCommand, ItemDto>
{
  private readonly ApplicationDbContext _context;

  public UpdateItemHandler(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Result<ItemDto>> Handle(UpdateItemCommand command, CancellationToken cancellationToken)
  {
    try
    {
      var item = await _context.Items.FindAsync(command.Id, cancellationToken);
      if (item == null)
      {
        return Result<ItemDto>.NotFound($"Item with ID: {command.Id} not found");
      }

      if (!string.IsNullOrEmpty(command.Name) && !string.IsNullOrEmpty(command.Description) && command.Price.HasValue && !string.IsNullOrEmpty(command.Image))
      {
        item.UpdateDetails(command.Name, command.Description, command.Price.Value, command.Image);
      }

      if (!string.IsNullOrEmpty(command.Name))
      {
        var existingItem = await _context.Items.FirstOrDefaultAsync(i => i.Name == command.Name && i.Id != command.Id, cancellationToken);

        if (existingItem != null)
        {
          return Result<ItemDto>.Invalid(new List<ValidationError>
                    {
                        new("Name", $"Item with name {command.Name} already exists")
                    });
        }

        item.UpdateName(command.Name);
      }

      if (command.Price.HasValue)
      {
        item.UpdatePrice(command.Price.Value);
      }

      if (!string.IsNullOrEmpty(command.Image))
      {
        item.UpdateImage(command.Image);
      }

      _context.Items.Update(item);

      await _context.SaveChangesAsync(cancellationToken);

      return Result<ItemDto>.Success(item.ToDto());
    }
    catch (Exception ex)
    {
      return Result<ItemDto>.Error($"An error occurred while updating the item: {ex.Message}");
    }
  }
}
