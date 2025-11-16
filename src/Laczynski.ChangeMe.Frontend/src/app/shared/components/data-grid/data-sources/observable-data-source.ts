/**
 * Observable Data Source Implementation
 *
 * Provides data from an Observable stream. Useful for reactive data sources
 * like WebSocket connections, SignalR, or other real-time data streams.
 *
 * @template T - The type of data items
 */

import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataGridDataSource, DataGridQueryParams } from './data-grid-data-source.interface';
import { DataGridAdapter, DefaultDataGridAdapter } from '../adapters';
import { DataGridRow } from '../models/data-grid-column.model';

/**
 * Observable-based data source for DataGrid
 *
 * Use this for reactive data sources like WebSocket connections,
 * SignalR hubs, or any Observable that emits data arrays.
 *
 * @example
 * ```typescript
 * const data$ = this.signalRService.onDataReceived$;
 * const dataSource = new ObservableDataSource(data$);
 * ```
 */
export class ObservableDataSource<T> implements DataGridDataSource<T> {
  private dataSubject = new BehaviorSubject<DataGridRow<T>[]>([]);
  private subscription?: Subscription;
  private allRows: DataGridRow<T>[] = [];

  /**
   * Creates a new ObservableDataSource instance
   *
   * @param data$ - Observable that emits arrays of data items
   * @param adapter - Optional adapter to transform raw data to DataGridRow format
   */
  constructor(
    private data$: Observable<T[]>,
    private adapter?: DataGridAdapter<T, T>,
  ) {
    // Auto-connect on construction
    this.connect();
  }

  /**
   * @inheritdoc
   */
  connect(): Observable<DataGridRow<T>[]> {
    if (!this.subscription || this.subscription.closed) {
      this.subscription = this.data$
        .pipe(
          map(data => {
            this.allRows = data.map(item =>
              this.adapter
                ? this.adapter.adapt(item)
                : new DefaultDataGridAdapter<any>().adapt(item),
            );
            return this.allRows;
          }),
        )
        .subscribe({
          next: rows => {
            this.dataSubject.next(rows);
          },
          error: error => {
            console.error('ObservableDataSource error:', error);
            this.dataSubject.error(error);
          },
        });
    }
    return this.dataSubject.asObservable();
  }

  /**
   * @inheritdoc
   */
  disconnect(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    // Don't complete the subject - allow reconnect
    // Completing would prevent re-subscribing to the same data source
  }

  /**
   * @inheritdoc
   */
  refresh(): void {
    // For Observable sources, refresh doesn't make sense as data comes automatically
    // But we can re-subscribe if needed
    if (this.subscription?.closed) {
      this.connect();
    }
  }

  /**
   * @inheritdoc
   */
  getTotalCount(): Observable<number> {
    return this.dataSubject.pipe(map(rows => rows.length));
  }

  /**
   * @inheritdoc
   */
  isLoading(): Observable<boolean> {
    // Observable sources typically don't have explicit loading states
    // The component should handle loading based on whether data has been received
    return of(false);
  }

  /**
   * @inheritdoc
   */
  getError(): Observable<string | null> {
    // Errors are handled through the Observable error channel
    return of(null);
  }

  /**
   * @inheritdoc
   */
  setQueryParams(params: DataGridQueryParams): void {
    // For Observable sources, query params are typically handled by the source Observable
    // This is a no-op, but could be extended to filter/sort client-side if needed
    // For server-side filtering with Observable, the Observable itself should handle it
  }
}
