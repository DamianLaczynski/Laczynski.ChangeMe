import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  effect,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size, TreeNode } from '../utils';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tree-item',

  imports: [CommonModule, IconComponent],
  templateUrl: './tree-item.component.html',
})
export class TreeItemComponent<T extends TreeNode<any>> {
  node = input.required<T>();
  size = input<Size>('medium');
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);
  focusedNodeId = input<string | number | null>(null);

  nodeClick = output<T>();
  nodeToggle = output<T>();
  nodeSelect = output<T>();
  keyNavigation = output<{ key: string; node: T }>();

  expanded = signal<boolean>(false);

  private itemElement = viewChild<ElementRef>('treeItem');

  constructor() {
    // Sync expanded state with node.expanded
    effect(() => {
      const node = this.node();
      if (node.expanded !== undefined) {
        this.expanded.set(node.expanded);
      }
    });

    // Focus the element when it becomes focused
    effect(() => {
      if (this.focusedNodeId() === this.node().id) {
        // Use setTimeout to ensure DOM is updated
        setTimeout(() => {
          const element = this.itemElement()?.nativeElement;
          if (element && document.activeElement !== element) {
            element.focus();
          }
        }, 0);
      }
    });
  }

  isLeaf(): boolean {
    return !this.node().hasChildren || !this.node().children || this.node().children?.length === 0;
  }

  itemClasses(): string {
    const classes = ['tree__item'];

    if (this.isLeaf()) {
      classes.push('tree__item--leaf');
    } else {
      classes.push('tree__item--branch');
    }

    if (this.expanded()) {
      classes.push('tree__item--expanded');
    }

    if (this.node().selected) {
      classes.push('tree__item--selected');
    }

    if (this.node().disabled) {
      classes.push('tree__item--disabled');
    }

    return classes.join(' ');
  }

  getTabIndex(): number {
    // Roving tabindex pattern: only focused item has tabindex="0"
    return this.focusedNodeId() === this.node().id ? 0 : -1;
  }

  onItemClick(event: Event): void {
    if (this.node().disabled) {
      return;
    }

    this.nodeClick.emit(this.node());
  }

  onChevronClick(event: Event): void {
    event.stopPropagation();

    if (this.node().disabled) {
      return;
    }

    const newExpandedState = !this.expanded();
    this.expanded.set(newExpandedState);

    // Update node's expanded state
    const node = this.node();
    node.expanded = newExpandedState;

    this.nodeToggle.emit(node);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.node().disabled) {
      return;
    }

    const node = this.node();

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.nodeSelect.emit(node);
        break;

      case 'ArrowRight':
        event.preventDefault();
        // If has children and collapsed, expand it
        if (node.hasChildren && !this.expanded()) {
          this.expanded.set(true);
          node.expanded = true;
          this.nodeToggle.emit(node);
        } else if (
          node.hasChildren &&
          this.expanded() &&
          node.children &&
          node.children.length > 0
        ) {
          // If expanded, move focus to first child
          this.keyNavigation.emit({ key: 'ArrowDown', node });
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        // If has children and expanded, collapse it
        if (node.hasChildren && this.expanded()) {
          this.expanded.set(false);
          node.expanded = false;
          this.nodeToggle.emit(node);
        } else if (node.parent) {
          // If collapsed or leaf, move focus to parent
          this.keyNavigation.emit({ key: 'ArrowUp', node });
        }
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
        // Expand all siblings at the same level
        event.preventDefault();
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
}
