import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { initialState, loadedState, loadingState, errorState } from '../../models/state.model';
import { StateContainerComponent } from './state-container.component';

// Mock the LoadingIndicatorComponent since it's an external dependency
@Component({
  selector: 'app-loading-indicator',

  imports: [CommonModule],
  template: '<div class="loading-indicator">{{ message }}</div>',
})
class MockLoadingIndicatorComponent {
  message = '';
}

// Test host component to test content projection
@Component({
  selector: 'app-test-host',

  imports: [StateContainerComponent, CommonModule],
  template: `
    <app-state-container
      [$state]="state"
      [$loadingMessage]="loadingMessage"
      [$errorMessage]="errorMessage"
      [$emptyMessage]="emptyMessage"
      [$showEmptyState]="showEmptyState"
      [$minHeight]="minHeight"
    >
      <ng-template #loadingTemplate>
        <div class="custom-loading">{{ loadingMessage }}</div>
      </ng-template>
      <ng-template #errorTemplate>
        <div class="custom-error">{{ errorMessage || 'Default Error' }}</div>
      </ng-template>
      <ng-template #emptyTemplate>
        <div class="custom-empty">{{ emptyMessage }}</div>
      </ng-template>
      <ng-template #contentTemplate let-data>
        <div class="content">{{ data?.name }}</div>
      </ng-template>
    </app-state-container>
  `,
})
class TestHostComponent {
  state = initialState();
  loadingMessage = 'Loading...';
  errorMessage: string | null = 'Error occurred';
  emptyMessage = 'No data available';
  showEmptyState = true;
  minHeight = '300px';

  @ViewChild(StateContainerComponent) stateContainer!: StateContainerComponent<any>;
}

describe('StateContainerComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StateContainerComponent,
        TestHostComponent,
        MockLoadingIndicatorComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(StateContainerComponent, {
        set: {
          imports: [CommonModule, MockLoadingIndicatorComponent],
        },
      })
      .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent.stateContainer).toBeTruthy();
  });

  it('should show loading state', () => {
    // Set state to loading
    hostComponent.state = loadingState(initialState());
    hostFixture.detectChanges();

    // Find the custom loading template
    const loadingElement = hostFixture.debugElement.query(By.css('.custom-loading'));
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.nativeElement.textContent).toContain('Loading...');
  });

  it('should show error state', () => {
    // Set state to error
    hostComponent.state = errorState('Test error message');
    hostFixture.detectChanges();

    // Find the custom error template
    const errorElement = hostFixture.debugElement.query(By.css('.custom-error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Error occurred');
  });

  it('should show empty state when data is empty array', () => {
    // Set state to loaded with empty array
    hostComponent.state = loadedState([]);
    hostFixture.detectChanges();

    // Find the custom empty template
    const emptyElement = hostFixture.debugElement.query(By.css('.custom-empty'));
    expect(emptyElement).toBeTruthy();
    expect(emptyElement.nativeElement.textContent).toContain('No data available');
  });

  it('should show content when data is available', () => {
    // Set state to loaded with data
    const testData = { id: 1, name: 'Test Data' };
    hostComponent.state = loadedState(testData);
    hostFixture.detectChanges();

    // Find the content template
    const contentElement = hostFixture.debugElement.query(By.css('.content'));
    expect(contentElement).toBeTruthy();
    expect(contentElement.nativeElement.textContent).toContain('Test Data');
  });

  it('should not show empty state when showEmptyState is false', () => {
    // Set state to loaded with empty array
    hostComponent.state = loadedState([]);
    hostComponent.showEmptyState = false;
    hostFixture.detectChanges();

    // Empty template should not be shown
    const emptyElement = hostFixture.debugElement.query(By.css('.custom-empty'));
    expect(emptyElement).toBeNull();
  });

  it('should detect empty paginated data', () => {
    // Create data with items array that is empty
    const paginatedData = {
      items: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
    };

    hostComponent.state = loadedState(paginatedData);
    hostFixture.detectChanges();

    // Empty template should be shown
    const emptyElement = hostFixture.debugElement.query(By.css('.custom-empty'));
    expect(emptyElement).toBeTruthy();
  });

  it('should use the provided errorMessage', () => {
    // Set custom error message
    const customError = 'Custom error message';
    hostComponent.errorMessage = customError;
    hostComponent.state = errorState('API error message');
    hostFixture.detectChanges();

    // Should use the custom error message
    expect(hostComponent.stateContainer.$actualErrorMessage()).toBe(customError);
  });

  it('should fall back to state error when no errorMessage provided', () => {
    // Set state error but no custom error message
    const stateError = 'API error message';
    hostComponent.errorMessage = null;
    hostComponent.state = errorState(stateError);
    hostFixture.detectChanges();

    // Should use the state error
    expect(hostComponent.stateContainer.$actualErrorMessage()).toBe(stateError);
  });

  it('should return default error message when no errors available', () => {
    // No error messages provided
    hostComponent.errorMessage = null;
    hostComponent.state = { ...errorState(''), error: undefined };
    hostFixture.detectChanges();

    // Should use default error message
    expect(hostComponent.stateContainer.$actualErrorMessage()).toBe('Wystąpił nieznany błąd');
  });

  it('should detect empty data properly', () => {
    // Test with undefined data
    hostComponent.state = { ...initialState(), data: undefined };
    hostFixture.detectChanges();
    expect(hostComponent.stateContainer.$isEmpty()).toBe(true);

    // Test with non-array, non-paginated data
    hostComponent.state = loadedState({ id: 1, name: 'Test' });
    hostFixture.detectChanges();
    expect(hostComponent.stateContainer.$isEmpty()).toBe(false);

    // Test with empty array
    hostComponent.state = loadedState([]);
    hostFixture.detectChanges();
    expect(hostComponent.stateContainer.$isEmpty()).toBe(true);

    // Test with non-empty array
    hostComponent.state = loadedState([{ id: 1, name: 'Test' }]);
    hostFixture.detectChanges();
    expect(hostComponent.stateContainer.$isEmpty()).toBe(false);
  });

  it('should apply the min-height style', () => {
    const customHeight = '500px';
    hostComponent.minHeight = customHeight;
    hostFixture.detectChanges();

    const container = hostFixture.debugElement.query(By.css('[style*="min-height"]'));
    expect(container).toBeTruthy();
    expect(container.styles['min-height']).toBe(customHeight);
  });
});
