namespace Laczynski.ChangeMe.Backend.Core.Interfaces;

/// <summary>
/// Service to get information about the currently logged in user.
/// </summary>
public interface ICurrentUserService
{
  /// <summary>
  /// Gets the identifier of the currently logged in user.
  /// </summary>
  /// <returns>The user ID as a GUID</returns>
  Guid GetCurrentUserId();
}