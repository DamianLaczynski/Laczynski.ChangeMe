using Laczynski.ChangeMe.Backend.Shared.UseCases;

namespace Laczynski.ChangeMe.Backend.Shared.Pagination;

/// <summary>
/// Interface for queries supporting pagination, compatible with MediatR.
/// </summary>
/// <typeparam name="TResult">Type of the result items</typeparam>
public abstract class PaginationQuery<TResult> : IQuery<PaginationResult<TResult>>
{
  /// <summary>
  /// Pagination parameters.
  /// </summary>
  public PaginationParameters<TResult> PaginationParameters { get; set; } = new PaginationParameters<TResult>();
}
