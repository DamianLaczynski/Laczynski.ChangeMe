using Laczynski.ChangeMe.Backend.Infrastructure.Persistence;
using Microsoft.AspNetCore.Builder;

namespace Laczynski.ChangeMe.Backend.Infrastructure;

public static class WebApplicationExtensions
{
    public static async Task ApplyMigrationsIfConfiguredAsync(this WebApplication app)
    {
        if (!app.Configuration.GetValue("DatabaseOptions:ApplyMigrationsOnStartup", false))
            return;

        await using var scope = app.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await db.Database.MigrateAsync();
    }
}
