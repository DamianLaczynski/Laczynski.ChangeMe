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
    // Check if there are validation failures from FastEndpoints
    if (ValidationFailed)
    {
      var validationErrors = ValidationFailures.Select(f => new ValidationError
      {
        Identifier = f.PropertyName,
        ErrorMessage = f.ErrorMessage,
        Severity = ValidationSeverity.Error
      }).ToArray();

      var result = Result<TResponse>.Invalid(validationErrors);

      await SendAsync(result, StatusCodes.Status400BadRequest, ct);

    }

    // If validation passed, proceed with the endpoint logic
    Response = await HandleEndpointAsync(req, ct);
  }

  /// <summary>
  /// Override this method in derived classes to implement endpoint business logic
  /// </summary>
  protected abstract Task<Result<TResponse>> HandleEndpointAsync(TRequest req, CancellationToken ct);
}
