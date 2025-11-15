import { Component, input, output, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Size, Appearance, Orientation } from '../utils';
import { Node } from '../node/node.component';
import { NodeComponent } from '../node/node.component';
import { IconComponent } from '../icon/icon.component';

export interface BreadcrumbItem<T = any> extends Node<T> {
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [NodeComponent, IconComponent],
  templateUrl: './breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent<T extends BreadcrumbItem> {
  items = input.required<T[]>();
  size = input<Size>('large');
  showIcons = input<boolean>(true);
  ariaLabel = input<string>('Breadcrumb');

  // Visual Configuration
  showSelectionIndicator = input<boolean>(false);
  indicatorPosition = input<Orientation>('horizontal');
  variant = input<Appearance | undefined>(undefined);

  // Behavior Configuration
  asButton = input<boolean>(true);
  selectOnClick = input<boolean>(false);

  // Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

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
