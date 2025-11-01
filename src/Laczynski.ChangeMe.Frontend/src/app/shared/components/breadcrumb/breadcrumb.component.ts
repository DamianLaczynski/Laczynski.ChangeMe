import { Component, input, output } from '@angular/core';
import { Size } from '../utils';
import { IconComponent } from '../icon/icon.component';

export interface BreadcrumbItem {
  id: string | number;
  label: string;
  icon?: string;
  url?: string;
  disabled?: boolean;
  current?: boolean;
}

@Component({
  selector: 'app-breadcrumb',

  imports: [IconComponent],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
  items = input.required<BreadcrumbItem[]>();
  size = input<Size>('large');
  showIcons = input<boolean>(true);
  ariaLabel = input<string>('Breadcrumb');

  itemClick = output<BreadcrumbItem>();

  breadcrumbClasses(): string {
    const classes = ['breadcrumb'];
    classes.push(`breadcrumb--${this.size()}`);
    return classes.join(' ');
  }

  itemClasses(item: BreadcrumbItem): string {
    const classes = ['breadcrumb__button'];

    if (item.current) {
      classes.push('breadcrumb__button--current');
    }

    if (item.disabled) {
      classes.push('breadcrumb__button--disabled');
    }

    return classes.join(' ');
  }

  onItemClick(item: BreadcrumbItem): void {
    if (item.disabled || item.current) {
      return;
    }

    this.itemClick.emit(item);
  }
}
