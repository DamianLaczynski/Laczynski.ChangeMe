namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class CorsConfig
{
  public const string CorsPolicyName = "LarczynskiArchiCorsPolicy";

  public static IServiceCollection AddCorsConfig(this IServiceCollection services, IConfiguration configuration)
  {
    var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

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
