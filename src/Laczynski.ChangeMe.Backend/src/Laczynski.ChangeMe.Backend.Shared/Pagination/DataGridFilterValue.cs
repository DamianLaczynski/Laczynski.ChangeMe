namespace Laczynski.ChangeMe.Backend.Shared.Pagination;

/// <summary>
/// Represents a filter value from DataGrid component.
/// Matches frontend DataGridFilterValue interface.
/// </summary>
public class DataGridFilterValue
{
    /// <summary>
    /// The filter operator being used (e.g., "contains", "equals", "greaterThan", etc.)
    /// </summary>
    public string? Operator { get; set; }

    /// <summary>
    /// Primary filter value
    /// </summary>
    public object? Value { get; set; }

    /// <summary>
    /// Secondary value (for 'between' operators)
    /// </summary>
    public object? ValueTo { get; set; }

    /// <summary>
    /// Selected values for multi-select filters
    /// </summary>
    public List<object>? Values { get; set; }
}

