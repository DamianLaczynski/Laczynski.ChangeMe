using Ardalis.Result;

namespace Laczynski.ChangeMe.Backend.UseCases.Common;

/// <summary>
/// Source: https://code-maze.com/cqrs-mediatr-fluentvalidation/
/// </summary>
/// <typeparam name="TRequest"></typeparam>
/// <typeparam name="TResponse"></typeparam>
public interface IBaseRequestHandler<in TRequest, TResponse> : MediatR.IRequestHandler<TRequest, Result<TResponse>>
        where TRequest : IBaseRequest<TResponse>
{
}
