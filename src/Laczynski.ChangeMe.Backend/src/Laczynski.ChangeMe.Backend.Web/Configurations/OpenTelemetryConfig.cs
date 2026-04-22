using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class OpenTelemetryConfig
{
    public static WebApplicationBuilder AddOpenTelemetryConfig(this WebApplicationBuilder builder)
    {
        if (!builder.Configuration.GetValue("OpenTelemetry:Enabled", true))
            return builder;

        var serviceName = builder.Configuration["OpenTelemetry:ServiceName"] ?? "laczynski-changeme";
        var version = typeof(OpenTelemetryConfig).Assembly.GetName().Version?.ToString();

        builder.Services.AddOpenTelemetry()
            .ConfigureResource(r => r.AddService(serviceName, serviceVersion: version))
            .WithTracing(t =>
                global::Npgsql.TracerProviderBuilderExtensions.AddNpgsql(
                        t.AddAspNetCoreInstrumentation()
                            .AddHttpClientInstrumentation())
                    .AddOtlpExporter())
            .WithMetrics(m =>
                global::Npgsql.MeterProviderBuilderExtensions.AddNpgsqlInstrumentation(
                        m.AddAspNetCoreInstrumentation()
                            .AddRuntimeInstrumentation())
                    .AddOtlpExporter());

        return builder;
    }
}
