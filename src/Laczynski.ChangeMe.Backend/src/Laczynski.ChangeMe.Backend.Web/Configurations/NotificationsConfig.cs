using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.UseCases.Issues;
using Laczynski.ChangeMe.Backend.Web.Notifications;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class NotificationsConfig
{
  public static IServiceCollection AddNotifications(this IServiceCollection services, Microsoft.Extensions.Logging.ILogger logger)
  {
    services.AddSignalR();
    services.AddScoped<IssueNotificationService>();
    services.AddSingleton<INotificationRealtimePublisher, SignalRNotificationRealtimePublisher>();

    logger.LogInformation("{Project} services configured", "Notifications");
    return services;
  }

  public static WebApplication UseNotifications(this WebApplication app)
  {
    app.MapHub<NotificationHub>("/hubs/notifications");
    return app;
  }
}
