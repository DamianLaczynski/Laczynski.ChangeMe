using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

namespace Laczynski.ChangeMe.Backend.Web.ApiBase;

/// <summary>
/// Extensions for configuring exception handling
/// </summary>
public static class ExceptionHandlingExtensions
{
  /// <summary>
  /// Configures API exception handling
  /// </summary>
  public static void UseApiExceptionHandler(this WebApplication app)
  {
    app.UseExceptionHandler(appError =>
    {
      appError.Run(async context =>
          {
            context.Response.ContentType = "application/json";

            var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
            if (contextFeature != null)
            {
              var exception = contextFeature.Error;

              var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
              logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

              var statusCode = exception switch
              {
                ArgumentException => StatusCodes.Status400BadRequest,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError
              };

              context.Response.StatusCode = statusCode;

              var response = Result<object>.Error(exception.Message);

              await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
          });
    });
  }
}
