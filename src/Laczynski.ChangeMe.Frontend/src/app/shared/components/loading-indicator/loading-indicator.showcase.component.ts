import { Component, input } from '@angular/core';
import { Intent, Size, Variant } from '../utils';
import { LoadingIndicatorComponent } from './loading-indicator.component';

@Component({
  selector: 'app-loading-indicator-showcase',
  template: `
    <app-loading-indicator size="sm" text="Loading..."></app-loading-indicator>

    <app-loading-indicator size="md" text="Loading..."></app-loading-indicator>

    <app-loading-indicator size="lg" text="Loading..."></app-loading-indicator>

    <app-loading-indicator size="xl" text="Loading..."></app-loading-indicator>

    <app-loading-indicator size="xl" text="Loading..." [intent]="'success'"></app-loading-indicator>
  `,
  standalone: true,
  imports: [LoadingIndicatorComponent],
})
export class LoadingIndicatorShowcaseComponent {}
