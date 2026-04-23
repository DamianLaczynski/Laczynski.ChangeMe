
namespace Laczynski.ChangeMe.Backend.UseCases.Common;

public interface IBaseRequest<TResponse> : IRequest<Result<TResponse>>;
