namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class CorsConfig
{
  public const string CorsPolicyName = "CorsPolicy";

  public static IServiceCollection AddCorsConfig(this IServiceCollection services, WebApplicationBuilder builder)
  {
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

    services.AddCors(options =>
    {
      options.AddPolicy(name: CorsPolicyName,
              policy =>
              {
                if (builder.Environment.IsDevelopment())
                {
                  policy.SetIsOriginAllowed(_ => false)
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                }
                else
                {
                  policy.WithOrigins(allowedOrigins)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                }
              });
    });

    return services;
  }
}

