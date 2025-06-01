import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { StateService } from './state.service';
import { State, initialState, loadedState, loadingState, errorState } from '../models/state.model';
import { signal } from '@angular/core';

describe('StateService', () => {
  let service: StateService;

  interface TestData {
    id: number;
    name: string;
  }

  const testData: TestData = {
    id: 1,
    name: 'Test Data',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createState', () => {
    it('should create a new WritableSignal with initial state', () => {
      const state = service.createState<TestData>();

      expect(state).toBeDefined();
      expect(state()).toEqual(initialState<TestData>());
    });
  });

  describe('loadData', () => {
    it('should update state to loading then loaded when data fetching is successful', done => {
      const state = signal<State<TestData>>(initialState<TestData>());
      const loadFn = of(testData);

      const stateValues: State<TestData>[] = [];
      // Capture initial state
      stateValues.push({ ...state() });

      // Start loading data
      const loadingObservable = service.loadData(state, loadFn);

      // Capture loading state (right after loadData call but before resolution)
      stateValues.push({ ...state() });

      // Subscribe to loading observable
      loadingObservable.subscribe({
        next: data => {
          // Capture final state
          stateValues.push({ ...state() });

          expect(data).toEqual(testData);

          // We should have captured 3 state values: initial, loading, and loaded
          expect(stateValues.length).toBe(3);

          // Check initial state
          expect(stateValues[0].isInitial).toBe(true);
          expect(stateValues[0].isLoading).toBe(false);

          // Check loading state
          expect(stateValues[1].isLoading).toBe(true);

          // Check loaded state
          expect(stateValues[2].isLoading).toBe(false);
          expect(stateValues[2].isError).toBe(false);
          expect(stateValues[2].data).toEqual(testData);

          done();
        },
        error: error => {
          fail('Should not have thrown an error: ' + error);
          done();
        },
      });
    });

    it('should update state to error when data fetching fails', done => {
      const state = signal<State<TestData>>(initialState<TestData>());
      const errorMessage = 'Network error';
      const loadFn = throwError(() => new Error(errorMessage));

      const stateValues: State<TestData>[] = [];
      // Capture initial state
      stateValues.push({ ...state() });

      // Start loading data
      const loadingObservable = service.loadData(state, loadFn);

      // Capture loading state
      stateValues.push({ ...state() });

      // Subscribe to loading observable
      loadingObservable.subscribe({
        next: () => {
          fail('Should have thrown an error');
          done();
        },
        error: error => {
          // Capture error state
          stateValues.push({ ...state() });

          expect((error as Error).message).toEqual(errorMessage);

          // We should have captured 3 state values: initial, loading, and error
          expect(stateValues.length).toBe(3);

          // Check initial state
          expect(stateValues[0].isInitial).toBe(true);
          expect(stateValues[0].isLoading).toBe(false);

          // Check loading state
          expect(stateValues[1].isLoading).toBe(true);

          // Check error state
          expect(stateValues[2].isLoading).toBe(false);
          expect(stateValues[2].isError).toBe(true);
          expect(stateValues[2].error).toEqual(errorMessage);

          done();
        },
      });
    });

    it('should handle error with no message', done => {
      const state = signal<State<TestData>>(initialState<TestData>());
      const loadFn = throwError(() => ({})); // Error with no message property

      service.loadData(state, loadFn).subscribe({
        next: () => {
          fail('Should have thrown an error');
          done();
        },
        error: () => {
          const finalState = state();
          expect(finalState.isError).toBe(true);
          expect(finalState.error).toEqual('Unknown error occurred');
          done();
        },
      });
    });

    it('should maintain initial state flag when transitioning from initial to loading', done => {
      const state = signal<State<TestData>>(initialState<TestData>());
      const loadFn = of(testData);

      service.loadData(state, loadFn).subscribe({
        next: () => {
          const finalState = state();
          // Final state should no longer be initial
          expect(finalState.isInitial).toBe(false);
          done();
        },
        error: error => {
          fail('Should not have thrown an error: ' + error);
          done();
        },
      });
    });
  });

  describe('state helper methods', () => {
    it('isLoading should return true when state is loading', () => {
      const loadingStateValue = signal(loadingState(initialState<TestData>()));
      const initialStateSignal = signal(initialState<TestData>());

      expect(service.isLoading(loadingStateValue)).toBe(true);
      expect(service.isLoading(initialStateSignal)).toBe(false);
    });

    it('isLoaded should return true when state has data and is not loading', () => {
      const loadedStateSignal = signal(loadedState<TestData>(testData));
      const loadingStateSignal = signal(loadingState(loadedState<TestData>(testData)));
      const initialStateSignal = signal(initialState<TestData>());

      expect(service.isLoaded(loadedStateSignal)).toBe(true);
      expect(service.isLoaded(loadingStateSignal)).toBe(false);
      expect(service.isLoaded(initialStateSignal)).toBe(false);
    });

    it('isError should return true when state has an error', () => {
      const errorStateSignal = signal(errorState<TestData>('Error message'));
      const initialStateSignal = signal(initialState<TestData>());

      expect(service.isError(errorStateSignal)).toBe(true);
      expect(service.isError(initialStateSignal)).toBe(false);
    });

    it('getData should return data when available', () => {
      const loadedStateSignal = signal(loadedState<TestData>(testData));
      const initialStateSignal = signal(initialState<TestData>());

      expect(service.getData(loadedStateSignal)).toEqual(testData);
      expect(service.getData(initialStateSignal)).toBeUndefined();
    });

    it('getError should return error message when available', () => {
      const errorMessage = 'Test error';
      const errorStateSignal = signal(errorState<TestData>(errorMessage));
      const initialStateSignal = signal(initialState<TestData>());

      expect(service.getError(errorStateSignal)).toEqual(errorMessage);
      expect(service.getError(initialStateSignal)).toBeUndefined();
    });

    it('should handle null data in getData method', () => {
      const nullDataState = signal<State<TestData | null>>(loadedState<TestData | null>(null));
      expect(service.getData(nullDataState)).toBeNull();
    });

    it('should handle edge cases in isLoaded method', () => {
      // Data is null (should be considered loaded)
      const nullDataState = signal<State<TestData | null>>(loadedState<TestData | null>(null));
      expect(service.isLoaded(nullDataState)).toBe(true);

      // Data is undefined but not loading (should not be considered loaded)
      const notLoadedState = signal<State<TestData>>({
        isInitial: false,
        isLoading: false,
        isError: false,
        data: undefined,
      });
      expect(service.isLoaded(notLoadedState)).toBe(false);
    });
  });
});
