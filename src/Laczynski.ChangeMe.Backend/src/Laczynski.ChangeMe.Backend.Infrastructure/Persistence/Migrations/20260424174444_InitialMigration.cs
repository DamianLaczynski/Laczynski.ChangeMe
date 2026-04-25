using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Laczynski.ChangeMe.Backend.Infrastructure.Persistence.Migrations;

/// <inheritdoc />
public partial class InitialMigration : Migration
{
  /// <inheritdoc />
  protected override void Up(MigrationBuilder migrationBuilder)
  {
    migrationBuilder.EnsureSchema(
        name: "laczynski_changeme_backend");

    migrationBuilder.CreateTable(
        name: "issues",
        schema: "laczynski_changeme_backend",
        columns: table => new
        {
          Id = table.Column<Guid>(type: "uuid", nullable: false),
          Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
          Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
          Priority = table.Column<string>(type: "text", nullable: false),
          CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
          UpdatedBy = table.Column<Guid>(type: "uuid", nullable: false),
          CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
          UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
          IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_issues", x => x.Id);
        });

    migrationBuilder.CreateTable(
        name: "issue_comments",
        schema: "laczynski_changeme_backend",
        columns: table => new
        {
          Id = table.Column<Guid>(type: "uuid", nullable: false),
          Content = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
          IssueId = table.Column<Guid>(type: "uuid", nullable: false),
          CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
          UpdatedBy = table.Column<Guid>(type: "uuid", nullable: false),
          CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
          UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
          IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_issue_comments", x => x.Id);
          table.ForeignKey(
                    name: "FK_issue_comments_issues_IssueId",
                    column: x => x.IssueId,
                    principalSchema: "laczynski_changeme_backend",
                    principalTable: "issues",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
        });

    migrationBuilder.CreateIndex(
        name: "IX_issue_comments_Id",
        schema: "laczynski_changeme_backend",
        table: "issue_comments",
        column: "Id");

    migrationBuilder.CreateIndex(
        name: "IX_issue_comments_IssueId",
        schema: "laczynski_changeme_backend",
        table: "issue_comments",
        column: "IssueId");

    migrationBuilder.CreateIndex(
        name: "IX_issues_Id",
        schema: "laczynski_changeme_backend",
        table: "issues",
        column: "Id");
  }

  /// <inheritdoc />
  protected override void Down(MigrationBuilder migrationBuilder)
  {
    migrationBuilder.DropTable(
        name: "issue_comments",
        schema: "laczynski_changeme_backend");

    migrationBuilder.DropTable(
        name: "issues",
        schema: "laczynski_changeme_backend");
  }
}
