using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record UpdateIssueCommand(
    Guid Id,
    string Title,
    string? Description,
    IssuePriority Priority) : ICommand<IssueDetailsDto>;

public class UpdateIssueHandler(IMediator mediator, ApplicationDbContext context) : ICommandHandler<UpdateIssueCommand, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(UpdateIssueCommand command, CancellationToken cancellationToken)
  {
    var issue = await context.Issues.FirstOrDefaultAsync(i => i.Id == command.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    var result = issue.UpdateDetails(command.Title, command.Description, command.Priority);
    if (!result.IsSuccess)
      return result.Map();

    await context.SaveChangesAsync(cancellationToken);

    var issueResult = await mediator.Send(new GetIssueByIdQuery(result.Value.Id), cancellationToken);
    if (!issueResult.IsSuccess)
      return issueResult.Map();

    return Result.Success(issueResult.Value);
  }
}
