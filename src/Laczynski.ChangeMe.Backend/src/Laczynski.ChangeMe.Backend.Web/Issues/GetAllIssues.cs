using Laczynski.ChangeMe.Backend.UseCases.Issues;
using Laczynski.ChangeMe.Backend.UseCases.Issues.Dtos;

namespace Laczynski.ChangeMe.Backend.Web.Issues;

public class GetAllIssues(IMediator mediator) : BaseEndpoint<GetAllIssuesQuery, PaginationResult<IssueDto>>(mediator)
{
  protected override void ConfigureEndpoint()
  {
    Get("/issues");
    Summary(s =>
    {
      s.Summary = "Get all issues";
      s.Description = "Gets a paged issues list with search, filters and sorting";
    });
  }
}
