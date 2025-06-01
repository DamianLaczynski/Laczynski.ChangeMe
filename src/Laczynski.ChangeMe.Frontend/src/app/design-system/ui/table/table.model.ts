// =============================================================================
// Table Component Models
// =============================================================================
// Type definitions and interfaces for the modern Table component
// Compatible with existing paginated table system but with modern design

import { TemplateRef, Signal } from '@angular/core';
import { Observable } from 'rxjs';

// Re-export compatibility types from existing system
export type { DataGridColumn } from '../../../shared/data/components/paginated-table/models/data-grid-column.model';

export type { PaginationParameters } from '../../../shared/data/models/pagination-parameters.model';

export type { PaginationResult } from '../../../shared/data/models/pagination-result.model';

export type { State } from '../../../shared/state/models/state.model';

// =============================================================================
// CORE TABLE INTERFACES
// =============================================================================

/**
 * Table configuration for the design system
 */
export interface TableConfig<T = any> {
  /** Visual variant */
  variant: TableVariant;

  /** Table size */
  size: TableSize;

  /** Border style */
  border: TableBorder;

  /** Whether table is striped */
  striped: boolean;

  /** Whether table is hoverable */
  hoverable: boolean;

  /** Whether table is responsive */
  responsive: boolean;

  /** Whether to show loading state */
  showLoading: boolean;

  /** Whether to show empty state */
  showEmptyState: boolean;

  /** Empty state configuration */
  emptyState: TableEmptyState;

  /** Selection configuration */
  selection: TableSelection;

  /** Sorting configuration */
  sorting: TableSorting;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  /** Column field identifier */
  field: keyof T | string;

  /** Column header text */
  header: string;

  /** Column width */
  width?: string;

  /** Minimum width */
  minWidth?: string;

  /** Maximum width */
  maxWidth?: string;

  /** Whether column is sortable */
  sortable?: boolean;

  /** Whether column is resizable */
  resizable?: boolean;

  /** Whether to hide on mobile */
  hideOnMobile?: boolean;

  /** Whether to hide on tablet */
  hideOnTablet?: boolean;

  /** Text alignment */
  align?: TableColumnAlign;

  /** Column type for automatic formatting */
  type?: TableColumnType;

  /** Custom template reference */
  template?: string;

  /** Custom header template reference */
  headerTemplate?: string;

  /** Column CSS classes */
  cssClass?: string;

  /** Whether column is sticky */
  sticky?: 'left' | 'right';

  /** Custom sort function */
  sortFn?: (a: T, b: T) => number;

  /** Custom filter function */
  filterFn?: (value: any, searchTerm: string) => boolean;

  /** Whether column is frozen */
  frozen?: boolean;
}

/**
 * Table data source configuration
 */
export interface TableDataSource<T = any, P = any> {
  /** Data loading function */
  loadData: (params: P) => Observable<TableData<T>>;

  /** Current parameters */
  params: P;

  /** Loading state signal */
  loading: Signal<boolean>;

  /** Error state signal */
  error: Signal<string | null>;
}

/**
 * Table data structure
 */
export interface TableData<T = any> {
  /** Array of items */
  items: T[];

  /** Total number of items */
  totalCount: number;

  /** Current page number */
  currentPage: number;

  /** Page size */
  pageSize: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there's a previous page */
  hasPrevious: boolean;

  /** Whether there's a next page */
  hasNext: boolean;
}

/**
 * Table state information
 */
export interface TableState<T = any> {
  /** Current data */
  data: TableData<T> | null;

  /** Loading state */
  isLoading: boolean;

  /** Error state */
  isError: boolean;

  /** Error message */
  error: string | null;

  /** Selected items */
  selectedItems: T[];

  /** Current sort field */
  sortField: string | null;

  /** Current sort direction */
  sortDirection: 'asc' | 'desc' | null;

  /** Current search term */
  searchTerm: string;

  /** Current filters */
  filters: Record<string, any>;
}

/**
 * Table empty state configuration
 */
export interface TableEmptyState {
  /** Empty state title */
  title?: string;

  /** Empty state message */
  message?: string;

  /** Empty state icon */
  icon?: string;

  /** Empty state image */
  image?: string;

  /** Empty state action button */
  action?: TableEmptyAction;
}

/**
 * Table empty state action
 */
export interface TableEmptyAction {
  /** Action label */
  label: string;

