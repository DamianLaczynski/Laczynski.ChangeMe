using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record UpdateIssueCommand(
    Guid Id,
    string Title,
    string? Description,
    IssuePriority Priority,
    List<UpdateIssueAcceptanceCriterionPayload>? AcceptanceCriteria = null) : ICommand<IssueDetailsDto>;

public record UpdateIssueAcceptanceCriterionPayload(
    Guid? Id,
    string Content);

public class UpdateIssueHandler(IMediator mediator, ApplicationDbContext context) : ICommandHandler<UpdateIssueCommand, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(UpdateIssueCommand command, CancellationToken cancellationToken)
  {
    var issue = await context.Issues
      .Include(i => i.AcceptanceCriteria)
      .FirstOrDefaultAsync(i => i.Id == command.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    var result = issue.UpdateDetails(command.Title, command.Description, command.Priority);
    if (!result.IsSuccess)
      return result.Map();


    var acceptanceCriteriaResult = UpdateAcceptanceCriteria(command.AcceptanceCriteria, issue);
    if (!acceptanceCriteriaResult.IsSuccess)
      return acceptanceCriteriaResult.Map();

    await context.SaveChangesAsync(cancellationToken);

    var issueResult = await mediator.Send(new GetIssueByIdQuery(result.Value.Id), cancellationToken);
    if (!issueResult.IsSuccess)
      return issueResult.Map();

    return Result.Success(issueResult.Value);
  }

  private Result UpdateAcceptanceCriteria(List<UpdateIssueAcceptanceCriterionPayload>? acceptanceCriteria, Issue issue)
  {
    if (acceptanceCriteria is null)
      return Result.Success();

    var retainedAcceptanceCriteriaIds = new HashSet<Guid>();

    foreach (var acceptanceCriterion in acceptanceCriteria)
    {
      if (acceptanceCriterion.Id.HasValue)
      {
        var updateAcceptanceCriterionResult = issue.UpdateAcceptanceCriterion(acceptanceCriterion.Id.Value, acceptanceCriterion.Content);
        if (!updateAcceptanceCriterionResult.IsSuccess)
          return updateAcceptanceCriterionResult.Map();

        retainedAcceptanceCriteriaIds.Add(acceptanceCriterion.Id.Value);
      }
      else
      {
        var addAcceptanceCriterionResult = issue.AddAcceptanceCriterion(acceptanceCriterion.Content);
        if (!addAcceptanceCriterionResult.IsSuccess)
          return addAcceptanceCriterionResult.Map();

        context.Add(addAcceptanceCriterionResult.Value);
        retainedAcceptanceCriteriaIds.Add(addAcceptanceCriterionResult.Value.Id);
      }
    }

    var acceptanceCriteriaToRemove = issue.AcceptanceCriteria
      .Where(criterion => !retainedAcceptanceCriteriaIds.Contains(criterion.Id))
      .ToList();

    foreach (var acceptanceCriterion in acceptanceCriteriaToRemove)
    {
      var removeAcceptanceCriterionResult = issue.RemoveAcceptanceCriterion(acceptanceCriterion.Id);
      if (!removeAcceptanceCriterionResult.IsSuccess)
        return removeAcceptanceCriterionResult.Map();

      context.Remove(removeAcceptanceCriterionResult.Value);
    }

    return Result.Success();
  }
}
