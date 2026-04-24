using Laczynski.ChangeMe.Backend.Domain.Aggregates.Users;
using Laczynski.ChangeMe.Backend.UseCases.Auth;

namespace Laczynski.ChangeMe.Backend.Web.Auth;

public class Register(IMediator mediator) : BaseEndpoint<RegisterUserCommand, AuthResponseDto>(mediator)
{
  protected override void ConfigureEndpoint()
  {
    Post("/auth/register");
    AllowAnonymous();
    Summary(s =>
    {
      s.Summary = "Register user";
      s.Description = "Create a new user account and return JWT token.";
    });
  }
}

public sealed class RegisterUserCommandValidator : Validator<RegisterUserCommand>
{
  public RegisterUserCommandValidator()
  {
    RuleFor(x => x.Email)
      .NotEmpty()
      .EmailAddress()
      .MaximumLength(UserConstraints.EMAIL_MAX_LENGTH);

    RuleFor(x => x.Password)
      .NotEmpty()
      .MinimumLength(UserConstraints.PASSWORD_MIN_LENGTH)
      .MaximumLength(UserConstraints.PASSWORD_MAX_LENGTH);
  }
}
