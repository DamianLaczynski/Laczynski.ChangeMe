using Laczynski.ChangeMe.Backend.UseCases.Items;

namespace Laczynski.ChangeMe.Backend.Web.Items;

public class CreateItem(IMediator _mediator) : BaseEndpoint<CreateItemRequest, Guid>
{
  protected override void ConfigureEndpoint()
  {
    Post(CreateItemRequest.Route);
    AllowAnonymous();
    Summary(s =>
    {
      s.Summary = "Create item";
      s.Description = "Create item with name, description, price and image";
    });
  }

  protected override async Task<Result<Guid>> HandleEndpointAsync(
      CreateItemRequest req,
      CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new CreateItemCommand(req.Name, req.Description, req.Price, req.Image), cancellationToken);
    return result;

  }
}