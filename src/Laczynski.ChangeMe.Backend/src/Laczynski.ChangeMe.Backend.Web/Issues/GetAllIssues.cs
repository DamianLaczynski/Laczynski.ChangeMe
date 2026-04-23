using Laczynski.ChangeMe.Backend.UseCases.Issues;

namespace Laczynski.ChangeMe.Backend.Web.Issues;

public class GetAllIssues(IMediator _mediator) : BaseEndpoint<GetAllIssuesQuery, PaginationResult<IssueDto>>(_mediator)
{
  protected override void ConfigureEndpoint()
  {
    Get("/issues");
    Summary(s =>
    {
      s.Summary = "Get all issues";
      s.Description = "Get all issues";
    });
  }
}