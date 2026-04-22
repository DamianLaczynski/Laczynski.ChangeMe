using Serilog;

namespace Biobank.Presentation.Api.Configurations;

public static class SerilogConfig
{
  public static WebApplicationBuilder AddSerilogLogging(this WebApplicationBuilder builder)
  {
    builder.Logging.ClearProviders();

    builder.Host.UseSerilog(
        (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

    return builder;
  }
}
