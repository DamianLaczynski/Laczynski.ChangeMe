using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue.Entities;
using Laczynski.ChangeMe.Backend.UseCases.Issues;

namespace Laczynski.ChangeMe.Backend.Web.Issues;

public class UpdateIssue(IMediator _mediator) : BaseEndpoint<UpdateIssueCommand, IssueDetailsDto>(_mediator)
{
  protected override void ConfigureEndpoint()
  {
    Put("/issues/{id}");
    Summary(s =>
    {
      s.Summary = "Update issue";
      s.Description = "Update a issue by ID";
    });
  }
}

public sealed class UpdateIssueCommandValidator : Validator<UpdateIssueCommand>
{
  public UpdateIssueCommandValidator()
  {
    RuleFor(x => x.Id)
      .NotEmpty();

    RuleFor(x => x.Title)
      .NotEmpty()
      .MinimumLength(IssueConstraints.TITLE_MIN_LENGTH)
      .MaximumLength(IssueConstraints.TITLE_MAX_LENGTH);

    RuleFor(x => x.Description)
      .MaximumLength(IssueConstraints.DESCRIPTION_MAX_LENGTH);

    RuleFor(x => x.Priority)
      .IsInEnum();

    RuleForEach(x => x.Comments)
      .ChildRules(comment =>
      {
        comment.RuleFor(x => x.Content)
          .NotEmpty()
          .MaximumLength(IssueCommentConstraints.CONTENT_MAX_LENGTH);
      });
  }
}
