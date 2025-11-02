import { Component, input, output } from '@angular/core';
import { Node, Size } from '../utils';
import { NodeComponent } from '../node/node.component';
import { IconComponent } from '../icon/icon.component';

export interface BreadcrumbItem<T = any> extends Node<T> {
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [NodeComponent, IconComponent],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent<T extends BreadcrumbItem> {
  items = input.required<T[]>();
  size = input<Size>('large');
  showIcons = input<boolean>(true);
  ariaLabel = input<string>('Breadcrumb');

  itemClick = output<T>();

  breadcrumbClasses(): string {
    const classes = ['breadcrumb'];
    classes.push(`breadcrumb--${this.size()}`);
    return classes.join(' ');
  }

  onItemClick(item: T): void {
    if (item.disabled || item.selected) {
      return;
    }

    this.itemClick.emit(item);
  }

  onNodeClick(item: T): void {
    this.onItemClick(item);
  }
}
