using Laczynski.ChangeMe.Backend.UseCases.Issues;

namespace Laczynski.ChangeMe.Backend.Web.Issues;

public class GetAssignableUsers(IMediator mediator)
  : BaseEndpoint<GetAssignableUsersQuery, List<IssueAssignableUserDto>>(mediator)
{
  protected override void ConfigureEndpoint()
  {
    Get("/issues/assignable-users");
    Summary(s =>
    {
      s.Summary = "Get assignable users";
      s.Description = "Gets users that can be assigned to an issue";
    });
  }
}
