using FluentValidation;

namespace Laczynski.ChangeMe.Backend.Web.Items;

/// <summary>
/// Validator for UpdateItemRequest
/// </summary>
public class UpdateItemValidator : Validator<UpdateItemRequest>
{
  public UpdateItemValidator()
  {
    RuleFor(x => x.Id)
      .NotEmpty()
      .WithMessage("Id is required");

    RuleFor(x => x.Name)
      .NotEmpty()
      .WithMessage("Name is required")
      .MinimumLength(3)
      .WithMessage("Name must be at least 3 characters long")
      .MaximumLength(100)
      .WithMessage("Name cannot exceed 100 characters");

    RuleFor(x => x.Description)
      .NotEmpty()
      .WithMessage("Description is required")
      .MinimumLength(10)
      .WithMessage("Description must be at least 10 characters long")
      .MaximumLength(500)
      .WithMessage("Description cannot exceed 500 characters");

    RuleFor(x => x.Price)
      .GreaterThan(0)
      .WithMessage("Price must be greater than 0")
      .LessThanOrEqualTo(999999.99m)
      .WithMessage("Price cannot exceed 999,999.99");

    RuleFor(x => x.Image)
      .NotEmpty()
      .WithMessage("Image URL is required")
      .Must(BeValidUrl)
      .WithMessage("Image must be a valid URL");
  }

  private static bool BeValidUrl(string url)
  {
    return Uri.TryCreate(url, UriKind.Absolute, out var result) &&
           (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
  }
}