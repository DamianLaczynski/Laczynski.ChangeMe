/**
 * Server Data Source Implementation
 *
 * Provides data from a server/API using a repository pattern.
 * All filtering, sorting, and pagination is done server-side.
 *
 * @template T - The type of data items
 */

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataGridDataSource, DataGridQueryParams } from './data-grid-data-source.interface';
import { DataGridRow } from '../models/data-grid-column.model';
import { DataGridRepository } from '../repositories/data-grid-repository.interface';
import { DataGridAdapter } from '../adapters/data-grid-adapter.interface';
import { DefaultDataGridAdapter } from '../adapters/default-data-grid-adapter';

/**
 * Server-side data source for DataGrid
 *
 * Use this for data that needs to be fetched from a server/API.
 * All filtering, sorting, and pagination is handled server-side,
 * which is more efficient for large datasets.
 *
 * @example
 * ```typescript
 * const repository = new ApiDataGridRepository<User>('users');
 * const dataSource = new ServerDataSource(repository);
 * ```
 */
export class ServerDataSource<T> implements DataGridDataSource<T> {
  private dataSubject = new BehaviorSubject<DataGridRow<T>[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private totalCountSubject = new BehaviorSubject<number>(0);
  private queryParams: DataGridQueryParams = {};

  /**
   * Creates a new ServerDataSource instance
   *
   * @param repository - Repository for fetching data
   * @param adapter - Optional adapter to transform raw data to DataGridRow format
   */
  constructor(
    private repository: DataGridRepository<T>,
    private adapter?: DataGridAdapter<T>,
  ) {}

  /**
   * @inheritdoc
   */
  connect(): Observable<DataGridRow<T>[]> {
    // Load data on first connect
    if (this.dataSubject.value.length === 0 && !this.loadingSubject.value) {
      this.loadData();
    }
    return this.dataSubject.asObservable();
  }

  /**
   * @inheritdoc
   */
  disconnect(): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this.errorSubject.complete();
    this.totalCountSubject.complete();
  }

  /**
   * @inheritdoc
   */
  refresh(): void {
    this.loadData();
  }

  /**
   * @inheritdoc
   */
  getTotalCount(): Observable<number> {
    return this.totalCountSubject.asObservable();
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
   * Loads data from the repository
   */
  private loadData(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.repository
      .findAll(this.queryParams)
      .pipe(
        catchError(error => {
          const errorMessage =
            error?.message || error?.error?.message || 'Failed to load data from server';
          this.errorSubject.next(errorMessage);
          this.loadingSubject.next(false);
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: result => {
          const rows = result.data.map(item =>
            this.adapter ? this.adapter.adapt(item) : new DefaultDataGridAdapter<any>().adapt(item),
          );
          this.dataSubject.next(rows);
          this.totalCountSubject.next(result.totalCount);
          this.loadingSubject.next(false);
        },
        error: () => {
          // Error already handled in catchError
          this.loadingSubject.next(false);
        },
      });
  }
}
