/**
 * DataGrid Configuration Builder
 *
 * Provides a fluent API for building DataGrid configurations with validation.
 * Uses Builder Pattern for type-safe, readable configuration.
 *
 * @template T - The type of data items
 */

import {
  DataGridConfig,
  DataGridPaginationConfig,
  DataGridSortingConfig,
  DataGridFilteringConfig,
  DataGridStylingConfig,
  DataGridVirtualizationConfig,
  DataGridCallbacks,
  DataGridLoadingConfig,
  DataGridEmptyConfig,
  DataGridErrorConfig,
} from './data-grid-config.interface';
import { DataGridColumn, DataGridRow } from '../models/data-grid-column.model';
import { DataGridActiveFilter } from '../models/data-grid-filter.model';
import { DataGridDataSource } from '../data-sources/data-grid-data-source.interface';

/**
 * Builder for DataGrid configuration
 *
 * Provides a fluent API for building configurations with compile-time
 * and runtime validation.
 *
 * @example
 * ```typescript
 * const config = new DataGridConfigBuilder<User>()
 *   .withColumns(userColumns)
 *   .withDataSource(new ServerDataSource(repository))
 *   .withSelection('multi')
 *   .withPagination({ enabled: true, pageSize: 20 })
 *   .build();
 * ```
 */
export class DataGridConfigBuilder<T> {
  private config: Partial<DataGridConfig<T>> = {};

  /**
   * Sets the columns for the grid
   *
   * @param columns - Array of column definitions
   * @returns This builder instance for method chaining
   */
  withColumns(columns: DataGridColumn<T>[]): this {
    if (!columns || columns.length === 0) {
      throw new Error('DataGridConfigBuilder: columns array cannot be empty');
    }

    // Validate column IDs are unique
    const columnIds = columns.map(col => col.id);
    const uniqueIds = new Set(columnIds);
    if (columnIds.length !== uniqueIds.size) {
      throw new Error('DataGridConfigBuilder: column IDs must be unique');
    }

    this.config.columns = columns;
    return this;
  }

  /**
   * Sets the data source for the grid
   *
   * @param source - Data source implementation
   * @returns This builder instance for method chaining
   */
  withDataSource(source: DataGridDataSource<T>): this {
    if (!source) {
      throw new Error('DataGridConfigBuilder: dataSource cannot be null or undefined');
    }

    this.config.dataSource = source;
    return this;
  }

  /**
   * Sets the selection mode
   *
   * @param mode - Selection mode ('none', 'single', or 'multi')
   * @returns This builder instance for method chaining
   */
  withSelection(mode: 'none' | 'single' | 'multi'): this {
    this.config.selection = mode;
    return this;
  }

  /**
   * Sets pagination configuration
   *
   * @param config - Pagination configuration
   * @returns This builder instance for method chaining
   */
  withPagination(config: DataGridPaginationConfig): this {
    if (config.enabled) {
      if (config.pageSize != null && config.pageSize <= 0) {
        throw new Error('DataGridConfigBuilder: pageSize must be greater than 0');
      }

      if (config.pageSizeOptions) {
        if (config.pageSizeOptions.length === 0) {
          throw new Error(
            'DataGridConfigBuilder: pageSizeOptions cannot be empty when pagination is enabled',
          );
        }

        if (config.pageSizeOptions.some(size => size <= 0)) {
          throw new Error('DataGridConfigBuilder: all pageSizeOptions must be greater than 0');
        }

        if (config.pageSize && !config.pageSizeOptions.includes(config.pageSize)) {
          throw new Error('DataGridConfigBuilder: pageSize must be one of the pageSizeOptions');
        }
      }
    }

    this.config.pagination = config;
    return this;
  }

  /**
   * Sets sorting configuration
   *
   * @param config - Sorting configuration
   * @returns This builder instance for method chaining
   */
  withSorting(config: DataGridSortingConfig): this {
    if (config.enabled && config.defaultSort) {
      if (!config.defaultSort.field) {
        throw new Error('DataGridConfigBuilder: defaultSort.field is required');
      }

      if (!['asc', 'desc'].includes(config.defaultSort.direction)) {
        throw new Error('DataGridConfigBuilder: defaultSort.direction must be "asc" or "desc"');
      }
    }

    this.config.sorting = config;
    return this;
  }

  /**
   * Sets filtering configuration
   *
   * @param config - Filtering configuration
   * @returns This builder instance for method chaining
   */
  withFiltering(config: DataGridFilteringConfig): this {
    if (config.debounceMs != null && config.debounceMs < 0) {
      throw new Error('DataGridConfigBuilder: debounceMs must be non-negative');
    }

    this.config.filtering = config;
    return this;
  }

