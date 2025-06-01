import { State, initialState, loadingState, loadedState, errorState } from './state.model';

describe('State Models', () => {
  interface TestData {
    id: number;
    name: string;
  }

  const testData: TestData = {
    id: 1,
    name: 'Test',
  };

  describe('initialState', () => {
    it('should create an initial state object', () => {
      const state = initialState<TestData>();

      expect(state.isInitial).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.isError).toBe(false);
      expect(state.data).toBeUndefined();
      expect(state.error).toBeUndefined();
    });
  });

  describe('loadingState', () => {
    it('should create a loading state from an initial state', () => {
      const initial = initialState<TestData>();
      const loading = loadingState(initial);

      expect(loading.isInitial).toBe(true);
      expect(loading.isLoading).toBe(true);
      expect(loading.isError).toBe(false);
      expect(loading.data).toBeUndefined();
      expect(loading.error).toBeUndefined();
    });

    it('should preserve existing data when transitioning to loading', () => {
      const existingState: State<TestData> = {
        isInitial: false,
        isLoading: false,
        isError: false,
        data: testData,
      };

      const loading = loadingState(existingState);

      expect(loading.isInitial).toBe(false);
      expect(loading.isLoading).toBe(true);
      expect(loading.isError).toBe(false);
      expect(loading.data).toEqual(testData);
      expect(loading.error).toBeUndefined();
    });
  });

  describe('loadedState', () => {
    it('should create a loaded state with data', () => {
      const loaded = loadedState<TestData>(testData);

      expect(loaded.isInitial).toBe(false);
      expect(loaded.isLoading).toBe(false);
      expect(loaded.isError).toBe(false);
      expect(loaded.data).toEqual(testData);
      expect(loaded.error).toBeUndefined();
    });

    it('should handle null data', () => {
      const loaded = loadedState<TestData | null>(null);

      expect(loaded.isInitial).toBe(false);
      expect(loaded.isLoading).toBe(false);
      expect(loaded.isError).toBe(false);
      expect(loaded.data).toBeNull();
      expect(loaded.error).toBeUndefined();
    });
  });

  describe('errorState', () => {
    it('should create an error state with an error message', () => {
      const errorMessage = 'Test error message';
      const error = errorState<TestData>(errorMessage);

      expect(error.isInitial).toBe(false);
      expect(error.isLoading).toBe(false);
      expect(error.isError).toBe(true);
      expect(error.data).toBeUndefined();
      expect(error.error).toBe(errorMessage);
    });
  });
});
