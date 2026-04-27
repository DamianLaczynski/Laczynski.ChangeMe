namespace Laczynski.ChangeMe.Backend.UseCases.Auth;

public sealed record AuthResponseDto(
  Guid UserId,
  string Email,
  string Token,
  DateTime ExpiresAtUtc);
