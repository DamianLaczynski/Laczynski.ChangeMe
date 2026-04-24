using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Enums;

namespace Laczynski.ChangeMe.Backend.UseCases.Issues;

public record UpdateIssueCommand(
    Guid Id,
    string Title,
    string? Description,
    IssuePriority Priority,
    List<UpdateIssueCommentPayload>? Comments = null) : ICommand<IssueDetailsDto>;

public record UpdateIssueCommentPayload(
    Guid? Id,
    string Content);

public class UpdateIssueHandler(IMediator mediator, ApplicationDbContext context) : ICommandHandler<UpdateIssueCommand, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(UpdateIssueCommand command, CancellationToken cancellationToken)
  {
    var issue = await context.Issues
      .Include(i => i.Comments)
      .FirstOrDefaultAsync(i => i.Id == command.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    var result = issue.UpdateDetails(command.Title, command.Description, command.Priority);
    if (!result.IsSuccess)
      return result.Map();


    var commentsResult = UpdateComments(command.Comments, issue);
    if (!commentsResult.IsSuccess)
      return commentsResult.Map();

    await context.SaveChangesAsync(cancellationToken);

    var issueResult = await mediator.Send(new GetIssueByIdQuery(result.Value.Id), cancellationToken);
    if (!issueResult.IsSuccess)
      return issueResult.Map();

    return Result.Success(issueResult.Value);
  }

  private Result UpdateComments(List<UpdateIssueCommentPayload>? comments, Issue issue)
  {
    if (comments is null)
      return Result.Success();

    var retainedCommentIds = new HashSet<Guid>();

    foreach (var comment in comments)
    {
      if (comment.Id.HasValue)
      {
        var updateCommentResult = issue.UpdateComment(comment.Id.Value, comment.Content);
        if (!updateCommentResult.IsSuccess)
          return updateCommentResult.Map();

        retainedCommentIds.Add(comment.Id.Value);
      }
      else
      {
        var addCommentResult = issue.AddComment(comment.Content);
        if (!addCommentResult.IsSuccess)
          return addCommentResult.Map();

        context.Add(addCommentResult.Value);
        retainedCommentIds.Add(addCommentResult.Value.Id);
      }
    }

    var commentsToRemove = issue.Comments
      .Where(comment => !retainedCommentIds.Contains(comment.Id))
      .ToList();

    foreach (var comment in commentsToRemove)
    {
      var removeCommentResult = issue.RemoveComment(comment.Id);
      if (!removeCommentResult.IsSuccess)
        return removeCommentResult.Map();

      context.Remove(removeCommentResult.Value);
    }

    return Result.Success();
  }
}
