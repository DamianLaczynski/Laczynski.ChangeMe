using ChangeMe.Backend.UseCases.Notifications;
using ChangeMe.Backend.UseCases.Notifications.Dtos;

namespace ChangeMe.Backend.Web.Notifications;

public class MarkAllNotificationsAsRead(IMediator mediator) : BaseEndpoint<MarkAllNotificationsAsReadCommand, NotificationListDto>(mediator)
{
  protected override void ConfigureEndpoint()
  {
    Put("/notifications/read-all");
    Summary(s =>
    {
      s.Summary = "Mark all notifications as read";
      s.Description = "Marks all notifications for current user as read";
    });
  }
}
