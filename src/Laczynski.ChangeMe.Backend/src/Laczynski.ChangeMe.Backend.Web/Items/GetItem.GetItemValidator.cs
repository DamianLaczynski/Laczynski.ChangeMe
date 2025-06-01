using FluentValidation;

namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Validator for GetItemRequest
/// </summary>
public class GetItemValidator : Validator<GetItemRequest>
{
  public GetItemValidator()
  {
    RuleFor(x => x.Id)
      .NotEmpty()
      .WithMessage("Id is required");
  }
}
