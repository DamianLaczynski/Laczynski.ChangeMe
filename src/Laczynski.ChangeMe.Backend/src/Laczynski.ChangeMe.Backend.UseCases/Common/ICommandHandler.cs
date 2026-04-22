namespace Laczynski.ChangeMe.Backend.UseCases.Common;

/// <summary>
/// Source: https://code-maze.com/cqrs-mediatr-fluentvalidation/
/// </summary>
/// <typeparam name="TCommand"></typeparam>
/// <typeparam name="TResponse"></typeparam>
public interface ICommandHandler<in TCommand, TResponse> : IBaseRequestHandler<TCommand, TResponse>
        where TCommand : ICommand<TResponse>
{
}
