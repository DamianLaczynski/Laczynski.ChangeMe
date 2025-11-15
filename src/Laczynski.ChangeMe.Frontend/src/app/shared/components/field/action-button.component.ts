import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../utils';
import { IconName } from '../icon';

@Component({
  selector: 'app-action-button',
  template: `
    <!-- Action button -->
    @if (show()) {
      <button
        type="button"
        class="field__action"
        (click)="onClick($event)"
        (mousedown)="onMouseDown($event)"
      >
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionButtonComponent {
  size = input<Size>('medium');
  show = input<boolean>(true);
  icon = input<IconName>('dismiss');
  variant = input<'regular' | 'filled'>('regular');
  click = output<void>();
  mousedown = output<MouseEvent>();

  onClick(event: any): void {
    event.stopPropagation();
    event.preventDefault();
    this.click.emit(event);
  }

  onMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.mousedown.emit(event);
  }
}
