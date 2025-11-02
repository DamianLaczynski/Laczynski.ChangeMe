import {
  Component,
  input,
  output,
  model,
  signal,
  effect,
  ElementRef,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavState, NavNodeConfig } from './models';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { Node } from '../utils';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',

  imports: [CommonModule, TreeNodeComponent],
})
export class NavComponent {
  // Configuration inputs
  width = input<number>(260);
  collapsedWidth = input<number>(56);
  collapsible = input<boolean>(true);
  defaultState = input<NavState>('collapsed');
  items = input<NavNodeConfig[]>([]);

  // State management
  state = model<NavState>(this.defaultState());

  // Outputs
  stateChange = output<NavState>();
  hamburgerClick = output<void>();

  // Internal state
  isCollapsed = signal<boolean>(this.defaultState() === 'collapsed');
  currentFocusIndex = signal<number>(0);

  // View children for keyboard navigation
  navNodes = viewChildren(TreeNodeComponent, { read: ElementRef });

  constructor() {
    // Initialize collapsed state based on defaultState
    this.isCollapsed.set(this.defaultState() === 'collapsed');

    // Sync isCollapsed with defaultState changes
    effect(() => {
      this.isCollapsed.set(this.defaultState() === 'collapsed');
    });

    // Sync open property with expanded for backward compatibility
    effect(() => {
      this.items().forEach(item => {
        if (item.open !== undefined && item.expanded === undefined) {
          item.expanded = item.open;
        }
        if (item.children) {
          item.hasChildren = true;
        }
        // Ensure id is set
        if (!item.id) {
          item.id = item.label;
        }
      });
    });
  }

  // Generate CSS classes for nav container
  navClasses(): string {
    const classes = ['nav'];

    if (this.isCollapsed()) {
      classes.push('nav--collapsed');
    } else {
      classes.push('nav--expanded');
    }

    return classes.join(' ');
  }

  // Generate CSS classes for hamburger button
  hamburgerClasses(): string {
    const classes = ['nav__hamburger'];

    if (this.isCollapsed()) {
      classes.push('nav__hamburger--collapsed');
    }

    return classes.join(' ');
  }

  // Generate CSS classes for content area
  contentClasses(): string {
    const classes = ['nav__content'];

    if (this.isCollapsed()) {
      classes.push('nav__content--collapsed');
    }

    return classes.join(' ');
  }

  // Toggle navigation state
  toggleNav(): void {
    if (!this.collapsible()) {
      return;
    }

    const newState: NavState = this.isCollapsed() ? 'expanded' : 'collapsed';
    this.isCollapsed.set(!this.isCollapsed());
    this.state.set(newState);
    this.stateChange.emit(newState);
    this.hamburgerClick.emit();
  }

  // Handle hamburger button click
  onHamburgerClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleNav();
  }

  // Get current width based on state
  getCurrentWidth(): number {
    return this.isCollapsed() ? this.collapsedWidth() : this.width();
  }

  // Handle item click
  onItemClick(item: Node): void {
    if (item.onClick) {
      item.onClick();
    }
  }

  // Keyboard navigation handler
  onContentKeyDown(event: KeyboardEvent): void {
    const visibleItems = this.getVisibleItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocusDown(visibleItems);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveFocusUp(visibleItems);
        break;

      case 'Home':
        event.preventDefault();
        this.moveFocusToFirst(visibleItems);
        break;

      case 'End':
        event.preventDefault();
        this.moveFocusToLast(visibleItems);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.activateCurrentItem(visibleItems);
        break;
    }
  }

  // Get all visible items (flatten structure)
  private getVisibleItems(): Array<{
    item: NavNodeConfig;
    isChild: boolean;
    parentIndex?: number;
  }> {
    const visible: Array<{ item: NavNodeConfig; isChild: boolean; parentIndex?: number }> = [];

    this.items().forEach((item, parentIndex) => {
      visible.push({ item, isChild: false });

      // Add children if group is open and not collapsed
      if (!this.isCollapsed() && item.expanded && item.children) {
        item.children.forEach(child => {
          visible.push({
            item: { ...child, id: child.id || child.label } as NavNodeConfig,
            isChild: true,
            parentIndex,
          });
        });
      }
    });

    return visible;
  }

  // Move focus down
  private moveFocusDown(visibleItems: Array<{ item: NavNodeConfig; isChild: boolean }>): void {
    const currentIndex = this.currentFocusIndex();
    const nextIndex = Math.min(currentIndex + 1, visibleItems.length - 1);
    this.currentFocusIndex.set(nextIndex);
    this.focusItem(nextIndex);
  }

  // Move focus up
  private moveFocusUp(visibleItems: Array<{ item: NavNodeConfig; isChild: boolean }>): void {
    const currentIndex = this.currentFocusIndex();
    const prevIndex = Math.max(currentIndex - 1, 0);
    this.currentFocusIndex.set(prevIndex);
    this.focusItem(prevIndex);
  }

  // Move focus to first item
  private moveFocusToFirst(visibleItems: Array<{ item: NavNodeConfig; isChild: boolean }>): void {
    if (visibleItems.length > 0) {
      this.currentFocusIndex.set(0);
      this.focusItem(0);
    }
  }

  // Move focus to last item
  private moveFocusToLast(visibleItems: Array<{ item: NavNodeConfig; isChild: boolean }>): void {
    if (visibleItems.length > 0) {
      const lastIndex = visibleItems.length - 1;
      this.currentFocusIndex.set(lastIndex);
      this.focusItem(lastIndex);
    }
  }

  // Focus specific item
  private focusItem(index: number): void {
    const nodes = this.navNodes();
    if (nodes && nodes[index]) {
      const buttonElement = nodes[index].nativeElement.querySelector('button');
      if (buttonElement) {
        buttonElement.focus();
      }
    }
  }

  // Activate current item (click)
  private activateCurrentItem(
    visibleItems: Array<{ item: NavNodeConfig; isChild: boolean }>,
  ): void {
    const currentIndex = this.currentFocusIndex();
    const currentItem = visibleItems[currentIndex];

    if (currentItem) {
      // Use onNodeClick which handles both parent and child clicks
      this.onItemClick(currentItem.item as Node);
    }
  }

  // Handle focus on nav item
  onNavItemFocus(index: number): void {
    this.currentFocusIndex.set(index);
  }
}
