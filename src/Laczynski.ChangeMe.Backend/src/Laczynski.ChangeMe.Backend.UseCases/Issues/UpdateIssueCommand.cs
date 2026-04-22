using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record UpdateIssueCommand(
    Guid Id,
    string Title,
    string? Description,
    IssuePriority Priority) : ICommand<IssueDto>;

public class UpdateIssueHandler(ApplicationDbContext context) : ICommandHandler<UpdateIssueCommand, IssueDto>
{
  public async Task<Result<IssueDto>> Handle(UpdateIssueCommand command, CancellationToken cancellationToken)
  {
    var issue = await context.Issues.FirstOrDefaultAsync(i => i.Id == command.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    return await Result.Success(issue)
    .Bind(issue => issue.UpdateDetails(command.Title, command.Description, command.Priority))
    .MapAsync(async issue =>
    {
      await context.SaveChangesAsync(cancellationToken);
      return issue.ToDto();
    });
  }
}
