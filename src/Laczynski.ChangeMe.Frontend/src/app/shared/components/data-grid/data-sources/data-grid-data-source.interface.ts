/**
 * Data Source Pattern for DataGrid Component
 *
 * Provides a unified interface for different data sources (static, server, observable)
 * Inspired by Material Design CDK Table DataSource pattern
 *
 * @template T - The type of data items
 */

import { Observable } from 'rxjs';
import { DataGridRow } from '../models/data-grid-column.model';
import { DataGridActiveFilter } from '../models/data-grid-filter.model';

/**
 * Query parameters for data source operations
 */
export interface DataGridQueryParams {
  /** Current page number (1-based) */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Sort configuration */
  sort?: {
    /** Field name to sort by */
    field: string;
    /** Sort direction */
    direction: 'asc' | 'desc';
  };
  /** Active filters */
  filters?: DataGridActiveFilter[];
}

/**
 * Interface for DataGrid data sources
 *
 * This interface provides a unified way to connect different data sources
 * to the DataGrid component, enabling easy switching between static data,
 * server-side data, and observable streams.
 *
 * @template T - The type of data items
 */
export interface DataGridDataSource<T> {
  /**
   * Connects to the data source and returns an Observable of data rows
   *
   * The Observable should emit whenever the data changes.
   * The component will automatically subscribe and unsubscribe.
   *
   * @returns Observable that emits arrays of DataGridRow<T>
   */
  connect(): Observable<DataGridRow<T>[]>;

  /**
   * Disconnects from the data source
   *
   * Called when the component is destroyed or the data source is replaced.
   * Should clean up any subscriptions, timers, or other resources.
   */
  disconnect(): void;

  /**
   * Refreshes the data from the source
   *
   * Forces a reload of data. Useful for manual refresh scenarios.
   */
  refresh(): void;

  /**
   * Gets the total count of items (for pagination)
   *
   * For server-side sources, this should return the total count from the server.
   * For static sources, this should return the total count of all items.
   *
   * @returns Observable that emits the total count
   */
  getTotalCount(): Observable<number>;

  /**
   * Checks if data is currently being loaded
   *
   * @returns Observable that emits loading state (true when loading, false when done)
   */
  isLoading(): Observable<boolean>;

  /**
   * Gets any error that occurred during data loading
   *
   * @returns Observable that emits error message or null if no error
   */
  getError(): Observable<string | null>;

  /**
   * Sets query parameters (sort, filter, pagination)
   *
   * This method is called by the component when user interacts with sorting,
   * filtering, or pagination controls.
   *
   * @param params - Query parameters to apply
   */
  setQueryParams(params: DataGridQueryParams): void;
}
