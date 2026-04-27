using Ardalis.Result;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Users;

namespace Laczynski.ChangeMe.Backend.UnitTests;

public sealed class UserTests
{
  [Theory]
  [InlineData("")]
  [InlineData(" ")]
  [InlineData("invalid-email")]
  public void Create_WhenEmailIsInvalid_ShouldReturnInvalidResult(string email)
  {
    var result = User.Create(email, "hashed-password");

    Assert.False(result.IsSuccess);
    Assert.Equal(ResultStatus.Invalid, result.Status);
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
