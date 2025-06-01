/**
 * Generic interface for data state
 */
export interface State<T> {
  isInitial: boolean;
  isLoading: boolean;
  isError: boolean;
  data?: T;
  error?: string;
}

/**
 * Creates an initial state object
 */
export function initialState<T>(): State<T> {
  return {
    isInitial: true,
    isLoading: false,
    isError: false,
  };
}

/**
 * Creates a loading state object
 */
export function loadingState<T>(currentState: State<T>): State<T> {
  return {
    ...currentState,
    isLoading: true,
  };
}

/**
 * Creates a loaded state object with data
 */
export function loadedState<T>(data: T): State<T> {
  return {
    isInitial: false,
    isLoading: false,
    isError: false,
    data,
  };
}

/**
 * Creates an error state object
 */
export function errorState<T>(error: string): State<T> {
  return {
    isInitial: false,
    isLoading: false,
    isError: true,
    error,
  };
}
