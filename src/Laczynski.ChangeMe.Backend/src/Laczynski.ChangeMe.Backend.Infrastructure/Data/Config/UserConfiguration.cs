namespace Laczynski.ChangeMe.Backend.Infrastructure.Data.Config;

using Laczynski.ChangeMe.Backend.Core.ItemsAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

/// <summary>
/// Entity Framework Core configuration for the Item entity
/// </summary>
public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
  public void Configure(EntityTypeBuilder<Item> builder)
  {
    builder.ToTable("Items", DataSchemaConstants.ItemsSchema);

    // Primary key
    builder.HasKey(u => u.Id);

    // Base properties
    builder.Property(u => u.Name)
      .IsRequired()
      .HasMaxLength(100);

    builder.Property(u => u.Description)
      .IsRequired()
      .HasMaxLength(50);

    builder.Property(u => u.Price)
      .IsRequired();

    builder.Property(u => u.Image)
      .IsRequired()
      .HasMaxLength(256);

    builder.Property(u => u.CreatedAt)
      .IsRequired();

    builder.Property(u => u.ModifiedAt);

    builder.Property(u => u.IsDeleted)
      .IsRequired()
      .HasDefaultValue(false);

    // Indexes
    builder.HasIndex(u => u.Name);
    builder.HasIndex(u => u.Description);
    builder.HasIndex(u => u.Price);
    builder.HasIndex(u => u.Image);
    builder.HasIndex(u => u.CreatedAt);
    builder.HasIndex(u => u.ModifiedAt);
    builder.HasIndex(u => u.IsDeleted);
  }
}