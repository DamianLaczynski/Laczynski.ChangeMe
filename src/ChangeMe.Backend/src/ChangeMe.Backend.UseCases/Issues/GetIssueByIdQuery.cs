using ChangeMe.Backend.UseCases.Issues.Dtos;

namespace ChangeMe.Backend.UseCases.Issues;

public record GetIssueByIdQuery(Guid Id) : IQuery<IssueDetailsDto>;

public class GetIssueByIdHandler(
  ApplicationDbContext context,
  IUserAccessor userAccessor) : IQueryHandler<GetIssueByIdQuery, IssueDetailsDto>
{
  public async Task<Result<IssueDetailsDto>> Handle(GetIssueByIdQuery query, CancellationToken cancellationToken)
  {
    var issue = await context.Issues
      .AsNoTracking()
      .Include(i => i.AcceptanceCriteria)
      .Include(i => i.Comments)
      .Include(i => i.HistoryEntries)
      .Include(i => i.Watchers)
      .FirstOrDefaultAsync(c => c.Id == query.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    var userIds = new HashSet<Guid>
    {
      issue.CreatedBy,
    };

    if (issue.AssignedToUserId.HasValue)
      userIds.Add(issue.AssignedToUserId.Value);

    foreach (var assigneeHistoryEntry in issue.HistoryEntries.Where(h => h.EventType == Domain.Aggregates.Issue.Enums.IssueHistoryEventType.ASSIGNEE_CHANGED))
    {
      if (Guid.TryParse(assigneeHistoryEntry.PreviousValue, out var previousAssigneeId))
        userIds.Add(previousAssigneeId);

      if (Guid.TryParse(assigneeHistoryEntry.CurrentValue, out var currentAssigneeId))
        userIds.Add(currentAssigneeId);
    }

    foreach (var comment in issue.Comments)
      userIds.Add(comment.CreatedBy);

    foreach (var historyEntry in issue.HistoryEntries)
      userIds.Add(historyEntry.ActorUserId);

    var userLookup = await context.Users
      .AsNoTracking()
      .Where(u => userIds.Contains(u.Id))
      .ToDictionaryAsync(u => u.Id, u => $"{u.FirstName} {u.LastName}", cancellationToken);

    return Result.Success(issue.ToDetailsDto(userLookup, userAccessor.UserId));
  }
}
