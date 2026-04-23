using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.UseCases.Issues;

namespace Laczynski.ChangeMe.Backend.Web.Issues;

public class CreateIssue(IMediator _mediator) : BaseEndpoint<CreateIssueCommand, IssueDetailsDto>(_mediator)
{
  protected override void ConfigureEndpoint()
  {
    Post("/issues");
    Summary(s =>
    {
      s.Summary = "Create issue";
      s.Description = "Create a new issue with title";
    });
  }
}

public sealed class CreateIssueCommandValidator : Validator<CreateIssueCommand>
{
  public CreateIssueCommandValidator()
  {
    RuleFor(x => x.Title)
      .NotEmpty()
      .MinimumLength(IssueConstraints.TITLE_MIN_LENGTH)
      .MaximumLength(IssueConstraints.TITLE_MAX_LENGTH);

    RuleFor(x => x.Description)
      .MaximumLength(IssueConstraints.DESCRIPTION_MAX_LENGTH);

    RuleFor(x => x.Priority)
      .IsInEnum();
  }
}
