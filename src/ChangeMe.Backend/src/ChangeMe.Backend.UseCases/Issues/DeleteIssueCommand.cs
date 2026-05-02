namespace ChangeMe.Backend.UseCases.Issues;

public record DeleteIssueCommand(
    Guid Id) : ICommand<Guid>;

public class DeleteIssueHandler(ApplicationDbContext context) : ICommandHandler<DeleteIssueCommand, Guid>
{
  public async Task<Result<Guid>> Handle(DeleteIssueCommand command, CancellationToken cancellationToken)
  {
    var issue = await context.Issues
      .FirstOrDefaultAsync(i => i.Id == command.Id, cancellationToken);

    if (issue is null)
      return Result.NotFound();

    context.Issues.Remove(issue);
    await context.SaveChangesAsync(cancellationToken);
    return Result.Success(issue.Id);
  }
}
