using Hangfire;
using Laczynski.ChangeMe.Backend.Infrastructure.Configurations;
using Microsoft.Extensions.Options;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class HangfireConfig
{
  public static WebApplication UseHangfireDashboard(this WebApplication app)
  {
    var options = app.Services.GetRequiredService<IOptions<HangfireOptions>>().Value;
    app.UseHangfireDashboard(options.DashboardPath);
    return app;
  }
}
