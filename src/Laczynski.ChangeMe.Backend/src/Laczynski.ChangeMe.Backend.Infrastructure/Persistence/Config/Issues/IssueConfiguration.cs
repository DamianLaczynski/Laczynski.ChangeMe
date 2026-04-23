
using Laczynski.ChangeMe.Backend.Domain.Aggregates.Issue;

namespace Laczynski.ChangeMe.Backend.Infrastructure.Persistence.Config.Issues;

public class IssueConfiguration : BaseEntityTypeConfiguration<Issue>
{
  protected override string TableName => "issues";

  public override void Configure(EntityTypeBuilder<Issue> builder)
  {
    base.Configure(builder);

    builder.Property(i => i.Title)
      .IsRequired()
      .HasMaxLength(IssueConstraints.TITLE_MAX_LENGTH);

    builder.Property(i => i.Description)
      .IsRequired()
      .HasMaxLength(IssueConstraints.DESCRIPTION_MAX_LENGTH);

    builder.Property(i => i.Priority)
      .IsRequired()
      .HasConversion<string>();

    builder.HasMany(i => i.Comments)
      .WithOne()
      .HasForeignKey(ic => ic.IssueId)
      .OnDelete(DeleteBehavior.Cascade);
  }
}
