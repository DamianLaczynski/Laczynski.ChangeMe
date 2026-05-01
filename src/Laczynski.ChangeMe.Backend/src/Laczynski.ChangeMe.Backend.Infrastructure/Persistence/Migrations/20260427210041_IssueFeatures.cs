using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Laczynski.ChangeMe.Backend.Infrastructure.Persistence.Migrations
{
  /// <inheritdoc />
  public partial class IssueFeatures : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.AddColumn<Guid>(
          name: "AssignedToUserId",
          schema: "laczynski_changeme_backend",
          table: "issues",
          type: "uuid",
          nullable: true);

      migrationBuilder.AddColumn<DateTime>(
          name: "LastActivityAt",
          schema: "laczynski_changeme_backend",
          table: "issues",
          type: "timestamp with time zone",
          nullable: false,
          defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

      migrationBuilder.AddColumn<string>(
          name: "Status",
          schema: "laczynski_changeme_backend",
          table: "issues",
          type: "text",
          nullable: false,
          defaultValue: "");

      migrationBuilder.CreateTable(
          name: "issue_comments",
          schema: "laczynski_changeme_backend",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uuid", nullable: false),
            IssueId = table.Column<Guid>(type: "uuid", nullable: false),
            Content = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
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

      migrationBuilder.CreateTable(
          name: "issue_history_entries",
          schema: "laczynski_changeme_backend",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uuid", nullable: false),
            IssueId = table.Column<Guid>(type: "uuid", nullable: false),
            EventType = table.Column<string>(type: "text", nullable: false),
            ActorUserId = table.Column<Guid>(type: "uuid", nullable: false),
            Summary = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
            PreviousValue = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
            CurrentValue = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
            RelatedCommentId = table.Column<Guid>(type: "uuid", nullable: true),
            CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
            UpdatedBy = table.Column<Guid>(type: "uuid", nullable: false),
            CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_issue_history_entries", x => x.Id);
            table.ForeignKey(
                      name: "FK_issue_history_entries_issues_IssueId",
                      column: x => x.IssueId,
                      principalSchema: "laczynski_changeme_backend",
                      principalTable: "issues",
                      principalColumn: "Id",
                      onDelete: ReferentialAction.Cascade);
          });

      migrationBuilder.CreateTable(
          name: "issue_watchers",
          schema: "laczynski_changeme_backend",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uuid", nullable: false),
            IssueId = table.Column<Guid>(type: "uuid", nullable: false),
            UserId = table.Column<Guid>(type: "uuid", nullable: false),
            CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
            UpdatedBy = table.Column<Guid>(type: "uuid", nullable: false),
            CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_issue_watchers", x => x.Id);
            table.ForeignKey(
                      name: "FK_issue_watchers_issues_IssueId",
                      column: x => x.IssueId,
                      principalSchema: "laczynski_changeme_backend",
                      principalTable: "issues",
                      principalColumn: "Id",
                      onDelete: ReferentialAction.Cascade);
          });

      migrationBuilder.CreateTable(
          name: "notifications",
          schema: "laczynski_changeme_backend",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uuid", nullable: false),
            RecipientUserId = table.Column<Guid>(type: "uuid", nullable: false),
            IssueId = table.Column<Guid>(type: "uuid", nullable: false),
            IssueHistoryEntryId = table.Column<Guid>(type: "uuid", nullable: false),
            EventType = table.Column<string>(type: "text", nullable: false),
            IssueTitle = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
            Message = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
            Link = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
            OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            IsRead = table.Column<bool>(type: "boolean", nullable: false),
            ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
            EmailSentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
            CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
            UpdatedBy = table.Column<Guid>(type: "uuid", nullable: false),
            CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
            IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_notifications", x => x.Id);
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
          name: "IX_issue_history_entries_Id",
          schema: "laczynski_changeme_backend",
          table: "issue_history_entries",
          column: "Id");

      migrationBuilder.CreateIndex(
          name: "IX_issue_history_entries_IssueId",
          schema: "laczynski_changeme_backend",
          table: "issue_history_entries",
          column: "IssueId");

      migrationBuilder.CreateIndex(
          name: "IX_issue_watchers_Id",
          schema: "laczynski_changeme_backend",
          table: "issue_watchers",
          column: "Id");

      migrationBuilder.CreateIndex(
          name: "IX_issue_watchers_IssueId_UserId",
          schema: "laczynski_changeme_backend",
          table: "issue_watchers",
          columns: new[] { "IssueId", "UserId" },
          unique: true);

      migrationBuilder.CreateIndex(
          name: "IX_notifications_Id",
          schema: "laczynski_changeme_backend",
          table: "notifications",
          column: "Id");

      migrationBuilder.CreateIndex(
          name: "IX_notifications_RecipientUserId_IsRead",
          schema: "laczynski_changeme_backend",
          table: "notifications",
          columns: new[] { "RecipientUserId", "IsRead" });

      migrationBuilder.CreateIndex(
          name: "IX_notifications_RecipientUserId_IssueHistoryEntryId",
          schema: "laczynski_changeme_backend",
          table: "notifications",
          columns: new[] { "RecipientUserId", "IssueHistoryEntryId" },
          unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "issue_comments",
          schema: "laczynski_changeme_backend");

      migrationBuilder.DropTable(
          name: "issue_history_entries",
          schema: "laczynski_changeme_backend");

      migrationBuilder.DropTable(
          name: "issue_watchers",
          schema: "laczynski_changeme_backend");

      migrationBuilder.DropTable(
          name: "notifications",
          schema: "laczynski_changeme_backend");

      migrationBuilder.DropColumn(
          name: "AssignedToUserId",
          schema: "laczynski_changeme_backend",
          table: "issues");

      migrationBuilder.DropColumn(
          name: "LastActivityAt",
          schema: "laczynski_changeme_backend",
          table: "issues");

      migrationBuilder.DropColumn(
          name: "Status",
          schema: "laczynski_changeme_backend",
          table: "issues");
    }
  }
}
