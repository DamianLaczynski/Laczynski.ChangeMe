/**
 * DataGrid Presets
 *
 * Provides pre-configured DataGrid setups for common use cases.
 * Reduces boilerplate and ensures consistency across the application.
 */

import { DataGridConfig } from './data-grid-config.interface';
import { DataGridColumn } from '../models/data-grid-column.model';
import { DataGridDataSource, StaticDataSource, ServerDataSource } from '../data-sources';
import { DataGridRepository } from '../repositories/data-grid-repository.interface';
import { DataGridAdapter } from '../adapters/data-grid-adapter.interface';
import { DataGridConfigBuilder } from './data-grid-config.builder';

/**
 * Predefined DataGrid configurations
 *
 * Provides ready-to-use configurations for common scenarios,
 * reducing boilerplate code significantly.
 */
export class DataGridPresets {
  /**
   * Simple grid configuration
   *
   * Use for basic display of static data without pagination, sorting, or filtering.
   * Perfect for small datasets that are already loaded in memory.
   *
   * @template T - The type of data items
   * @param columns - Column definitions
   * @param data - Array of data items
   * @param adapter - Optional adapter for data transformation
   * @returns Complete DataGrid configuration
   *
   * @example
   * ```typescript
   * const config = DataGridPresets.simple(columns, users);
   * ```
   */
  static simple<T>(
    columns: DataGridColumn<T>[],
    data: T[],
    adapter?: DataGridAdapter<T, T>
  ): DataGridConfig<T> {
    return new DataGridConfigBuilder<T>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(data, adapter))
      .withSelection('none')
      .withStyling({
        size: 'medium',
        hoverable: true,
      })
      .build();
  }

  /**
   * Server-side grid configuration
   *
   * Use for data that needs to be fetched from a server/API.
   * Includes pagination, sorting, and filtering - all handled server-side.
   * Perfect for large datasets or when you need real-time data.
   *
   * @template T - The type of data items
   * @param columns - Column definitions
   * @param repository - Repository for fetching data
   * @param adapter - Optional adapter for data transformation
   * @returns Complete DataGrid configuration
   *
   * @example
   * ```typescript
   * const repository = new ApiDataGridRepository<User>(httpService, 'users');
   * const config = DataGridPresets.serverSide(columns, repository);
   * ```
   */
  static serverSide<T>(
    columns: DataGridColumn<T>[],
    repository: DataGridRepository<T>,
    adapter?: DataGridAdapter<T>
  ): DataGridConfig<T> {
    return new DataGridConfigBuilder<T>()
      .withColumns(columns)
      .withDataSource(new ServerDataSource(repository, adapter))
      .withSelection('multi')
      .withPagination({
        enabled: true,
        pageSize: 20,
        pageSizeOptions: [10, 20, 50, 100],
        showPageSizeSelector: true,
        showPageNumbers: true,
        showInfo: false,
      })
      .withSorting({
        enabled: true,
      })
      .withFiltering({
        enabled: true,
        debounceMs: 300,
      })
      .withStyling({
        size: 'medium',
        striped: true,
        hoverable: true,
        stickyHeaders: true,
      })
      .build();
  }

  /**
   * Virtualized grid configuration
   *
   * Use for large datasets that need to be displayed efficiently.
   * Only visible rows are rendered, providing excellent performance
   * even with thousands of rows.
   *
   * @template T - The type of data items
   * @param columns - Column definitions
   * @param data - Array of data items
   * @param adapter - Optional adapter for data transformation
   * @returns Complete DataGrid configuration
   *
   * @example
   * ```typescript
   * const config = DataGridPresets.virtualized(columns, largeDataset);
   * ```
   */
  static virtualized<T>(
    columns: DataGridColumn<T>[],
    data: T[],
    adapter?: DataGridAdapter<T, T>
  ): DataGridConfig<T> {
    return new DataGridConfigBuilder<T>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(data, adapter))
      .withSelection('multi')
      .withVirtualization({
        enabled: true,
        itemHeight: 48,
        bufferSize: 3,
      })
      .withStyling({
        size: 'medium',
        striped: true,
        hoverable: true,
        stickyHeaders: true,
      })
      .build();
  }

  /**
   * Read-only grid configuration
   *
   * Use for displaying data that users cannot interact with.
   * No selection, no hover effects - just pure data display.
   *
   * @template T - The type of data items
   * @param columns - Column definitions
   * @param data - Array of data items
   * @param adapter - Optional adapter for data transformation
   * @returns Complete DataGrid configuration
   *
   * @example
   * ```typescript
   * const config = DataGridPresets.readOnly(columns, reportData);
   * ```
   */
  static readOnly<T>(
    columns: DataGridColumn<T>[],
    data: T[],
    adapter?: DataGridAdapter<T, T>
  ): DataGridConfig<T> {
    return new DataGridConfigBuilder<T>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(data, adapter))
      .withSelection('none')
      .withStyling({
        size: 'medium',
        hoverable: false,
      })
      .build();
  }

  /**
   * Editable grid configuration
   *
   * Use for grids where users can select and interact with rows.
   * Includes multi-selection and expandable rows for detailed views.
   *
   * @template T - The type of data items
   * @param columns - Column definitions
   * @param data - Array of data items
   * @param adapter - Optional adapter for data transformation
   * @returns Complete DataGrid configuration
   *
   * @example
   * ```typescript
   * const config = DataGridPresets.editable(columns, items);
   * ```
   */
  static editable<T>(
    columns: DataGridColumn<T>[],
    data: T[],
    adapter?: DataGridAdapter<T, T>
  ): DataGridConfig<T> {
    return new DataGridConfigBuilder<T>()
      .withColumns(columns)
      .withDataSource(new StaticDataSource(data, adapter))
      .withSelection('multi')
      .withExpandable(true)
      .withStyling({
        size: 'medium',
        striped: true,
        hoverable: true,
        bordered: true,
      })
      .build();
  }
}

