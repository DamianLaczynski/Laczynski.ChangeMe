import { State } from '@core/state';
import { PaginationResult } from './pagination-result.model';
import { Observable } from 'rxjs';
import { PaginationParameters } from './pagination-parameters.model';
import { Signal } from '@angular/core';
/**
 * Base configuration for data grid components
 */
export interface DataGridBaseConfig<T, P extends PaginationParameters = PaginationParameters> {
  /** State of the data grid */
  state: Signal<State<PaginationResult<T>>>;

  /** Whether to show empty state when there are no items */
  showEmptyState?: boolean;

  /** Empty state message */
  emptyStateMessage?: string;

  /** Empty state icon */
  emptyStateIcon?: string;

  /** Whether to use server-side sorting */
  serverSideSorting?: boolean;

  /** Callback for loading more data */
  dataSource: (params: P) => Observable<PaginationResult<T>>;

  /** Pagination parameters */
  params: P;
}
