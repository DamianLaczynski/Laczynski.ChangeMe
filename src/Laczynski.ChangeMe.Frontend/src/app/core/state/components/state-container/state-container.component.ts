import { Component, TemplateRef, computed, contentChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { State } from '../../models/state.model';

@Component({
  selector: 'app-state-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state-container.component.html',
  styleUrls: ['./state-container.component.scss'],
})
export class StateContainerComponent<T> {
  $state = input.required<State<T>>();
  $loadingMessage = input('Ładowanie danych...');
  $errorMessage = input<string>();
  $emptyMessage = input('Brak danych do wyświetlenia');
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
    return this.$errorMessage() || this.$state().error || 'Wystąpił nieznany błąd';
  });

  $effectiveEmptyTemplate = computed(() => {
    return this.emptyTemplate();
  });
}
