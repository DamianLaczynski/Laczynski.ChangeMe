using FastEndpoints;

namespace Laczynski.ChangeMe.Backend.Shared.Pagination;

/// <summary>
/// Base class for requests supporting pagination in the API.
/// </summary>
/// <typeparam name="TResult">Type of the result items</typeparam>
public abstract class PaginationRequest<TResult>
{
  /// <summary>
  /// Pagination parameters.
  /// </summary>
  [FromQuery]
  public PaginationParameters<TResult> PaginationParameters { get; set; } = new PaginationParameters<TResult>();
}
