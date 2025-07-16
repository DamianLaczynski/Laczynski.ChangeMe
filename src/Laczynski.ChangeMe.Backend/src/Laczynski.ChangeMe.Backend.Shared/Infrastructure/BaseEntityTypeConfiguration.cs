using Laczynski.ChangeMe.Backend.Shared.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Laczynski.Analyze.Backend.Shared.Infrastructure;

public abstract class BaseEntityTypeConfiguration<TEntity> : IEntityTypeConfiguration<TEntity>
    where TEntity : EntityBase<Guid>
{

    /// <summary>
    /// The schema name.
    /// </summary>
    protected abstract string TableName { get; }

    /// <summary>
    /// Configures the entity type.
    /// </summary>
    /// <param name="builder">The entity type builder.</param>
    public virtual void Configure(EntityTypeBuilder<TEntity> builder)
    {
        builder.ToTable(TableName);

        builder.HasKey(e => e.Id);

        builder.Property(e => e.CreatedAt)
            .IsRequired();

        builder.Property(e => e.ModifiedAt);

        builder.Property(e => e.IsDeleted)
            .IsRequired()
            .HasDefaultValue(false);

        // Indexes
        builder.HasIndex(e => e.Id);
    }
}