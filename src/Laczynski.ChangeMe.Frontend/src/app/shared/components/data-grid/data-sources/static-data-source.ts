/**
 * Static Data Source Implementation
 *
 * Provides data from an in-memory array. Supports client-side filtering,
 * sorting, and pagination.
 *
 * @template T - The type of data items
 */

import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataGridDataSource, DataGridQueryParams } from './data-grid-data-source.interface';
import { DataGridRow } from '../models/data-grid-column.model';
import { DataGridActiveFilter } from '../models/data-grid-filter.model';
import { DataGridAdapter } from '../adapters/data-grid-adapter.interface';
import { DefaultDataGridAdapter } from '../adapters/default-data-grid-adapter';

/**
 * Static data source for DataGrid
 *
 * Use this for data that is already loaded in memory and doesn't require
 * server-side processing. All filtering, sorting, and pagination is done
 * client-side.
 *
 * @example
 * ```typescript
 * const data = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const dataSource = new StaticDataSource(data);
 * ```
 */
export class StaticDataSource<T> implements DataGridDataSource<T> {
  private dataSubject = new BehaviorSubject<DataGridRow<T>[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private queryParams: DataGridQueryParams = {};
  private allRows: DataGridRow<T>[] = [];

  /**
   * Creates a new StaticDataSource instance
   *
   * @param rawData - Array of raw data items
   * @param adapter - Optional adapter to transform raw data to DataGridRow format
   */
  constructor(
    private rawData: T[],
    private adapter?: DataGridAdapter<T, T>,
  ) {
    this.initializeData();
    // Load initial data immediately
    this.loadData();
  }

  /**
   * @inheritdoc
   */
  connect(): Observable<DataGridRow<T>[]> {
    // Ensure data is loaded when connecting
    if (this.dataSubject.value.length === 0 && this.allRows.length > 0) {
      this.loadData();
    }
    return this.dataSubject.asObservable();
  }

  /**
   * @inheritdoc
   */
  disconnect(): void {
    // Don't complete subjects - allow reconnection
    // Subscriptions will be cleaned up by the component
  }

  /**
   * @inheritdoc
   */
  refresh(): void {
    this.initializeData();
    this.loadData();
  }

  /**
   * @inheritdoc
   */
  getTotalCount(): Observable<number> {
    return of(this.allRows.length);
  }

  /**
   * @inheritdoc
   */
  isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  /**
   * @inheritdoc
   */
  getError(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  /**
   * @inheritdoc
   */
  setQueryParams(params: DataGridQueryParams): void {
    this.queryParams = { ...this.queryParams, ...params };
    this.loadData();
  }

  /**
   * Updates the raw data array
   *
   * Useful when data changes after initialization.
   *
   * @param newData - New array of raw data items
   */
  updateData(newData: T[]): void {
    this.rawData = newData;
    this.refresh();
  }

  /**
   * Initializes data by converting raw data to DataGridRow format
   */
  private initializeData(): void {
    try {
      this.allRows = this.rawData.map(item =>
        this.adapter ? this.adapter.adapt(item) : new DefaultDataGridAdapter<any>().adapt(item),
      );
    } catch (error) {
      this.errorSubject.next(error instanceof Error ? error.message : 'Failed to initialize data');
    }
  }

  /**
   * Loads and applies filters, sorting, and pagination
   */
  private loadData(): void {
    // Don't show loading for initial load if data is already available
    const isInitialLoad = this.dataSubject.value.length === 0;
    if (!isInitialLoad) {
      this.loadingSubject.next(true);
    }
    this.errorSubject.next(null);

    try {
      let rows = [...this.allRows];

      // Apply filters
      if (this.queryParams.filters && this.queryParams.filters.length > 0) {
        rows = this.applyFilters(rows, this.queryParams.filters);
      }

      // Apply sorting
      if (this.queryParams.sort) {
        rows = this.applySort(rows, this.queryParams.sort);
      }

      // Apply pagination
      if (this.queryParams.page && this.queryParams.pageSize) {
        rows = this.applyPagination(rows, this.queryParams.page, this.queryParams.pageSize);
      }

      this.dataSubject.next(rows);
      if (!isInitialLoad) {
        this.loadingSubject.next(false);
      }
    } catch (error) {
      this.errorSubject.next(error instanceof Error ? error.message : 'Unknown error occurred');
      this.loadingSubject.next(false);
    }
  }

  /**
   * Applies filters to rows
   */
  private applyFilters(rows: DataGridRow<T>[], filters: DataGridActiveFilter[]): DataGridRow<T>[] {
    return rows.filter(row => {
      return filters.every(filter => {
        // Use field if available (preferred), otherwise fallback to columnId for backward compatibility
        const fieldName = filter.field || filter.columnId;
        const value = (row.data as any)[fieldName];
        const filterValue = filter.filter;

        // Simple contains filter for now
        // In production, this should use FilterStrategy from filter service
        if (filterValue.value != null) {
          const searchValue = filterValue.value.toString().toLowerCase();
          const cellValue = value?.toString().toLowerCase() || '';
          return cellValue.includes(searchValue);
        }

        return true;
      });
    });
  }

  /**
   * Applies sorting to rows
   */
  private applySort(
    rows: DataGridRow<T>[],
    sort: { field: string; direction: 'asc' | 'desc' },
  ): DataGridRow<T>[] {
    return [...rows].sort((a, b) => {
      const aVal = (a.data as any)[sort.field];
      const bVal = (b.data as any)[sort.field];

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Applies pagination to rows
   */
  private applyPagination(
    rows: DataGridRow<T>[],
    page: number,
    pageSize: number,
  ): DataGridRow<T>[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }
}
