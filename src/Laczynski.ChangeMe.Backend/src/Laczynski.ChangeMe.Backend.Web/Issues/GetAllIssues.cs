using Laczynski.ChangeMe.Backend.UseCases.Issues;

namespace Laczynski.ChangeMe.Backend.Web.Issues;

public class GetAllIssues(IMediator _mediator) : BaseEndpoint<GetAllIssuesQuery, List<IssueDto>>(_mediator)
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

public sealed class GetAllIssuesQueryValidator : Validator<GetAllIssuesQuery>
{
  private const int MaxPageSize = 100;

  public GetAllIssuesQueryValidator()
  {
    RuleFor(x => x.Page)
      .GreaterThanOrEqualTo(1);

    RuleFor(x => x.PageSize)
      .GreaterThanOrEqualTo(1)
      .LessThanOrEqualTo(MaxPageSize);
  }
}
