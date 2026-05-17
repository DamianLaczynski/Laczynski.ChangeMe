using ChangeMe.Backend.Domain.Aggregates.Users;
using ChangeMe.Backend.UseCases.Auth.Dtos;

namespace ChangeMe.Backend.UseCases.Auth;

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
    var userExists = await context.Users.AnyAsync(x => x.NormalizedEmail == normalizedEmail, cancellationToken);
    if (userExists)
      return Result<AuthResponseDto>.Conflict("User with this email already exists.");

    var passwordHash = passwordHasher.HashPassword(command.Password);
    var createUserResult = User.Create(command.FirstName, command.LastName, command.Email, passwordHash);
    if (!createUserResult.IsSuccess)
      return createUserResult.Map();

    await context.Users.AddAsync(createUserResult.Value, cancellationToken);
    await context.SaveChangesAsync(cancellationToken);

    var accessToken = jwtTokenGenerator.GenerateToken(createUserResult.Value);
    return Result<AuthResponseDto>.Created(
      new AuthResponseDto(
        createUserResult.Value.Id,
        createUserResult.Value.FirstName,
        createUserResult.Value.LastName,
        createUserResult.Value.Email,
        accessToken.Token,
        accessToken.ExpiresAtUtc),
      $"/users/{createUserResult.Value.Id}");
  }
}
