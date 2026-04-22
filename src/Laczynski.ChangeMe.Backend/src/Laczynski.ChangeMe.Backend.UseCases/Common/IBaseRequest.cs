using Ardalis.Result;
using MediatR;

namespace Laczynski.ChangeMe.Backend.UseCases.Common;

/// <summary>
/// Source: https://code-maze.com/cqrs-mediatr-fluentvalidation/
/// </summary>
/// <typeparam name="TResponse"></typeparam>
public interface IBaseRequest<TResponse> : IRequest<Result<TResponse>>;
