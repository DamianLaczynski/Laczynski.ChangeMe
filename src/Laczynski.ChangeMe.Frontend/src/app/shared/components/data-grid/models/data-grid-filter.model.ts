// =============================================================================
// DataGrid Filter Models
// =============================================================================

/**
 * Available filter types for columns
 */
export type DataGridFilterType =
  | 'text'           // Simple text search (contains)
  | 'number'         // Number comparison
  | 'date'           // Date range
  | 'select'         // Single select dropdown
  | 'multi-select'   // Multiple select dropdown
  | 'boolean';       // Yes/No toggle

/**
 * Text filter operators
 */
export type TextFilterOperator =
  | 'contains'       // Default - case insensitive contains
  | 'equals'         // Exact match
  | 'startsWith'     // Starts with
  | 'endsWith';      // Ends with

/**
 * Number filter operators
 */
export type NumberFilterOperator =
  | 'equals'         // =
  | 'notEquals'      // !=
  | 'greaterThan'    // >
  | 'lessThan'       // <
  | 'greaterOrEqual' // >=
  | 'lessOrEqual'    // <=
  | 'between';       // Between two values

/**
 * Date filter operators
 */
export type DateFilterOperator =
  | 'equals'         // Exact date
  | 'before'         // Before date
  | 'after'          // After date
  | 'between';       // Date range

/**
 * Filter configuration for a column
 */
export interface DataGridFilterConfig {
  /**
   * Type of filter to display
   */
  type: DataGridFilterType;

  /**
   * Placeholder text for the filter input
   */
  placeholder?: string;

  /**
   * Available operators for this filter (if applicable)
   * If not specified, uses default operator for the type
   */
  operators?: TextFilterOperator[] | NumberFilterOperator[] | DateFilterOperator[];

  /**
   * Default operator to use
   */
  defaultOperator?: TextFilterOperator | NumberFilterOperator | DateFilterOperator;

  /**
   * Options for select/multi-select filters
   */
  options?: DataGridFilterOption[];

  /**
   * Custom filter function (for complex filtering logic)
   * @param value - The cell value
   * @param filterValue - The current filter value
   * @param filterOperator - The current operator
   * @returns true if the row should be included
   */
  customFilterFn?: (value: any, filterValue: DataGridFilterValue, filterOperator?: string) => boolean;

  /**
   * Whether to show the filter inline in the header (default: true)
   */
  inline?: boolean;

  /**
   * Whether to show operator selector (default: false for text, true for number/date)
   */
  showOperator?: boolean;

  /**
   * Debounce delay in ms for text filters (default: 300)
   */
  debounceMs?: number;
}

/**
 * Option for select/multi-select filters
 */
export interface DataGridFilterOption {
  label: string;
  value: any;
  disabled?: boolean;
}

/**
 * Current filter value (can be simple or complex)
 */
export interface DataGridFilterValue {
  /**
   * The filter operator being used
   */
  operator?: TextFilterOperator | NumberFilterOperator | DateFilterOperator;

  /**
   * Primary value
   */
  value?: any;

  /**
   * Secondary value (for 'between' operators)
   */
  valueTo?: any;

  /**
   * Selected values for multi-select
   */
  values?: any[];
}

/**
 * Active filter state for a column
 */
export interface DataGridActiveFilter {
  /**
   * Column ID
   */
  columnId: string;

  /**
   * Column field name (for accessing data values)
   * Optional for backward compatibility, but recommended for proper filtering
   */
  field?: string;

  /**
   * Filter type
   */
  type: DataGridFilterType;

  /**
   * Current filter value
   */
  filter: DataGridFilterValue;

  /**
   * Display text for the active filter
   */
  displayText?: string;
}

