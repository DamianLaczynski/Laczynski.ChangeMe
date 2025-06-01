using Ardalis.Result;
using MediatR;

namespace Laczynski.ChangeMe.Backend.Shared.UseCases;

/// <summary>
/// Source: https://code-maze.com/cqrs-mediatr-fluentvalidation/
/// </summary>
/// <typeparam name="TResponse"></typeparam>
public interface IQuery<TResponse> : IRequest<Result<TResponse>>
{
}
