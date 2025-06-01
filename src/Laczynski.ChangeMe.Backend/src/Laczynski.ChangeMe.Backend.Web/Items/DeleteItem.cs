using Laczynski.ChangeMe.Backend.UseCases.Items;

namespace Laczynski.ChangeMe.Backend.Web.Items;

public class DeleteItem(IMediator _mediator) : BaseEndpoint<DeleteItemRequest, bool>
{
  protected override void ConfigureEndpoint()
  {
    Delete(DeleteItemRequest.Route);
    AllowAnonymous();
    Summary(s =>
    {
      s.Summary = "Delete item";
      s.Description = "Delete item by id";
    });
  }

  protected override async Task<Result<bool>> HandleEndpointAsync(
      DeleteItemRequest req,
      CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new DeleteItemCommand(req.Id), cancellationToken);
    return Result<bool>.Success(result);
  }
}
