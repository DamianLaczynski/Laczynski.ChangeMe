/**
 * DataGrid Configuration Interfaces
 *
 * Defines the structure for configuring DataGrid component
 * using the new DataSource-based approach.
 */

import { DataGridColumn, DataGridRow } from '../models/data-grid-column.model';
import { DataGridActiveFilter } from '../models/data-grid-filter.model';
import { DataGridDataSource } from '../data-sources/data-grid-data-source.interface';

/**
 * Pagination configuration
 */
export interface DataGridPaginationConfig {
  /** Whether pagination is enabled */
  enabled: boolean;
  /** Initial page size */
  pageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Whether to show page size selector */
  showPageSizeSelector?: boolean;
  /** Whether to show page numbers */
  showPageNumbers?: boolean;
  /** Whether to show first/last buttons */
  showFirstLast?: boolean;
  /** Whether to show pagination info (e.g., "1-10 of 100") */
  showInfo?: boolean;
}

/**
 * Sorting configuration
 */
export interface DataGridSortingConfig {
  /** Whether sorting is enabled */
  enabled: boolean;
  /** Default sort configuration */
  defaultSort?: {
    /** Field name to sort by */
    field: string;
    /** Sort direction */
    direction: 'asc' | 'desc';
  };
}

/**
 * Filtering configuration
 */
export interface DataGridFilteringConfig {
  /** Whether filtering is enabled */
  enabled: boolean;
  /** Debounce delay in milliseconds for text filters */
  debounceMs?: number;
}

/**
 * Styling configuration
 */
export interface DataGridStylingConfig {
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show striped rows */
  striped?: boolean;
  /** Whether to show borders */
  bordered?: boolean;
  /** Whether rows are hoverable */
  hoverable?: boolean;
  /** Whether headers are sticky */
  stickyHeaders?: boolean;
}

/**
 * Virtualization configuration
 */
export interface DataGridVirtualizationConfig {
  /** Whether virtualization is enabled */
  enabled: boolean;
  /** Height of each row in pixels */
  itemHeight?: number;
  /** Number of items to render outside viewport (buffer) */
  bufferSize?: number;
}

/**
 * Callback functions for DataGrid events
 *
 * @template T - The type of data items
 */
export interface DataGridCallbacks<T> {
  /** Called when a row is clicked */
  onRowClick?: (row: DataGridRow<T>) => void;
  /** Called when a row is selected */
  onRowSelect?: (row: DataGridRow<T>) => void;
  /** Called when selection changes */
  onSelectionChange?: (rows: DataGridRow<T>[]) => void;
  /** Called when sort changes */
  onSortChange?: (sort: { field: string; direction: 'asc' | 'desc' }) => void;
  /** Called when filters change */
  onFilterChange?: (filters: DataGridActiveFilter[]) => void;
  /** Called when page changes */
  onPageChange?: (page: number) => void;
  /** Called when page size changes */
  onPageSizeChange?: (size: number) => void;
  /** Called when a row is expanded */
  onRowExpand?: (row: DataGridRow<T>) => void;
  /** Called when a row is collapsed */
  onRowCollapse?: (row: DataGridRow<T>) => void;
  /** Called when a cell is clicked */
  onCellClick?: (row: DataGridRow<T>, column: DataGridColumn<T>) => void;
}

/**
 * Loading state configuration
 */
export interface DataGridLoadingConfig {
  /** Loading title */
  title?: string;
  /** Loading description */
  description?: string;
  /** Spinner size */
  spinnerSize?: 'extra-tiny' | 'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge';
}

/**
 * Empty state configuration
 */
export interface DataGridEmptyConfig {
  /** Empty state title */
  title?: string;
  /** Empty state description */
  description?: string;
  /** Empty state icon */
  icon?: string;
  /** Primary action */
  primaryAction?: {
    label: string;
    variant: 'primary' | 'secondary';
    action: () => void;
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    variant: 'primary' | 'secondary';
    action: () => void;
  };
}

/**
 * Error state configuration
 */
export interface DataGridErrorConfig {
  /** Error title */
  title?: string;
  /** Error description */
  description?: string;
  /** Error icon */
  icon?: string;
  /** Primary action */
  primaryAction?: {
    label: string;
    variant: 'primary' | 'secondary';
    action: () => void;
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    variant: 'primary' | 'secondary';
    action: () => void;
  };
}

/**
 * Main DataGrid configuration
 *
 * @template T - The type of data items
 */
export interface DataGridConfig<T> {
  /** Column definitions */
  columns: DataGridColumn<T>[];
  /** Data source */
  dataSource: DataGridDataSource<T>;
  /** Selection mode */
  selection?: 'none' | 'single' | 'multi';
  /** Pagination configuration */
  pagination?: DataGridPaginationConfig;
  /** Sorting configuration */
  sorting?: DataGridSortingConfig;
  /** Filtering configuration */
  filtering?: DataGridFilteringConfig;
  /** Styling configuration */
  styling?: DataGridStylingConfig;
  /** Virtualization configuration */
  virtualization?: DataGridVirtualizationConfig;
  /** Callback functions */
  callbacks?: DataGridCallbacks<T>;
  /** Loading state configuration */
  loading?: DataGridLoadingConfig;
  /** Empty state configuration */
  empty?: DataGridEmptyConfig;
  /** Error state configuration */
  error?: DataGridErrorConfig;
  /** Whether rows are expandable */
  expandable?: boolean;
}

