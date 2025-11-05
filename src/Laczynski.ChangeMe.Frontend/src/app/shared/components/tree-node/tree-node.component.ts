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
import { NodeComponent } from '../node/node.component';
import { IconComponent } from '../icon/icon.component';
import { Size, ChevronPosition } from '../utils';
import { Node } from '../node/node.component';

export interface TreeNode<T = any> extends Node<T> {
  hasChildren?: boolean;
  children?: TreeNode<T>[];
  expanded?: boolean;
  parent?: TreeNode<T>;
  level?: number;
}

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  imports: [CommonModule, NodeComponent, IconComponent],
})
export class TreeNodeComponent {
  // Inputs - Node Data
  node = input.required<TreeNode>();
  size = input<Size>('medium');

  // Inputs - Visual Configuration
  showSelectionIndicator = input<boolean>(false);
  showChevron = input<boolean>(true);
  chevronPosition = input<ChevronPosition>('before');
  chevronIconCollapsed = input<string>('chevron_right');
  chevronIconExpanded = input<string>('chevron_down');
  iconOnly = input<boolean>(false);

  // Inputs - Behavior Configuration
  asButton = input<boolean>(false);
  expandOnClick = input<boolean>(false);
  selectOnClick = input<boolean>(true);

  // Inputs - Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

  // Outputs
  nodeClick = output<TreeNode>();
  nodeToggle = output<TreeNode>();
  nodeSelect = output<TreeNode>();

  // State - Tree-specific (manages expanded state for tree hierarchy)
  expanded = signal<boolean>(false);

  private nodeElement = viewChild<ElementRef>('nodeElement');

  constructor() {
    // Sync expanded state with node.expanded
    effect(() => {
      const node = this.node();
      if (node.expanded !== undefined) {
        this.expanded.set(node.expanded);
      }
    });
  }

  // Tree-specific computed properties
  isLeaf(): boolean {
    return !this.node().hasChildren || !this.node().children || this.node().children?.length === 0;
  }

  hasChildren(): boolean {
    return this.node().hasChildren || false;
  }

  shouldShowChevron(): boolean {
    return this.showChevron() && this.hasChildren();
  }

  // CSS class generators for tree container
  treeNodeClasses(): string {
    const classes = ['tree-node'];

    classes.push(`tree-node--${this.size()}`);

    return classes.join(' ');
  }

  // Event handlers - forward from node component
  onNodeClick(node: TreeNode): void {
    this.nodeClick.emit(node);

    // Handle expand behavior for tree
    if (this.expandOnClick() && this.hasChildren()) {
      this.toggleNode();
    }

    // Handle select behavior
    if (this.selectOnClick()) {
      this.nodeSelect.emit(node);
    }
  }

  onNodeToggle(node: TreeNode): void {
    this.toggleNode();
  }

  onChevronClick(event: Event): void {
    event.stopPropagation();

    if (this.node().disabled) {
      return;
    }

    this.toggleNode();
  }

  onNodeSelect(node: TreeNode): void {
    this.nodeSelect.emit(node);
  }

  toggleNode(): void {
    const newExpandedState = !this.expanded();
    this.expanded.set(newExpandedState);

    // Update node's expanded state
    const node = this.node();
    node.expanded = newExpandedState;

    this.nodeToggle.emit(node);
  }

  // Keyboard navigation - Tree-specific
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
        this.onNodeClick(node);
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
    }
  }

  private handleArrowLeft(): void {
    const node = this.node();

    // If has children and expanded, collapse it
    if (node.hasChildren && this.expanded()) {
      this.expanded.set(false);
      node.expanded = false;
      this.nodeToggle.emit(node);
    }
  }
}
