namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record GetIssueByIdQuery(
    Guid Id) : IQuery<IssueDto>;

public class GetIssueByIdHandler(ApplicationDbContext context) : IQueryHandler<GetIssueByIdQuery, IssueDto>
{
  public async Task<Result<IssueDto>> Handle(GetIssueByIdQuery query, CancellationToken cancellationToken)
  {
    var issue = await context.Issues.AsNoTracking()
      .FirstOrDefaultAsync(c => c.Id == query.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    return Result.Success(issue.ToDto());
  }
}
