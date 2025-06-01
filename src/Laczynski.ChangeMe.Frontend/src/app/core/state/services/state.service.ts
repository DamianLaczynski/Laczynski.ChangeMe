import { Injectable, Signal, WritableSignal, signal } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { State, errorState, initialState, loadedState, loadingState } from '../models/state.model';
import { PaginationResult } from '@core/data-grid/models/pagination-result.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  /**
   * Creates a new data state signal
   * @returns WritableSignal with initial state
   */
  public createState<T>(): WritableSignal<State<T>> {
    return signal<State<T>>(initialState<T>());
  }

  /**
   * Handles data loading with state updates
   * @param state The state signal to update
   * @param loadFn The function that loads data
   * @returns Observable of the loaded data
   */
  public loadData<T>(state: WritableSignal<State<T>>, loadFn: Observable<T>): Observable<T> {
    // Set loading state
    state.update(currentState => loadingState(currentState));
    return loadFn.pipe(
      tap(data => {
        state.set(loadedState(data));
      }),
      catchError(error => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        state.set(errorState<T>(errorMessage));
        throw error;
      }),
    );
  }

  public appendData<K, T extends PaginationResult<K>>(
    state: WritableSignal<State<T>>,
    loadFn: Observable<T>,
  ): Observable<T> {
    state.update(currentState => loadingState(currentState));
    return loadFn.pipe(
      tap(data => {
        const newData = {
          ...data,
          items: [...(state().data?.items ?? []), ...data.items],
        };
        state.update(() => loadedState(newData));
      }),
      catchError(error => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        state.set(errorState<T>(errorMessage));
        throw error;
      }),
    );
  }

  /**
   * Checks if state is currently loading
   */
  public isLoading<T>(state: Signal<State<T>>): boolean {
    return state().isLoading;
  }

  /**
   * Checks if state has successfully loaded data
   */
  public isLoaded<T>(state: Signal<State<T>>): boolean {
    return (
      !state().isLoading &&
      !state().isError &&
      (state().data !== undefined || state().data === null)
    );
  }

  /**
   * Checks if state has an error
   */
  public isError<T>(state: Signal<State<T>>): boolean {
    return state().isError;
  }

  /**
   * Gets the data from state
   */
  public getData<T>(state: Signal<State<T>>): T | undefined {
    return state().data;
  }

  /**
   * Gets the error message from state
   */
  public getError<T>(state: Signal<State<T>>): string | undefined {
    return state().error;
  }
}
