using Laczynski.ChangeMe.Backend.UseCases.Items;

namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Get all items endpoint
/// </summary>
public class GetAllItems(IMediator _mediator) : BaseEndpoint<GetAllItemsRequest, PaginationResult<ItemDto>>
{
  protected override void ConfigureEndpoint()
  {
    Get(GetAllItemsRequest.Route);
    AllowAnonymous();
    Summary(s =>
    {
      s.Summary = "Get all items";
      s.Description = "Get all items with pagination";
    });
  }

  protected override async Task<Result<PaginationResult<ItemDto>>> HandleEndpointAsync(
      GetAllItemsRequest req,
      CancellationToken cancellationToken)
  {
    var query = new GetAllItemsQuery
    {
      SearchTerm = req.SearchTerm,
      PaginationParameters = req.PaginationParameters
    };

    return await _mediator.Send(query, cancellationToken);
  }
}