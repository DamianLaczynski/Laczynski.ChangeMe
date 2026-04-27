
namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public class GetAllIssuesQuery : PaginationQuery<IssueDto>;

public class GetAllIssuesHandler(ApplicationDbContext context) : IQueryHandler<GetAllIssuesQuery, PaginationResult<IssueDto>>
{
  public async Task<Result<PaginationResult<IssueDto>>> Handle(GetAllIssuesQuery query, CancellationToken cancellationToken)
  {
    var selector = IssueExtensions.ToIssueDtoExpression();
    var issues = await context.Issues
      .AsNoTracking()
      .ToPaginationResultAsync(selector, query.PaginationParameters, cancellationToken);

    return Result.Success(issues);
  }
}
