namespace Laczynski.ChangeMe.Backend.Shared.Pagination;

/// <summary>
/// Represents an active filter from DataGrid component.
/// Matches frontend DataGridActiveFilter interface.
/// </summary>
public class DataGridActiveFilter
{
    /// <summary>
    /// Column ID from the DataGrid
    /// </summary>
    public string ColumnId { get; set; } = string.Empty;

    /// <summary>
    /// Column field name (for accessing data values).
    /// This is the actual property name on the entity/DTO.
    /// </summary>
    public string? Field { get; set; }

    /// <summary>
    /// Filter type: "text", "number", "date", "select", "multi-select", "boolean"
    /// </summary>
    public string Type { get; set; } = string.Empty;

    /// <summary>
    /// Current filter value
    /// </summary>
    public DataGridFilterValue Filter { get; set; } = new();

    /// <summary>
    /// Display text for the active filter (optional, for UI purposes)
    /// </summary>
    public string? DisplayText { get; set; }
}

