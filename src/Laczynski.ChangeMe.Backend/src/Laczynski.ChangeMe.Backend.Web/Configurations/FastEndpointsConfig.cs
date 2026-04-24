using Microsoft.AspNetCore.Authentication.JwtBearer;
using NSwag;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class FastEndpointsConfig
{
    public static IServiceCollection AddFastEndpointsWithSwagger(this IServiceCollection services)
    {
        services.AddFastEndpoints()
                .SwaggerDocument(o =>
                {
                    o.ShortSchemaNames = true;
                    o.EnableJWTBearerAuth = false;
                    o.DocumentSettings = settings =>
                    {
                        settings.AddAuth("Bearer", new OpenApiSecurityScheme
                        {
                            Type = OpenApiSecuritySchemeType.Http,
                            Scheme = JwtBearerDefaults.AuthenticationScheme,
                            BearerFormat = "JWT",
                        });
                    };
                });
        return services;
    }

    public static WebApplication UseFastEndpointsWithSwagger(this WebApplication app)
    {
        app.UseFastEndpoints(config =>
        {
            config.Endpoints.RoutePrefix = "api";
        }).UseSwaggerGen();
        return app;
    }
}
