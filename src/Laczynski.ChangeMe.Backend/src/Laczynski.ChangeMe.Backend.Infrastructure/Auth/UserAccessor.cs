using System.Security.Claims;
using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Auth;

public class UserAccessor(IHttpContextAccessor httpContextAccessor) : IUserAccessor
{
  public Guid UserId => Guid.Parse(httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? Guid.Empty.ToString());
}
