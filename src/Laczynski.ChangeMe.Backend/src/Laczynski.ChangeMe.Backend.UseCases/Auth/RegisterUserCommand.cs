using Laczynski.ChangeMe.Backend.Domain.Aggregates.Users;

namespace Laczynski.ChangeMe.Backend.UseCases.Auth;

public sealed record RegisterUserCommand(
  string FirstName,
  string LastName,
  string Email,
  string Password) : ICommand<AuthResponseDto>;

public class RegisterUserHandler(
  ApplicationDbContext context,
  IPasswordHasher passwordHasher,
  IJwtTokenGenerator jwtTokenGenerator) : ICommandHandler<RegisterUserCommand, AuthResponseDto>
{
  public async Task<Result<AuthResponseDto>> Handle(RegisterUserCommand command, CancellationToken cancellationToken)
  {
    var normalizedEmail = User.NormalizeEmail(command.Email);
    var emailExists = await context.Users.AnyAsync(x => x.NormalizedEmail == normalizedEmail, cancellationToken);
    if (emailExists)
      return Result<AuthResponseDto>.Conflict("User with this email already exists.");

    var passwordHash = passwordHasher.HashPassword(command.Password);
    var userResult = User.Create(command.FirstName, command.LastName, command.Email, passwordHash);
    if (!userResult.IsSuccess)
      return userResult.Map();

    await context.Users.AddAsync(userResult.Value, cancellationToken);
    await context.SaveChangesAsync(cancellationToken);

    var accessToken = jwtTokenGenerator.GenerateToken(userResult.Value);
    return Result<AuthResponseDto>.Created(
      new AuthResponseDto(
        userResult.Value.Id,
        userResult.Value.FirstName,
        userResult.Value.LastName,
        userResult.Value.Email,
        accessToken.Token,
        accessToken.ExpiresAtUtc),
      $"/auth/users/{userResult.Value.Id}");
  }
}
