
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record CreateIssueCommand(
    string Title,
    string Description,
    IssuePriority Priority,
    List<CreateIssueAcceptanceCriterionPayload>? AcceptanceCriteria = null
    ) : ICommand<IssueDetailsDto>;

public record CreateIssueAcceptanceCriterionPayload(
  string Content
);

public class CreateIssueHandler(IMediator mediator, ApplicationDbContext context, IEmailService emailService) : ICommandHandler<CreateIssueCommand, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(CreateIssueCommand command, CancellationToken cancellationToken)
  {
    var result = Issue.Create(command.Title, command.Description, command.Priority);
    if (!result.IsSuccess)
      return result.Map();

    foreach (var acceptanceCriterion in command.AcceptanceCriteria ?? [])
    {
      var acceptanceCriterionResult = result.Value.AddAcceptanceCriterion(acceptanceCriterion.Content);
      if (!acceptanceCriterionResult.IsSuccess)
        return acceptanceCriterionResult.Map();

      await context.AddAsync(acceptanceCriterionResult.Value, cancellationToken);
    }

    await context.Issues.AddAsync(result.Value, cancellationToken);
    await context.SaveChangesAsync(cancellationToken);

    await emailService.SendEmailAsync("test@test.com", "Issue created", $"Issue {result.Value.Title} has been created");

    var issueResult = await mediator.Send(new GetIssueByIdQuery(result.Value.Id), cancellationToken);
    if (!issueResult.IsSuccess)
      return issueResult.Map();

    return Result.Created(issueResult.Value, $"/issues/{issueResult.Value.Id}");
  }

}
