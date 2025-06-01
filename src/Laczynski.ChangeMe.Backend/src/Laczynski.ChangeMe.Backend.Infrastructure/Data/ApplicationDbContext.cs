namespace Laczynski.ChangeMe.Backend.Infrastructure.Data;

using System.Reflection;
using Laczynski.ChangeMe.Backend.Core.ItemsAggregate;
using Laczynski.ChangeMe.Backend.Shared.Core;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// Main database context for the application.
/// </summary>
public class ApplicationDbContext : DbContext
{
  private readonly IDomainEventDispatcher? _dispatcher;

  /// <summary>
  /// Constructor for ApplicationDbContext.
  /// </summary>
  public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IDomainEventDispatcher? dispatcher = null) : base(options)
  {
    _dispatcher = dispatcher;
  }

  public DbSet<Item> Items => Set<Item>();

  /// <summary>
  /// Database model configuration.
  /// </summary>
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // Applying configuration from Assembly
    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
  }

  public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
  {
    int result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

    if (_dispatcher == null) return result;

    var entitiesWithEvents = ChangeTracker.Entries<HasDomainEventsBase>()
        .Select(e => e.Entity)
        .Where(e => e.DomainEvents.Any())
        .ToArray();

    await _dispatcher.DispatchAndClearEvents(entitiesWithEvents);

    return result;
  }

  public override int SaveChanges() =>
        SaveChangesAsync().GetAwaiter().GetResult();
}
