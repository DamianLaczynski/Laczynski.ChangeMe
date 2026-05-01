namespace Laczynski.ChangeMe.Backend.UseCases.Auth.Dtos;

public sealed record AuthResponseDto(
  Guid UserId,
  string FirstName,
  string LastName,
  string Email,
  string Token,
  DateTime ExpiresAtUtc);