  /**
   * Sets styling configuration
   *
   * @param config - Styling configuration
   * @returns This builder instance for method chaining
   */
  withStyling(config: DataGridStylingConfig): this {
    if (config.size && !['small', 'medium', 'large'].includes(config.size)) {
      throw new Error('DataGridConfigBuilder: size must be "small", "medium", or "large"');
    }

    this.config.styling = config;
    return this;
  }

  /**
   * Sets virtualization configuration
   *
   * @param config - Virtualization configuration
   * @returns This builder instance for method chaining
   */
  withVirtualization(config: DataGridVirtualizationConfig): this {
    if (config.enabled) {
      if (config.itemHeight != null && config.itemHeight <= 0) {
        throw new Error('DataGridConfigBuilder: itemHeight must be greater than 0');
      }

      if (config.bufferSize != null && config.bufferSize < 0) {
        throw new Error('DataGridConfigBuilder: bufferSize must be non-negative');
      }
    }

    this.config.virtualization = config;
    return this;
  }

  /**
   * Sets callback functions
   *
   * @param callbacks - Callback functions
   * @returns This builder instance for method chaining
   */
  withCallbacks(callbacks: DataGridCallbacks<T>): this {
    this.config.callbacks = callbacks;
    return this;
  }

  /**
   * Sets loading state configuration
   *
   * @param config - Loading configuration
   * @returns This builder instance for method chaining
   */
  withLoading(config: DataGridLoadingConfig): this {
    this.config.loading = config;
    return this;
  }

  /**
   * Sets empty state configuration
   *
   * @param config - Empty state configuration
   * @returns This builder instance for method chaining
   */
  withEmpty(config: DataGridEmptyConfig): this {
    this.config.empty = config;
    return this;
  }

  /**
   * Sets error state configuration
   *
   * @param config - Error state configuration
   * @returns This builder instance for method chaining
   */
  withError(config: DataGridErrorConfig): this {
    this.config.error = config;
    return this;
  }

  /**
   * Sets whether rows are expandable
   *
   * @param expandable - Whether rows are expandable
   * @returns This builder instance for method chaining
   */
  withExpandable(expandable: boolean): this {
    this.config.expandable = expandable;
    return this;
  }

  // Convenience methods for individual callbacks

  /**
   * Sets the row click callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onRowClick(callback: (row: DataGridRow<T>) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onRowClick = callback;
    return this;
  }

  /**
   * Sets the row select callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onRowSelect(callback: (row: DataGridRow<T>) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onRowSelect = callback;
    return this;
  }

  /**
   * Sets the selection change callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onSelectionChange(callback: (rows: DataGridRow<T>[]) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onSelectionChange = callback;
    return this;
  }

  /**
   * Sets the sort change callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onSortChange(callback: (sort: { field: string; direction: 'asc' | 'desc' }) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onSortChange = callback;
    return this;
  }

  /**
   * Sets the filter change callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onFilterChange(callback: (filters: DataGridActiveFilter[]) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onFilterChange = callback;
    return this;
  }

  /**
   * Sets the page change callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onPageChange(callback: (page: number) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onPageChange = callback;
    return this;
  }

  /**
   * Sets the page size change callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onPageSizeChange(callback: (size: number) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onPageSizeChange = callback;
    return this;
  }

  /**
   * Sets the row expand callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onRowExpand(callback: (row: DataGridRow<T>) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onRowExpand = callback;
    return this;
  }

  /**
   * Sets the row collapse callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onRowCollapse(callback: (row: DataGridRow<T>) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onRowCollapse = callback;
    return this;
  }

  /**
   * Sets the cell click callback
   *
   * @param callback - Callback function
   * @returns This builder instance for method chaining
   */
  onCellClick(callback: (row: DataGridRow<T>, column: DataGridColumn<T>) => void): this {
    if (!this.config.callbacks) {
      this.config.callbacks = {};
    }
    this.config.callbacks.onCellClick = callback;
    return this;
  }

  /**
   * Builds and validates the final configuration
   *
   * @returns Complete DataGrid configuration
   * @throws Error if configuration is invalid
   */
  build(): DataGridConfig<T> {
    this.validate();
    return this.config as DataGridConfig<T>;
  }

  /**
   * Validates the configuration
   *
   * @throws Error if configuration is invalid
   */
  private validate(): void {
    // Required fields
    if (!this.config.columns || this.config.columns.length === 0) {
      throw new Error('DataGridConfigBuilder: columns are required');
    }

    if (!this.config.dataSource) {
      throw new Error('DataGridConfigBuilder: dataSource is required');
    }

    // Validate default sort field exists in columns
    if (this.config.sorting?.enabled && this.config.sorting.defaultSort) {
      const fieldExists = this.config.columns.some(
        col => col.field === this.config.sorting!.defaultSort!.field,
      );
      if (!fieldExists) {
        throw new Error(
          `DataGridConfigBuilder: defaultSort.field "${this.config.sorting.defaultSort.field}" does not exist in columns`,
        );
      }
    }
  }
}
