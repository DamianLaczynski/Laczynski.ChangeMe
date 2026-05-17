using Ardalis.Result;
using ChangeMe.Backend.Domain.Aggregates.Users;

namespace ChangeMe.Backend.UnitTests;

public sealed class UserTests
{
  [Fact]
  public void Create_WhenInputIsValid_ShouldTrimValuesAndSetNormalizedEmail()
  {
    var result = User.Create("  John  ", "  Doe  ", " Test@Example.com ", "  hashed-password  ");

    Assert.True(result.IsSuccess);
    Assert.Equal("John", result.Value.FirstName);
    Assert.Equal("Doe", result.Value.LastName);
    Assert.Equal("Test@Example.com", result.Value.Email);
    Assert.Equal("TEST@EXAMPLE.COM", result.Value.NormalizedEmail);
    Assert.Equal("hashed-password", result.Value.PasswordHash);
  }

  [Theory]
  [InlineData("")]
  [InlineData(" ")]
  [InlineData("invalid-email")]
  public void Create_WhenEmailIsInvalid_ShouldReturnInvalidResult(string email)
  {
    var result = User.Create("John", "Doe", email, "hashed-password");

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
  }

  [Fact]
  public void Create_WhenNamesAreMissing_ShouldReturnInvalidResult()
  {
    var result = User.Create("", " ", "john@example.com", "hashed-password");

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
  }

  [Fact]
  public void Create_WhenPasswordHashIsMissing_ShouldReturnInvalidResult()
  {
    var result = User.Create("John", "Doe", "john@example.com", " ");

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
    Assert.Contains(result.ValidationErrors, error => error.Identifier == nameof(User.PasswordHash));
  }

  [Fact]
  public void Create_WhenFieldsExceedMaxLength_ShouldReturnInvalidResult()
  {
    var result = User.Create(
      new string('J', UserConstraints.NAME_MAX_LENGTH + 1),
      new string('D', UserConstraints.NAME_MAX_LENGTH + 1),
      $"{new string('a', UserConstraints.EMAIL_MAX_LENGTH - "@x.pl".Length + 1)}@x.pl",
      "hashed-password");

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
    Assert.Contains(result.ValidationErrors, error => error.Identifier == nameof(User.FirstName));
    Assert.Contains(result.ValidationErrors, error => error.Identifier == nameof(User.LastName));
    Assert.Contains(result.ValidationErrors, error => error.Identifier == nameof(User.Email));
  }

  [Theory]
  [InlineData(" Test@Example.com ", "TEST@EXAMPLE.COM")]
  [InlineData("user@example.com", "USER@EXAMPLE.COM")]
  public void NormalizeEmail_WhenCalled_ShouldTrimAndUppercaseValue(string email, string expected)
  {
    var result = User.NormalizeEmail(email);

    Assert.Equal(expected, result);
  }
}
