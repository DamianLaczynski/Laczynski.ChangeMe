import {
  Component,
  input,
  output,
  signal,
  effect,
  TemplateRef,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Size, TreeNode, ChevronPosition } from '../utils';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  imports: [CommonModule, IconComponent],
})
export class TreeNodeComponent<T extends TreeNode<any> = TreeNode<any>> {
  // Inputs - Node Data
  node = input.required<T>();
  size = input<Size>('medium');

  // Inputs - Visual Configuration
  showSelectionIndicator = input<boolean>(false);
  showChevron = input<boolean>(true);
  chevronPosition = input<ChevronPosition>('before');
  chevronIconCollapsed = input<string>('chevron_right');
  chevronIconExpanded = input<string>('chevron_down');

  // Inputs - Behavior Configuration
  asButton = input<boolean>(false);
  expandOnClick = input<boolean>(false);
  selectOnClick = input<boolean>(true);

  // Inputs - Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

  // Outputs
  nodeClick = output<T>();
  nodeToggle = output<T>();
  nodeSelect = output<T>();
  keyNavigation = output<{ key: string; node: T }>();

  // State
  expanded = signal<boolean>(false);
  isFocused = signal<boolean>(false);
  isHovered = signal<boolean>(false);

  private nodeElement = viewChild<ElementRef>('nodeElement');

  constructor() {
    // Sync expanded state with node.expanded
    effect(() => {
      const node = this.node();
      if (node.expanded !== undefined) {
        this.expanded.set(node.expanded);
      }
    });

    // Focus the element when it becomes focused
  }

  // Computed properties
  isLeaf(): boolean {
    return !this.node().hasChildren || !this.node().children || this.node().children?.length === 0;
  }

  hasChildren(): boolean {
    return this.node().hasChildren || false;
  }

  shouldShowChevron(): boolean {
    return this.showChevron() && this.hasChildren();
  }

  // CSS class generators
  nodeClasses(): string {
    const classes = ['tree-node'];

    classes.push(`tree-node--${this.size()}`);

    if (this.node().selected) {
      classes.push('tree-node--selected');
    }

    if (this.node().disabled) {
      classes.push('tree-node--disabled');
    }

    if (this.isFocused()) {
      classes.push('tree-node--focused');
    }

    if (this.isHovered()) {
      classes.push('tree-node--hovered');
    }

    if (this.hasChildren()) {
      classes.push('tree-node--branch');
      if (this.expanded()) {
        classes.push('tree-node--expanded');
      }
    } else {
      classes.push('tree-node--leaf');
    }

    return classes.join(' ');
  }

  contentClasses(): string {
    const classes = ['tree-node__content'];

    if (this.asButton()) {
      classes.push('tree-node__content--button');
    }

    return classes.join(' ');
  }

  selectionIndicatorClasses(): string {
    const classes = ['tree-node__selection-indicator'];

    if (this.node().selected) {
      classes.push('tree-node__selection-indicator--visible');
    }

    return classes.join(' ');
  }

  // Event handlers
  onContentClick(event: MouseEvent | Event): void {
    if (this.node().disabled) {
      return;
    }

    if (event instanceof MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Always emit click event
    this.nodeClick.emit(this.node());

    // Handle expand behavior
    if (this.expandOnClick() && this.hasChildren()) {
      this.toggleNode();
    }

    // Handle select behavior
    if (this.selectOnClick()) {
      this.nodeSelect.emit(this.node());
    }
  }

  onChevronClick(event: Event): void {
    event.stopPropagation();

    if (this.node().disabled) {
      return;
    }

    this.toggleNode();
  }

  toggleNode(): void {
    const newExpandedState = !this.expanded();
    this.expanded.set(newExpandedState);

    // Update node's expanded state
    const node = this.node();
    node.expanded = newExpandedState;

    this.nodeToggle.emit(node);
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  getTabIndex(): number {
    return this.node().disabled ? -1 : 0;
  }

  getRole(): string {
    if (this.asButton() || (this.expandOnClick() && this.hasChildren())) {
      return 'button';
    }
    return 'treeitem';
  }

  getAriaExpanded(): string | null {
    return this.hasChildren() ? String(this.expanded()) : null;
  }

  // Keyboard navigation
  onKeyDown(event: KeyboardEvent): void {
    if (this.node().disabled) {
      return;
    }

    const node = this.node();

    // Common keys
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        this.onContentClick(event);
        break;

      case 'ArrowRight':
        event.preventDefault();
        event.stopPropagation();
        this.handleArrowRight();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        event.stopPropagation();
        this.handleArrowLeft();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.keyNavigation.emit({ key: 'ArrowDown', node });
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.keyNavigation.emit({ key: 'ArrowUp', node });
        break;

      case 'Home':
        event.preventDefault();
        this.keyNavigation.emit({ key: 'Home', node });
        break;

      case 'End':
        event.preventDefault();
        this.keyNavigation.emit({ key: 'End', node });
        break;

      case '*':
        event.preventDefault();
        // Expand all siblings at the same level
        if (node.parent && node.parent.children) {
          node.parent.children.forEach(sibling => {
            if (sibling.hasChildren) {
              sibling.expanded = true;
            }
          });
        }
        break;
    }
  }

  private handleArrowRight(): void {
    const node = this.node();

    // If has children and collapsed, expand it
    if (node.hasChildren && !this.expanded()) {
      this.expanded.set(true);
      node.expanded = true;
      this.nodeToggle.emit(node);
    } else if (node.hasChildren && this.expanded() && node.children && node.children.length > 0) {
      // If expanded, move focus to first child
      this.keyNavigation.emit({ key: 'ArrowDown', node });
    }
  }

  private handleArrowLeft(): void {
    const node = this.node();

    // If has children and expanded, collapse it
    if (node.hasChildren && this.expanded()) {
      this.expanded.set(false);
      node.expanded = false;
      this.nodeToggle.emit(node);
    } else if (node.parent) {
      // If collapsed or leaf, move focus to parent
      this.keyNavigation.emit({ key: 'ArrowUp', node });
    }
  }
}
