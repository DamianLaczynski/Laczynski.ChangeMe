using Laczynski.ChangeMe.Backend.UseCases.Items;
using Laczynski.ChangeMe.Backend.UseCases.Users;

namespace Laczynski.ChangeMe.Backend.Web.Items;

public class UpdateItem(IMediator _mediator) : BaseEndpoint<UpdateItemRequest, ItemDto>
{
  protected override void ConfigureEndpoint()
  {
    Put(UpdateItemRequest.Route);
    AllowAnonymous();
    Summary(s =>
    {
      s.Summary = "Update item";
      s.Description = "Update item by id";
    });
  }

  protected override async Task<Result<ItemDto>> HandleEndpointAsync(
      UpdateItemRequest req,
      CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new UpdateItemCommand(req.Id, req.Name, req.Description, req.Price, req.Image), cancellationToken);
    return Result<ItemDto>.Success(result);
  }
}