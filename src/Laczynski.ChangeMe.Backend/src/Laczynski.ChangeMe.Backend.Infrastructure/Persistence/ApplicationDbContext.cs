using System.Reflection;
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;
using Laczynski.ChangeMe.Backend.Domain.Interfaces;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Persistence;

public class ApplicationDbContext(
  DbContextOptions<ApplicationDbContext> options,
  IDomainEventDispatcher? dispatcher = null,
  IUserAccessor? userAccessor = null) : DbContext(options)
{
  public DbSet<Issue> Issues => Set<Issue>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.HasDefaultSchema(DatabaseSchema.Default);

    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
  }

  public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
  {
    UpdateTimeStamps();
    UpdateUserInfo();

    int result = await base.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

    DispatchDomainEvents();

    return result;
  }

  public override int SaveChanges()
  {
    UpdateTimeStamps();
    UpdateUserInfo();

    var result = base.SaveChanges();

    DispatchDomainEvents();

    return result;
  }

  private void UpdateTimeStamps()
  {
    var now = DateTime.UtcNow;

    var entries = ChangeTracker.Entries<Entity>()
      .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

    foreach (var entry in entries)
    {
      if (entry.State == EntityState.Added)
        entry.Property(e => e.CreatedAt).CurrentValue = now;

      entry.Property(e => e.UpdatedAt).CurrentValue = now;
    }
  }

  private void UpdateUserInfo()
  {
    if (userAccessor is null) return;

    var entries = ChangeTracker.Entries<Entity>()
      .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

    foreach (var entry in entries)
    {
      if (entry.State == EntityState.Added)
        entry.Property(e => e.CreatedBy).CurrentValue = userAccessor.UserId;

      entry.Property(e => e.UpdatedBy).CurrentValue = userAccessor.UserId;
    }
  }

  private void DispatchDomainEvents()
  {
    if (dispatcher == null) return;

    var entitiesWithEvents = ChangeTracker.Entries<HasDomainEventsBase>()
        .Select(e => e.Entity)
        .Where(e => e.DomainEvents.Any())
        .ToArray();

    dispatcher.DispatchAndClearEvents(entitiesWithEvents);
  }
}
