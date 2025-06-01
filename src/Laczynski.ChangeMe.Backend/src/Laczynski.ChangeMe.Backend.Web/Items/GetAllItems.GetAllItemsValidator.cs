using FluentValidation;

namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Validator for GetAllItemsRequest
/// </summary>
public class GetAllItemsValidator : Validator<GetAllItemsRequest>
{
  public GetAllItemsValidator()
  {
    RuleFor(x => x.SearchTerm)
      .MaximumLength(100)
      .WithMessage("Search term cannot exceed 100 characters")
      .When(x => !string.IsNullOrEmpty(x.SearchTerm));

    RuleFor(x => x.PaginationParameters.PageNumber)
      .GreaterThan(0)
      .WithMessage("Page number must be greater than 0");

    RuleFor(x => x.PaginationParameters.PageSize)
      .InclusiveBetween(1, 100)
      .WithMessage("Page size must be between 1 and 100");
  }
}