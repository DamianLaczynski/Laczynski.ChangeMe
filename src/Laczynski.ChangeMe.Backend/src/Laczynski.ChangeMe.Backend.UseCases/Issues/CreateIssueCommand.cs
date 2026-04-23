
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record CreateIssueCommand(
    string Title,
    string Description,
    IssuePriority Priority
    ) : ICommand<IssueDetailsDto>;

public class CreateIssueHandler(IMediator mediator, ApplicationDbContext context, IEmailService emailService) : ICommandHandler<CreateIssueCommand, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(CreateIssueCommand command, CancellationToken cancellationToken)
  {
    var result = Issue.Create(command.Title, command.Description, command.Priority);
    if (!result.IsSuccess)
      return result.Map();

    await context.Issues.AddAsync(result.Value, cancellationToken);
    await context.SaveChangesAsync(cancellationToken);

    await emailService.SendEmailAsync("test@test.com", "Issue created", $"Issue {result.Value.Title} has been created");

    var issueResult = await mediator.Send(new GetIssueByIdQuery(result.Value.Id), cancellationToken);
    if (!issueResult.IsSuccess)
      return issueResult.Map();

    return Result.Created(issueResult.Value, $"/issues/{issueResult.Value.Id}");
  }

}
