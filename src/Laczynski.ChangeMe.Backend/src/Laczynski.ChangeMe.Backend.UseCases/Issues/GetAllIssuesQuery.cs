namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record GetAllIssuesQuery(
  int Page = 1,
  int PageSize = 10
) : IQuery<List<IssueDto>>;

public class GetAllIssuesHandler(ApplicationDbContext context) : IQueryHandler<GetAllIssuesQuery, List<IssueDto>>
{
  public async Task<Result<List<IssueDto>>> Handle(GetAllIssuesQuery query, CancellationToken cancellationToken)
  {
    var issues = await context.Issues
      .AsNoTracking()
      .Skip((query.Page - 1) * query.PageSize)
      .Take(query.PageSize)
      .Select(IssueExtensions.ToIssueDtoExpression())
      .ToListAsync(cancellationToken);

    return Result.Success(issues);
  }
}
