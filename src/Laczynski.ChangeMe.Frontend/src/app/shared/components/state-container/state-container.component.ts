import { Component, TemplateRef, computed, contentChild, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { ErrorStateComponent } from '../error-state/error-state.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { QuickAction, Size, SpinnerSize } from '../utils';
import { State } from '@shared/state/models/state.model';
import { IconName } from '../icon';

@Component({
  selector: 'app-state-container',
  templateUrl: './state-container.component.html',
  imports: [CommonModule, LoadingStateComponent, ErrorStateComponent, EmptyStateComponent],
})
export class StateContainerComponent<T> {
  state = input.required<State<T>>();
  size = input<Size, Size | undefined>('medium', {
    transform: (value: Size | undefined) => value ?? 'medium',
  });

  showEmptyOnInitial = input<boolean>(false);
  emptyOverride = input<boolean | null>(null);

  // Loading state inputs
  loadingTitle = input<string>('');
  loadingDescription = input<string>('');
  loadingOverlay = input<boolean>(false);
  loadingBlurContent = input<boolean>(true);
  loadingFullScreen = input<boolean>(false);

  // Error state inputs
  errorTitle = input<string>('');
  errorDescription = input<string>('');
  errorIcon = input<IconName | undefined>(undefined);
  errorPrimaryAction = input<QuickAction | null>(null);
  errorSecondaryAction = input<QuickAction | null>(null);

  // Empty state inputs
  emptyTitle = input<string>('');
  emptyDescription = input<string>('');
  emptyIcon = input<IconName | undefined>(undefined);
  emptyPrimaryAction = input<QuickAction | null>(null);
  emptySecondaryAction = input<QuickAction | null>(null);

  // Custom templates
  loadingContentTemplate = contentChild<TemplateRef<unknown>>('loadingContent');

  errorContentTemplate = contentChild<TemplateRef<unknown>>('errorContent');

  emptyContentTemplate = contentChild<TemplateRef<unknown>>('emptyContent');

  initialTemplate = contentChild<TemplateRef<unknown>>('initialState');
  dataTemplate = contentChild<TemplateRef<unknown>>('dataState');

  // Outputs
  errorActionClick = output<QuickAction>();
  emptyActionClick = output<QuickAction>();

  stateContext = computed(() => {
    const currentState = this.state();
    return {
      $implicit: currentState.data,
      state: currentState,
    };
  });

  shouldShowInitial = computed(() => {
    const currentState = this.state();
    return currentState.isInitial && !currentState.isLoading && !currentState.isError;
  });

  shouldShowEmpty = computed(() => {
    const override = this.emptyOverride();
    if (override !== null) {
      return override;
    }

    const currentState = this.state();
    if (currentState.isInitial) {
      return this.showEmptyOnInitial();
    }

    const data = currentState.data as unknown;

    if (data == null) {
      return true;
    }

    if (Array.isArray(data)) {
      return data.length === 0;
    }

    if (data instanceof Map || data instanceof Set) {
      return data.size === 0;
    }

    if (typeof data === 'object') {
      return Object.keys(data as Record<string, unknown>).length === 0;
    }

    return false;
  });

  onErrorActionClick(action: QuickAction): void {
    this.errorActionClick.emit(action);
  }

  onEmptyActionClick(action: QuickAction): void {
    this.emptyActionClick.emit(action);
  }
}
