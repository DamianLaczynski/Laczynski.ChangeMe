using FluentValidation;

namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Validator for DeleteItemRequest
/// </summary>
public class DeleteItemValidator : Validator<DeleteItemRequest>
{
  public DeleteItemValidator()
  {
    RuleFor(x => x.Id)
      .NotEmpty()
      .WithMessage("Id is required");
  }
}
