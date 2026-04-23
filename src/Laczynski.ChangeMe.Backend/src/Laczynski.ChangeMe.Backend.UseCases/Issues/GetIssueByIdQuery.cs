namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record GetIssueByIdQuery(
    Guid Id) : IQuery<IssueDetailsDto>;

public class GetIssueByIdHandler(ApplicationDbContext context) : IQueryHandler<GetIssueByIdQuery, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(GetIssueByIdQuery query, CancellationToken cancellationToken)
  {
    var issue = await context.Issues.AsNoTracking()
      .Include(i => i.Comments)
      .FirstOrDefaultAsync(c => c.Id == query.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    return Result.Success(issue.ToDetailsDto());
  }
}
