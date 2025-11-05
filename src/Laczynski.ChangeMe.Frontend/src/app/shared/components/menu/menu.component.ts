import { Component, input, output, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, MenuSection, MenuConfig } from './models/menu-item.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',

  imports: [CommonModule, IconComponent],
})
export class MenuComponent {
  // Inputs
  sections = input<MenuSection[]>([]);
  items = input<MenuItem[]>([]);
  width = input<string>('260px');
  maxHeight = input<string>('auto');
  visible = input<boolean>(true);

  // Outputs
  itemClick = output<MenuItem>();
  submenuClick = output<MenuItem>();

  // Internal state
  hoveredItemId = signal<string | null>(null);
  pressedItemId = signal<string | null>(null);
  openSubmenuId = signal<string | null>(null);

  // Computed properties
  hasContent = computed(() => {
    return this.sections().length > 0 || this.items().length > 0;
  });

  allSections = computed(() => {
    // If items are provided without sections, wrap them in a single section
    if (this.items().length > 0 && this.sections().length === 0) {
      return [{ items: this.items() }] as MenuSection[];
    }
    return this.sections();
  });

  // Methods
  getMenuClasses(): string {
    const classes = ['menu'];
    return classes.join(' ');
  }

  getSectionClasses(section: MenuSection, index: number): string {
    const classes = ['menu__section'];

    if (index > 0) {
      classes.push('menu__section--not-first');
    }

    return classes.join(' ');
  }

  getSectionHeaderClasses(header: string, disabled?: boolean): string {
    const classes = ['menu__section-header'];

    if (disabled) {
      classes.push('menu__section-header--disabled');
    }

    return classes.join(' ');
  }

  getItemClasses(item: MenuItem): string {
    const classes = ['menu__item'];

    // Type-specific classes
    if (item.type === 'split') {
      classes.push('menu__item--split');
    }

    // State classes
    if (item.disabled) {
      classes.push('menu__item--disabled');
    } else {
      if (this.hoveredItemId() === item.id) {
        classes.push('menu__item--hover');
      }

      if (this.pressedItemId() === item.id) {
        classes.push('menu__item--pressed');
      }

      if (item.selected) {
        classes.push('menu__item--selected');
      }
    }

    return classes.join(' ');
  }

  getItemContentClasses(item: MenuItem): string {
    const classes = ['menu__item-content'];

    if (item.type === 'split') {
      classes.push('menu__item-content--split');
    }

    return classes.join(' ');
  }

  getIconClasses(item: MenuItem): string {
    const classes = ['menu__item-icon'];

    if (item.checked || item.selected) {
      classes.push('menu__item-icon--checked');
    }

    return classes.join(' ');
  }

  getSplitButtonClasses(item: MenuItem): string {
    const classes = ['menu__split-button'];

    if (item.disabled) {
      classes.push('menu__split-button--disabled');
    }

    return classes.join(' ');
  }

  onItemMouseEnter(item: MenuItem, event?: MouseEvent): void {
    if (!item.disabled) {
      this.hoveredItemId.set(item.id);

      // Auto-open submenu on hover if item has submenu
      if (item.submenuItems && item.submenuItems.length > 0) {
        this.openSubmenu(item, event);
      } else {
        // Close any open submenu when hovering over non-submenu items
        this.openSubmenuId.set(null);
      }
    }
  }

  onItemMouseLeave(item: MenuItem): void {
    this.hoveredItemId.set(null);
    // Note: We don't close submenu on leave to allow mouse movement into submenu
  }

  onItemMouseDown(item: MenuItem): void {
    if (!item.disabled) {
      this.pressedItemId.set(item.id);
    }
  }

  onItemMouseUp(item: MenuItem): void {
    this.pressedItemId.set(null);
  }

  onItemClick(item: MenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }

    event.stopPropagation();

    // If item has submenu, toggle it instead of executing action
    if (item.submenuItems && item.submenuItems.length > 0) {
      this.toggleSubmenu(item, event);
      return;
    }

    if (item.action) {
      item.action();
    }

    this.itemClick.emit(item);
  }

  onSubmenuClick(item: MenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }

    event.stopPropagation();

    if (item.submenuAction) {
      item.submenuAction();
    }

    this.submenuClick.emit(item);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.visible()) {
      event.preventDefault();
      // Close submenu first, if open
      if (this.openSubmenuId()) {
        this.openSubmenuId.set(null);
      }
    }
  }

  shouldShowIcon(item: MenuItem): boolean {
    return !!(item.icon || item.checked);
  }

  getIconTheme(item: MenuItem): 'regular' | 'filled' {
    if (item.checked || item.selected) {
      return 'filled';
    }
    return item.iconTheme || 'regular';
  }

  // Submenu methods
  openSubmenu(item: MenuItem, event?: MouseEvent): void {
    if (item.submenuItems && item.submenuItems.length > 0) {
      this.openSubmenuId.set(item.id);
    }
  }

  closeSubmenu(): void {
    this.openSubmenuId.set(null);
  }

  toggleSubmenu(item: MenuItem, event?: MouseEvent): void {
    if (this.openSubmenuId() === item.id) {
      this.closeSubmenu();
    } else {
      this.openSubmenu(item, event);
    }
  }

  isSubmenuOpen(item: MenuItem): boolean {
    return this.openSubmenuId() === item.id;
  }

  hasSubmenuItems(item: MenuItem): boolean {
    return !!(item.submenuItems && item.submenuItems.length > 0);
  }

  // Helper to show chevron
  shouldShowChevron(item: MenuItem): boolean {
    return this.hasSubmenuItems(item) || (item.hasSubmenu ?? false);
  }
}
