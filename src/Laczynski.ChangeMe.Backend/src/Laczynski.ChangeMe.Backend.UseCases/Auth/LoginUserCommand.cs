using Laczynski.ChangeMe.Backend.Domain.Aggregates.Users;

namespace Laczynski.ChangeMe.Backend.UseCases.Auth;

public sealed record LoginUserCommand(
  string Email,
  string Password) : ICommand<AuthResponseDto>;

public class LoginUserHandler(
  ApplicationDbContext context,
  IPasswordHasher passwordHasher,
  IJwtTokenGenerator jwtTokenGenerator) : ICommandHandler<LoginUserCommand, AuthResponseDto>
{
  public async Task<Result<AuthResponseDto>> Handle(LoginUserCommand command, CancellationToken cancellationToken)
  {
    var normalizedEmail = User.NormalizeEmail(command.Email);
    var user = await context.Users.FirstOrDefaultAsync(x => x.NormalizedEmail == normalizedEmail, cancellationToken);
    if (user is null)
      return Result<AuthResponseDto>.Unauthorized();

    var passwordValid = passwordHasher.VerifyPassword(user.PasswordHash, command.Password);
    if (!passwordValid)
      return Result<AuthResponseDto>.Unauthorized();

    var accessToken = jwtTokenGenerator.GenerateToken(user);
    return Result<AuthResponseDto>.Success(new AuthResponseDto(
      user.Id,
      user.FirstName,
      user.LastName,
      user.Email,
      accessToken.Token,
      accessToken.ExpiresAtUtc));
  }
}
