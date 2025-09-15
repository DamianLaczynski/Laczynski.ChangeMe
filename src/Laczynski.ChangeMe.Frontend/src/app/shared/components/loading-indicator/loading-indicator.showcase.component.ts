import { Component, input } from '@angular/core';
import { Intent, Size, Variant } from '../utils';
import { LoadingIndicatorComponent } from './loading-indicator.component';

@Component({
  selector: 'app-loading-indicator-showcase',
  template: `
    <app-loading-indicator size="small" text="Loading..."></app-loading-indicator>

    <app-loading-indicator size="medium" text="Loading..."></app-loading-indicator>

    <app-loading-indicator size="large" text="Loading..."></app-loading-indicator>

    <app-loading-indicator text="Loading..."></app-loading-indicator>

    <app-loading-indicator text="Loading..." [intent]="'success'"></app-loading-indicator>
  `,
  standalone: true,
  imports: [LoadingIndicatorComponent],
})
export class LoadingIndicatorShowcaseComponent {}
