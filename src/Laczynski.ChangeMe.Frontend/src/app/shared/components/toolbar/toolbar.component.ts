import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarItem, ToolbarGroup } from './models/toolbar-item.model';
import { ButtonComponent } from '../button/button.component';
import { DividerComponent } from '../divider/divider.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  imports: [CommonModule, ButtonComponent, DividerComponent],
})
export class ToolbarComponent {
  // Inputs
  items = input<ToolbarItem[]>([]);
  groups = input<ToolbarGroup[]>([]);
  size = input<'small' | 'medium' | 'large'>('medium');
  orientation = input<'horizontal' | 'vertical'>('horizontal');
  overflow = input<boolean>(false);

  // Outputs
  itemClick = output<ToolbarItem>();

  // Computed properties
  toolbarItems = computed(() => {
    const groups = this.groups();
    if (groups.length > 0) {
      // Flatten groups with dividers between them
      const items: ToolbarItem[] = [];
      groups.forEach((group, groupIndex) => {
        if (groupIndex > 0) {
          // Add divider between groups (except first)
          items.push({
            id: `divider-${groupIndex}`,
            type: 'divider',
          });
        }
        items.push(...group.items);
      });
      return items;
    }
    return this.items();
  });

  getToolbarClasses(): string {
    const classes = ['toolbar'];
    classes.push(`toolbar--${this.orientation()}`);
    classes.push(`toolbar--${this.size()}`);

    if (this.overflow()) {
      classes.push('toolbar--overflow');
    }

    return classes.join(' ');
  }

  getItemClasses(item: ToolbarItem): string {
    const classes = ['toolbar__item'];

    if (item.type) {
      classes.push(`toolbar__item--${item.type}`);
    }

    if (item.disabled) {
      classes.push('toolbar__item--disabled');
    }

    if (item.selected) {
      classes.push('toolbar__item--selected');
    }

    return classes.join(' ');
  }

  onItemClick(item: ToolbarItem, event: MouseEvent): void {
    if (item.disabled || item.type === 'divider') {
      event.preventDefault();
      return;
    }

    if (item.action) {
      item.action();
    }

    this.itemClick.emit(item);
  }

  isDivider(item: ToolbarItem): boolean {
    return item.type === 'divider';
  }

  getButtonSize(): 'small' | 'medium' | 'large' {
    return this.size();
  }

  getButtonVariant(
    item: ToolbarItem,
  ): 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent' {
    // Use subtle variant for toolbar buttons by default
    // If selected, use a different variant to show selection
    if (item.selected) {
      return 'subtle';
    }
    return 'subtle';
  }

  isIconOnly(item: ToolbarItem): boolean {
    return !!item.icon && !item.label;
  }
}
