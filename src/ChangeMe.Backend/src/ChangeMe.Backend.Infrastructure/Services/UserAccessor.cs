using System.Security.Claims;
using ChangeMe.Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace ChangeMe.Backend.Infrastructure.Auth;

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
