using System.Net.Mail;

namespace Laczynski.ChangeMe.Backend.Domain.Aggregates.Users;

public class User : Entity, IAggregateRoot
{
  private User() { }

  public string Email { get; private set; } = string.Empty;
  public string NormalizedEmail { get; private set; } = string.Empty;
  public string PasswordHash { get; private set; } = string.Empty;

  public static Result<User> Create(string email, string passwordHash)
  {
    var validationErrors = Validate(email, passwordHash);
    if (validationErrors.Count > 0)
      return Result.Invalid(validationErrors);

    var normalizedEmail = NormalizeEmail(email);
    var user = new User
    {
      Email = email.Trim(),
      NormalizedEmail = normalizedEmail,
      PasswordHash = passwordHash.Trim()
    };

    user.CreatedBy = user.Id;
    user.UpdatedBy = user.Id;

    return Result.Success(user);
  }

  public static string NormalizeEmail(string email) => email.Trim().ToUpperInvariant();

  private static List<ValidationError> Validate(string email, string passwordHash)
  {
    var validationErrors = new List<ValidationError>();

    if (string.IsNullOrWhiteSpace(email))
    {
      validationErrors.Add(new ValidationError(nameof(Email), "cannot be null or empty"));
    }
    else
    {
      if (email.Trim().Length > UserConstraints.EMAIL_MAX_LENGTH)
        validationErrors.Add(new ValidationError(nameof(Email), $"cannot be longer than {UserConstraints.EMAIL_MAX_LENGTH} characters"));

      try
      {
        _ = new MailAddress(email.Trim());
      }
      catch (FormatException)
      {
        validationErrors.Add(new ValidationError(nameof(Email), "has invalid format"));
      }
    }

    if (string.IsNullOrWhiteSpace(passwordHash))
      validationErrors.Add(new ValidationError(nameof(PasswordHash), "cannot be null or empty"));

    return validationErrors;
  }
}

public static class UserConstraints
{
  public const int EMAIL_MAX_LENGTH = 320;
  public const int PASSWORD_MIN_LENGTH = 8;
  public const int PASSWORD_MAX_LENGTH = 128;
}

public sealed record AccessTokenResult(string Token, DateTime ExpiresAtUtc);
