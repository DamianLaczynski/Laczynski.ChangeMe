using Laczynski.ChangeMe.Backend.Web.Configurations;
using Laczynski.ChangeMe.Backend.Infrastructure.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.AddSerilog();

var loggerFactory = LoggerFactory.Create(lb => lb.AddSimpleConsole(o => o.SingleLine = true));
var logger = loggerFactory.CreateLogger(typeof(Program));

builder.Services.AddOptionsConfig(builder.Configuration, logger, builder);
builder.Services.AddCors(builder);

builder.Services.AddDatabase(builder, logger);
builder.Services.AddEmail(logger);

builder.Services.AddHttpContextAccessor();
builder.Services.AddUserAccessor();

builder.Services.AddMediator();

logger.LogInformation("Starting web host");

builder.Services.AddFastEndpointsWithSwagger();

var app = builder.Build();

app.UseExceptionHandler();

app.UseFastEndpointsWithSwagger();

app.UseCors(CorsConfig.CorsPolicyName);

app.MapHealthChecks("/health");

await app.UseDatabase();

app.Run();

public partial class Program;
