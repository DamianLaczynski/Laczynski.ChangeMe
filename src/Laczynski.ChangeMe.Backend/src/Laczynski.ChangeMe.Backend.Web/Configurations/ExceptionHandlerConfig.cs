using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

namespace Laczynski.ChangeMe.Backend.Web.Configurations;

public static class ExceptionHandlerConfig
{
  public static WebApplication UseExceptionHandler(this WebApplication app)
  {
    if (app.Environment.IsDevelopment())
    {
      app.UseDeveloperExceptionPage();
      return app;
    }


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
                KeyNotFoundException => (StatusCodes.Status404NotFound, "Not Found"),
                UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
                _ => (StatusCodes.Status500InternalServerError, "Internal Server Error")
              };

              context.Response.StatusCode = statusCode;

              var response = Result<object>.Error(message);

              await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
          });
    });
    return app;
  }
}
