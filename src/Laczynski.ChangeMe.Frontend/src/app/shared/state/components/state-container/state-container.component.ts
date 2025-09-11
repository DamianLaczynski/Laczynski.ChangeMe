import { Component, TemplateRef, computed, contentChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { State } from '../../models/state.model';

@Component({
  selector: 'app-state-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state-container.component.html',
})
export class StateContainerComponent<T> {
  $state = input.required<State<T>>();
  $loadingMessage = input('Loading data...');
  $errorMessage = input<string>();
  $emptyMessage = input('No data available');
  $showEmptyState = input(true);
  $minHeight = input('300px');

  loadingTemplate = contentChild<TemplateRef<any>>('loadingTemplate');
  errorTemplate = contentChild<TemplateRef<any>>('errorTemplate');
  emptyTemplate = contentChild<TemplateRef<any>>('emptyTemplate');
  contentTemplate = contentChild<TemplateRef<any>>('contentTemplate');

  $isEmpty = computed(() => {
    if (!this.$state().data) return true;
    if (Array.isArray(this.$state().data)) {
      return (this.$state().data as any[]).length === 0;
    }

    if (
      this.$state().data &&
      typeof this.$state().data === 'object' &&
      'items' in (this.$state().data as object) &&
      Array.isArray((this.$state().data as any).items)
    ) {
      return (this.$state().data as any).items.length === 0;
    }

    return false;
  });

  $actualErrorMessage = computed(() => {
    return this.$errorMessage() || this.$state().error || 'Unknown error occurred';
  });

  $effectiveEmptyTemplate = computed(() => {
    return this.emptyTemplate();
  });
}
