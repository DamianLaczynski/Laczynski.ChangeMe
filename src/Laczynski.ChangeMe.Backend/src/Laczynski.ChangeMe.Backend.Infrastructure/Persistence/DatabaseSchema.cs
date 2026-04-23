namespace Laczynski.ChangeMe.Backend.Infrastructure.Persistence;

internal static class DatabaseSchema
{
  public static string Default { get; } = BuildDefaultSchemaName();

  private static string BuildDefaultSchemaName()
  {
    var assemblyName = typeof(ApplicationDbContext).Assembly.GetName().Name
      ?? throw new InvalidOperationException("Infrastructure assembly name could not be determined.");

    return assemblyName
      .Replace('.', '_')
      .Replace('-', '_')
      .ToLowerInvariant();
  }
}
