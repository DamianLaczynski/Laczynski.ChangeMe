using Laczynski.ChangeMe.Backend.Domain.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Common;

public abstract class BaseEntityTypeConfiguration<TEntity> : IEntityTypeConfiguration<TEntity>
    where TEntity : Entity
{

    protected abstract string TableName { get; }

    public virtual void Configure(EntityTypeBuilder<TEntity> builder)
    {
        builder.ToTable(TableName);

        builder.HasKey(e => e.Id);

        builder.Property(e => e.CreatedAt)
            .IsRequired();

        builder.Property(e => e.UpdatedAt)
            .IsRequired();

        builder.Property(e => e.IsDeleted)
            .HasDefaultValue(false);

        builder.Property(e => e.CreatedBy)
            .IsRequired();

        builder.Property(e => e.UpdatedBy)
            .IsRequired();

        // Indexes
        builder.HasIndex(e => e.Id);
    }
}
