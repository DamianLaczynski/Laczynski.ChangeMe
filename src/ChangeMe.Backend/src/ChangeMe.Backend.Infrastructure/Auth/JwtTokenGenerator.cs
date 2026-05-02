using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ChangeMe.Backend.Domain.Aggregates.Users;
using ChangeMe.Backend.Domain.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ChangeMe.Backend.Infrastructure.Auth;

public class JwtTokenGenerator(IOptions<JwtOptions> options) : IJwtTokenGenerator
{
  private readonly JwtOptions jwtOptions = options.Value;

  public AccessTokenResult GenerateToken(User user)
  {
    var expiresAtUtc = DateTime.UtcNow.AddMinutes(jwtOptions.ExpirationMinutes);
    var claims = new[]
    {
      new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
      new Claim(JwtRegisteredClaimNames.Email, user.Email),
      new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
      new Claim(ClaimTypes.Email, user.Email)
    };

    var credentials = new SigningCredentials(
      new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
      SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
      issuer: jwtOptions.Issuer,
      audience: jwtOptions.Audience,
      claims: claims,
      expires: expiresAtUtc,
      signingCredentials: credentials);

    return new AccessTokenResult(
      new JwtSecurityTokenHandler().WriteToken(token),
      expiresAtUtc);
  }
}
