
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record CreateIssueCommand(
    string Title,
    string Description,
    IssuePriority Priority
    ) : ICommand<IssueDto>;

public class CreateIssueHandler(ApplicationDbContext context) : ICommandHandler<CreateIssueCommand, IssueDto>
{
  public async Task<Result<IssueDto>> Handle(CreateIssueCommand command, CancellationToken cancellationToken)
  {
    return await Result.Success()
    .Bind(_ => Issue.Create(command.Title, command.Description, command.Priority))
    .BindAsync(async issue =>
    {
      await context.Issues.AddAsync(issue, cancellationToken);
      await context.SaveChangesAsync(cancellationToken);
      return Result.Success(issue.ToDto());
    });
  }

}
