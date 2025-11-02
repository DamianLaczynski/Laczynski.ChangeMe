import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../utils';

@Component({
  selector: 'app-nav-app-item',
  template: `
    <button
      type="button"
      [class]="navAppItemClasses()"
      [attr.aria-label]="name()"
      [attr.role]="'menuitem'"
      (click)="onClick()"
    >
      @if (icon()) {
        <app-icon [icon]="icon()" [size]="size()" variant="regular" />
      }
      <span class="nav-app-item__name">{{ name() }}</span>
    </button>
  `,

  imports: [IconComponent],
})
export class NavAppItemComponent {
  name = input.required<string>();
  icon = input<string>();
  iconSvg = input<string>();
  size = input<Size>('medium');

  click = output<void>();

  navAppItemClasses(): string {
    const classes = ['nav-app-item'];
    classes.push(`nav-app-item--${this.size()}`);
    return classes.join(' ');
  }

  onClick(): void {
    this.click.emit();
  }
}
