import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../utils';

@Component({
  selector: 'app-action-button',
  template: `
    <!-- Action button -->
    @if (show()) {
      <button type="button" class="field__action" (click)="onClick($event)">
        <app-icon [icon]="icon()" [size]="size()" [variant]="variant()" />
      </button>
    }
  `,
  imports: [IconComponent],
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class ActionButtonComponent {
  size = input<Size>('medium');
  show = input<boolean>(true);
  icon = input<string>('dismiss');
  variant = input<'regular' | 'filled'>('regular');
  click = output<void>();

  onClick(event: any): void {
    event.stopPropagation();
    event.preventDefault();
    this.click.emit(event);
  }
}
