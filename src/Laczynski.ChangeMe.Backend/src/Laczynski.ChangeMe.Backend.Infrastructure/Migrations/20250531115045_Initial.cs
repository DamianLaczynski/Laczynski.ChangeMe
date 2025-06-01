using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Laczynski.ChangeMe.Backend.Infrastructure.Migrations;

/// <inheritdoc />
public partial class Initial : Migration
{
  /// <inheritdoc />
  protected override void Up(MigrationBuilder migrationBuilder)
  {
    migrationBuilder.EnsureSchema(
        name: "items");

    migrationBuilder.CreateTable(
        name: "Items",
        schema: "items",
        columns: table => new
        {
          Id = table.Column<Guid>(type: "uuid", nullable: false),
          Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
          Description = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
          Price = table.Column<decimal>(type: "numeric", nullable: false),
          Image = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
          CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
          ModifiedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
          IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Items", x => x.Id);
        });

    migrationBuilder.CreateIndex(
        name: "IX_Items_CreatedAt",
        schema: "items",
        table: "Items",
        column: "CreatedAt");

    migrationBuilder.CreateIndex(
        name: "IX_Items_Description",
        schema: "items",
        table: "Items",
        column: "Description");

    migrationBuilder.CreateIndex(
        name: "IX_Items_Image",
        schema: "items",
        table: "Items",
        column: "Image");

    migrationBuilder.CreateIndex(
        name: "IX_Items_IsDeleted",
        schema: "items",
        table: "Items",
        column: "IsDeleted");

    migrationBuilder.CreateIndex(
        name: "IX_Items_ModifiedAt",
        schema: "items",
        table: "Items",
        column: "ModifiedAt");

    migrationBuilder.CreateIndex(
        name: "IX_Items_Name",
        schema: "items",
        table: "Items",
        column: "Name");

    migrationBuilder.CreateIndex(
        name: "IX_Items_Price",
        schema: "items",
        table: "Items",
        column: "Price");
  }

  /// <inheritdoc />
  protected override void Down(MigrationBuilder migrationBuilder)
  {
    migrationBuilder.DropTable(
        name: "Items",
        schema: "items");
  }
}
