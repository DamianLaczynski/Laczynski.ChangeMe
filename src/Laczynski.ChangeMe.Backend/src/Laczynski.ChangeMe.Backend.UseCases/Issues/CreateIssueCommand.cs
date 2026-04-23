
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record CreateIssueCommand(
    string Title,
    string Description,
    IssuePriority Priority,
    List<CreateIssueCommentPayload> Comments
    ) : ICommand<IssueDetailsDto>;

public record CreateIssueCommentPayload(
  string Content
);

public class CreateIssueHandler(IMediator mediator, ApplicationDbContext context, IEmailService emailService) : ICommandHandler<CreateIssueCommand, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(CreateIssueCommand command, CancellationToken cancellationToken)
  {
    var result = Issue.Create(command.Title, command.Description, command.Priority);
    if (!result.IsSuccess)
      return result.Map();

    foreach (var comment in command.Comments)
    {
      var commentResult = result.Value.AddComment(comment.Content);
      if (!commentResult.IsSuccess)
        return commentResult.Map();

      await context.AddAsync(commentResult.Value, cancellationToken);
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