  /** Action handler */
  handler: () => void;

  /** Action variant */
  variant?: 'primary' | 'secondary';

  /** Action icon */
  icon?: string;
}

/**
 * Table selection configuration
 */
export interface TableSelection {
  /** Selection mode */
  mode: TableSelectionMode;

  /** Whether to show select all checkbox */
  showSelectAll?: boolean;

  /** Whether selection is disabled */
  disabled?: boolean;

  /** Function to determine if row is selectable */
  isSelectable?: (item: any) => boolean;

  /** Function to get unique row identifier */
  getRowId?: (item: any) => string | number;
}

/**
 * Table sorting configuration
 */
export interface TableSorting {
  /** Whether sorting is enabled */
  enabled: boolean;

  /** Server-side sorting */
  serverSide?: boolean;

  /** Default sort field */
  defaultField?: string;

  /** Default sort direction */
  defaultDirection?: 'asc' | 'desc';

  /** Multiple sorting */
  multiple?: boolean;
}

// =============================================================================
// TABLE TYPES & VARIANTS
// =============================================================================

/**
 * Table visual variants
 */
export type TableVariant = 'default' | 'bordered' | 'borderless' | 'compact' | 'comfortable';

/**
 * Table size variants
 */
export type TableSize = 'sm' | 'md' | 'lg';

/**
 * Table border styles
 */
export type TableBorder = 'none' | 'horizontal' | 'vertical' | 'all' | 'outer';

/**
 * Table column alignment
 */
export type TableColumnAlign = 'left' | 'center' | 'right';

/**
 * Table column types
 */
export type TableColumnType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'boolean'
  | 'image'
  | 'badge'
  | 'actions';

/**
 * Table selection modes
 */
export type TableSelectionMode = 'none' | 'single' | 'multiple';

// =============================================================================
// TABLE EVENTS
// =============================================================================

/**
 * Table row selection event
 */
export interface TableRowSelectEvent<T = any> {
  /** Selected item */
  item: T;

  /** All selected items */
  selectedItems: T[];

  /** Original event */
  originalEvent: Event;
}

/**
 * Table sort change event
 */
export interface TableSortEvent {
  /** Sort field */
  field: string;

  /** Sort direction */
  direction: 'asc' | 'desc';

  /** Multiple sorts (if enabled) */
  multisort?: TableSortField[];

  /** Original event */
  originalEvent: Event;
}

/**
 * Table sort field
 */
export interface TableSortField {
  /** Field name */
  field: string;

  /** Sort direction */
  direction: 'asc' | 'desc';
}

/**
 * Table page change event
 */
export interface TablePageEvent {
  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total records */
  totalRecords: number;

  /** Original event */
  originalEvent: Event;
}

/**
 * Table filter event
 */
export interface TableFilterEvent {
  /** Filter field */
  field: string;

  /** Filter value */
  value: any;

  /** All active filters */
  filters: Record<string, any>;

