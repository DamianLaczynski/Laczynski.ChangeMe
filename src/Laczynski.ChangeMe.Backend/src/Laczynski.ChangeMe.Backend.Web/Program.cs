using Laczynski.ChangeMe.Backend.Infrastructure.Configurations;
using Laczynski.ChangeMe.Backend.Web.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.AddSerilog();

var loggerFactory = LoggerFactory.Create(lb => lb.AddSimpleConsole(o => o.SingleLine = true));
var logger = loggerFactory.CreateLogger(typeof(Program));

builder.Services.AddOptionsConfig(builder.Configuration, logger, builder);
builder.Services.AddCors(builder);
builder.Services.AddJwtAuthentication(builder.Configuration);

builder.Services.AddHttpContextAccessor();

builder.Services.AddDatabase(builder, logger);
builder.Services.AddHangfire(builder, logger);

builder.Services.AddInfrastructureServices(logger);

builder.Services.AddMediator();

logger.LogInformation("Starting web host");

builder.Services.AddFastEndpointsWithSwagger();

var app = builder.Build();

app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseCors(CorsConfig.CorsPolicyName);
app.UseAuthentication();
app.UseAuthorization();

app.UseFastEndpointsWithSwagger();
app.UseHangfireDashboard();

app.MapHealthChecks("/health");

await app.UseDatabase();

app.Run();

public partial class Program;
