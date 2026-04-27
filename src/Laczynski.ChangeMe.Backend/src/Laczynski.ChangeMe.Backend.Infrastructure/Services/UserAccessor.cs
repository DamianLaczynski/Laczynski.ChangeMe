using System.Security.Claims;
using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Auth;

public class UserAccessor(IHttpContextAccessor httpContextAccessor) : IUserAccessor
{
  public Guid? UserId
  {
    get
    {
      var userId = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      return Guid.TryParse(userId, out var parsedUserId) ? parsedUserId : null;
    }
  }
}
