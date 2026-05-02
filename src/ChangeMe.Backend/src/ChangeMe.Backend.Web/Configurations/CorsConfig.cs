namespace ChangeMe.Backend.Web.Configurations;

public static class CorsConfig
{
  public const string CorsPolicyName = "CorsPolicy";

  public static IServiceCollection AddCors(this IServiceCollection services, WebApplicationBuilder builder)
  {
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

    services.AddCors(options =>
    {
      options.AddPolicy(name: CorsPolicyName,
              policy =>
              {
                policy.WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
              });
    });

    return services;
  }
}
