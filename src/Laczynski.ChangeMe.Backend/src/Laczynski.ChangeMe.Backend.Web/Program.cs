using System.Text;
using System.Text.Json.Serialization;
using Biobank.Presentation.Api.Configurations;
using Laczynski.ChangeMe.Backend.Domain.Interfaces;
using Laczynski.ChangeMe.Backend.Infrastructure;
using Laczynski.ChangeMe.Backend.Infrastructure.Auth;
using Laczynski.ChangeMe.Backend.UseCases;
using Laczynski.ChangeMe.Backend.Web.ApiBase;
using Laczynski.ChangeMe.Backend.Web.Configurations;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

builder.AddSerilogLogging();
builder.AddOpenTelemetryConfig();

var loggerFactory = LoggerFactory.Create(lb => lb.AddSimpleConsole(o => o.SingleLine = true));
var logger = loggerFactory.CreateLogger(typeof(Program));

builder.Services.AddOptionsConfig(builder.Configuration, logger, builder);
builder.Services.AddCorsConfig(builder);


builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder, logger);

builder.Services.AddMediatrConfigs();


logger.LogInformation("Starting web host");

builder.Services.AddFastEndpoints()
                .SwaggerDocument(o =>
                {
                  o.ShortSchemaNames = true;
                });


var app = builder.Build();


if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
}
else
{
  app.UseApiExceptionHandler();
}

app.UseFastEndpoints(cfg =>
{
  cfg.Endpoints.RoutePrefix = "api";
  cfg.Serializer.Options.Converters.Add(new JsonStringEnumConverter());
})
.UseSwaggerGen(); // Includes AddFileServer and static files middleware


app.UseCors(CorsConfig.CorsPolicyName);

app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = r => r.Tags.Contains("ready") });

await app.ApplyMigrationsIfConfiguredAsync();

app.Run();

public partial class Program;
