using Laczynski.ChangeMe.Backend.UseCases.Items;

namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Get item endpoint
/// </summary>
public class GetItem(IMediator _mediator) : BaseEndpoint<GetItemRequest, ItemDto>
{
  protected override void ConfigureEndpoint()
  {
    Get(GetItemRequest.Route);
    AllowAnonymous();
    Summary(s =>
    {
      s.Summary = "Get item";
      s.Description = "Get item by id";
    });
  }

  protected override async Task<Result<ItemDto>> HandleEndpointAsync(
      GetItemRequest req,
      CancellationToken cancellationToken)
  {
    var result = await _mediator.Send(new GetItemByIdQuery(req.Id), cancellationToken);
    return Result<ItemDto>.Success(result);
  }
}