using Ardalis.Result;
using FastEndpoints;
using Microsoft.AspNetCore.Http;

namespace Laczynski.ChangeMe.Backend.Shared.Web;

/// <summary>
/// Base class for all API endpoints, providing common functionality
/// </summary>
/// <typeparam name="TRequest">Type of request</typeparam>
/// <typeparam name="TResponse">Type of response</typeparam>
public abstract class BaseEndpoint<TRequest, TResponse> : Endpoint<TRequest, Result<TResponse>>
    where TRequest : notnull
{
  /// <summary>
  /// Configure the endpoint to disable automatic validation failure responses
  /// so we can transform them to Ardalis.Result format
  /// </summary>
  public override void Configure()
  {
    // Disable automatic validation failure response so we can handle it manually
    DontThrowIfValidationFails();

    // Call derived class configuration
    ConfigureEndpoint();
  }

  /// <summary>
  /// Override this method in derived classes to configure the endpoint
  /// </summary>
  protected abstract void ConfigureEndpoint();

  /// <summary>
  /// Handles validation and transforms FastEndpoints validation failures to Ardalis.Result
  /// </summary>
  public override async Task HandleAsync(TRequest req, CancellationToken ct)
  {
    Result<TResponse> response = ValidationFailed switch
    {
      true => Result<TResponse>.Invalid(ValidationFailures.Select(f => new ValidationError
      {
        Identifier = f.PropertyName,
        ErrorMessage = f.ErrorMessage,
        Severity = ValidationSeverity.Error
      }).ToArray()),
      false => await HandleEndpointAsync(req, ct)
    };

    var statusCode = response.Status switch
    {
      ResultStatus.Ok => StatusCodes.Status200OK,
      ResultStatus.Created => StatusCodes.Status201Created,
      ResultStatus.Error => StatusCodes.Status500InternalServerError,
      ResultStatus.Forbidden => StatusCodes.Status403Forbidden,
      ResultStatus.Unauthorized => StatusCodes.Status401Unauthorized,
      ResultStatus.Invalid => StatusCodes.Status400BadRequest,
      ResultStatus.NotFound => StatusCodes.Status404NotFound,
      ResultStatus.NoContent => StatusCodes.Status204NoContent,
      ResultStatus.Conflict => StatusCodes.Status409Conflict,
      ResultStatus.CriticalError => StatusCodes.Status500InternalServerError,
      ResultStatus.Unavailable => StatusCodes.Status503ServiceUnavailable,
      _ => StatusCodes.Status500InternalServerError
    };

    await SendAsync(response, statusCode, ct);
    return;
  }

  /// <summary>
  /// Override this method in derived classes to implement endpoint business logic
  /// </summary>
  protected abstract Task<Result<TResponse>> HandleEndpointAsync(TRequest req, CancellationToken ct);
}
