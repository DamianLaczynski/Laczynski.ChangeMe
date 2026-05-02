namespace ChangeMe.Backend.Web.Configurations;

public static class SerilogConfig
{
  public static WebApplicationBuilder AddSerilog(this WebApplicationBuilder builder)
  {
    builder.Logging.ClearProviders();

    builder.Host.UseSerilog(
        (context, configuration) => configuration.ReadFrom.Configuration(context.Configuration));

    return builder;
  }
}
