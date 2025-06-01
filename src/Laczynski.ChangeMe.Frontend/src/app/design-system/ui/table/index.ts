// =============================================================================
// Table Component Exports
// =============================================================================
// Modern data table component with sorting, pagination, filtering, and selection

// Component export
export { TableComponent } from './table.component';
export { TableShowcaseComponent } from './table-showcase.component';

// Model exports
export type {
  // Core interfaces
  TableConfig,
  TableColumn,
  TableData,
  TableState,
  TableDataSource,
  TableEmptyState,
  TableEmptyAction,
  TableSelection,
  TableSorting,

  // Type unions
  TableVariant,
  TableSize,
  TableBorder,
  TableColumnAlign,
  TableColumnType,
  TableSelectionMode,

  // Event interfaces
  TableRowSelectEvent,
  TableSortEvent,
  TableSortField,
  TablePageEvent,
  TableFilterEvent,

  // Compatibility exports
  DataGridColumn,
  PaginationParameters,
  PaginationResult,
  State,
} from './table.model';

// Utility function exports
export {
  createTableConfig,
  createTableColumn,
  createTableEmptyState,
  getTableClasses,
  getTableColumnClasses,
  formatCellValue,
  getNestedValue,
  sortTableData,
  filterTableData,
  generateTableId,
  calculateVisiblePages,
  DEFAULT_TABLE_CONFIG,
  TABLE_SIZE_CONFIG,
} from './table.model';