  /** Original event */
  originalEvent: Event;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default table configuration
 */
export const DEFAULT_TABLE_CONFIG: TableConfig = {
  variant: 'default',
  size: 'md',
  border: 'horizontal',
  striped: false,
  hoverable: true,
  responsive: true,
  showLoading: true,
  showEmptyState: true,
  emptyState: {
    title: 'No data available',
    message: 'There are no records to display',
    icon: '📋',
  },
  selection: {
    mode: 'none',
    showSelectAll: true,
    disabled: false,
  },
  sorting: {
    enabled: true,
    serverSide: true,
    multiple: false,
  },
};

/**
 * Table size configurations
 */
export const TABLE_SIZE_CONFIG = {
  sm: {
    padding: '8px 12px',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  md: {
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  lg: {
    padding: '16px 20px',
    fontSize: '16px',
    lineHeight: '1.6',
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create table configuration with defaults
 */
export function createTableConfig<T>(partial: Partial<TableConfig<T>> = {}): TableConfig<T> {
  return {
    ...DEFAULT_TABLE_CONFIG,
    ...partial,
    emptyState: {
      ...DEFAULT_TABLE_CONFIG.emptyState,
      ...partial.emptyState,
    },
    selection: {
      ...DEFAULT_TABLE_CONFIG.selection,
      ...partial.selection,
    },
    sorting: {
      ...DEFAULT_TABLE_CONFIG.sorting,
      ...partial.sorting,
    },
  };
}

/**
 * Create table column
 */
export function createTableColumn<T>(
  column: Partial<TableColumn<T>> & { field: keyof T | string; header: string },
): TableColumn<T> {
  return {
    sortable: true,
    resizable: false,
    hideOnMobile: false,
    hideOnTablet: false,
    align: 'left',
    type: 'text',
    frozen: false,
    ...column,
  };
}

/**
 * Create table empty state
 */
export function createTableEmptyState(partial: Partial<TableEmptyState> = {}): TableEmptyState {
  return {
    title: 'No data available',
    message: 'There are no records to display',
    icon: '📋',
    ...partial,
  };
}

/**
 * Get table CSS classes
 */
export function getTableClasses(config: TableConfig): string[] {
  const classes = ['ds-table'];

  // Variant classes
  classes.push(`ds-table--${config.variant}`);
  classes.push(`ds-table--${config.size}`);
  classes.push(`ds-table--border-${config.border}`);

  // Feature classes
  if (config.striped) classes.push('ds-table--striped');
  if (config.hoverable) classes.push('ds-table--hoverable');
  if (config.responsive) classes.push('ds-table--responsive');

  // State classes
  if (config.showLoading) classes.push('ds-table--with-loading');

  return classes;
}

/**
 * Get table column CSS classes
 */
export function getTableColumnClasses(column: TableColumn): string[] {
  const classes = ['ds-table__cell'];

  // Alignment classes
  if (column.align && column.align !== 'left') {
    classes.push(`ds-table__cell--${column.align}`);
  }

  // Type classes
  if (column.type && column.type !== 'text') {
    classes.push(`ds-table__cell--${column.type}`);
  }

  // Feature classes
  if (column.sortable) classes.push('ds-table__cell--sortable');
  if (column.resizable) classes.push('ds-table__cell--resizable');
  if (column.hideOnMobile) classes.push('ds-table__cell--hide-mobile');
  if (column.hideOnTablet) classes.push('ds-table__cell--hide-tablet');
  if (column.sticky) classes.push(`ds-table__cell--sticky-${column.sticky}`);
  if (column.frozen) classes.push('ds-table__cell--frozen');

  // Custom classes
  if (column.cssClass) classes.push(column.cssClass);

  return classes;
}

/**
 * Format cell value based on column type
 */
export function formatCellValue(value: any, column: TableColumn): string {
  if (value == null) return '';

  switch (column.type) {
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value);

    case 'currency':
      return typeof value === 'number'
        ? new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value)
        : String(value);

    case 'date':
      return value instanceof Date
        ? value.toLocaleDateString('pl-PL')
        : new Date(value).toLocaleDateString('pl-PL');

    case 'boolean':
      return value ? 'Yes' : 'No';

    default:
      return String(value);
  }
}

/**
 * Get nested property value
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Sort table data
 */
export function sortTableData<T>(
  data: T[],
  sortField: string,
  sortDirection: 'asc' | 'desc',
  columns: TableColumn<T>[],
): T[] {
  const column = columns.find(col => col.field === sortField);

  return [...data].sort((a, b) => {
    // Use custom sort function if provided
    if (column?.sortFn) {
      const result = column.sortFn(a, b);
      return sortDirection === 'desc' ? -result : result;
    }

    // Default sorting
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let result = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      result = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      result = aValue.getTime() - bValue.getTime();
    } else {
      result = String(aValue).localeCompare(String(bValue));
    }

    return sortDirection === 'desc' ? -result : result;
  });
}

/**
 * Filter table data
 */
export function filterTableData<T>(data: T[], searchTerm: string, columns: TableColumn<T>[]): T[] {
  if (!searchTerm) return data;

  const searchLower = searchTerm.toLowerCase();

  return data.filter(item => {
    return columns.some(column => {
      // Use custom filter function if provided
      if (column.filterFn) {
        const value = getNestedValue(item, column.field as string);
        return column.filterFn(value, searchTerm);
      }

      // Default filtering
      const value = getNestedValue(item, column.field as string);
      if (value == null) return false;

      return String(value).toLowerCase().includes(searchLower);
    });
  });
}

/**
 * Generate unique table ID
 */
export function generateTableId(prefix: string = 'table'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate visible page numbers
 */
export function calculateVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5,
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - maxVisible + 1));
  const end = Math.min(totalPages, start + maxVisible - 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
