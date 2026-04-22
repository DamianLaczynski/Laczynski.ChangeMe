using System.Text.Json;
using Ardalis.Result;
using Microsoft.AspNetCore.Diagnostics;

namespace Laczynski.ChangeMe.Backend.Web.ApiBase;

public static class ExceptionHandlingExtensions
{
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

              var (statusCode, message) = exception switch
              {
                ArgumentException => (StatusCodes.Status400BadRequest, "Bad Request"),
                global::System.Collections.Generic.KeyNotFoundException => (StatusCodes.Status404NotFound, "Not Found"),
                UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
                _ => (StatusCodes.Status500InternalServerError, "Internal Server Error")
              };

              context.Response.StatusCode = statusCode;

              var response = Ardalis.Result.Result<object>.Error(message);

              await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
          });
    });
  }
}
