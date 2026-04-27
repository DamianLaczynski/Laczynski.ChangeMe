using Laczynski.ChangeMe.Backend.Domain.Aggregates.Users;

namespace Laczynski.ChangeMe.Backend.Domain.Interfaces;

public interface IJwtTokenGenerator
{
  AccessTokenResult GenerateToken(User user);
}
