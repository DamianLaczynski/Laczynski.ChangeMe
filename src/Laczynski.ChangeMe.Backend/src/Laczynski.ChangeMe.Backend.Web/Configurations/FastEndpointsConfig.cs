namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class FastEndpointsConfig
{
    public static IServiceCollection AddFastEndpointsWithSwagger(this IServiceCollection services)
    {
        services.AddFastEndpoints()
                .SwaggerDocument(o =>
                {
                    o.ShortSchemaNames = true;
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
