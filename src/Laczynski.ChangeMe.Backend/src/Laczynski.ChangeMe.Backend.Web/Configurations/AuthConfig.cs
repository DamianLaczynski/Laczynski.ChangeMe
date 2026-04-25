using System.Text;
using Laczynski.ChangeMe.Backend.Infrastructure.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class AuthConfig
{
  public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, WebApplicationBuilder builder)
  {
    services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

    var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
    var signingKey = Encoding.UTF8.GetBytes(jwtOptions.SigningKey);

    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(options =>
      {
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuer = true,
          ValidateAudience = true,
          ValidateIssuerSigningKey = true,
          ValidateLifetime = true,
          ValidIssuer = jwtOptions.Issuer,
          ValidAudience = jwtOptions.Audience,
          IssuerSigningKey = new SymmetricSecurityKey(signingKey),
          ClockSkew = TimeSpan.Zero
        };
      });

    services.AddAuthorization();

    return services;
  }
}
