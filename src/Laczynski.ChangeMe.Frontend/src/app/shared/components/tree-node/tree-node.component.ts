import {
  Component,
  input,
  output,
  signal,
  effect,
  TemplateRef,
  ElementRef,
  viewChild,
  contentChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeComponent } from '../node/node.component';
import { IconComponent } from '../icon/icon.component';
import { Size, ChevronPosition, Appearance, Orientation } from '../utils';
import { Node } from '../node/node.component';
import { IconName } from '../icon';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNodeComponent {
  // Inputs - Node Data
  node = input.required<TreeNode>();
  size = input<Size>('medium');

  // Inputs - Visual Configuration
  showSelectionIndicator = input<boolean>(false);
  indicatorPosition = input<Orientation>('vertical');
  variant = input<Appearance | undefined>(undefined);
  chevronPosition = input<ChevronPosition>('before');
  chevronIconCollapsed = input<IconName>('chevron_right');
  chevronIconExpanded = input<IconName>('chevron_down');

  // Inputs - Behavior Configuration
  asButton = input<boolean>(false);
  expandOnClick = input<boolean>(false);
  selectOnClick = input<boolean>(true);

  // Inputs - Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

  // Inputs - Drag and Drop
  draggable = input<boolean>(false);
  dropZone = input<boolean>(false);

  // Content Projection
  contentTemplate = contentChild<TemplateRef<any>>('content');

  // Outputs
  nodeClick = output<TreeNode>();
  nodeToggle = output<TreeNode>();
  nodeSelect = output<TreeNode>();
  dragStart = output<{ node: TreeNode; event: DragEvent }>();
  dragEnd = output<{ node: TreeNode; event: DragEvent }>();
  drop = output<{ node: TreeNode; event: DragEvent; position: 'before' | 'after' | 'inside' }>();
  dragOver = output<{
    node: TreeNode;
    event: DragEvent;
    position: 'before' | 'after' | 'inside';
  }>();

  expanded = signal<boolean>(false);

  // Drop zone state for between-elements indicators
  dragOverNodeId = signal<string | number | null>(null);
  dragOverPosition = signal<'before' | 'after' | 'inside' | null>(null);
  draggedNodeId = signal<string | number | null>(null);

  constructor() {
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
    return this.hasChildren();
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

    if (this.expandOnClick() && this.hasChildren()) {
      this.toggleNode();
    }

    if (this.selectOnClick()) {
      this.nodeSelect.emit(node);
    }
  }

  onNodeToggle(): void {
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

  // Drag and drop handlers - forward from node component
  onDragStart(event: { node: TreeNode; event: DragEvent; data?: any }): void {
    // Track dragged node ID to hide drop areas on it and its neighbors
    this.draggedNodeId.set(event.node.id);
    this.dragStart.emit({ node: event.node, event: event.event });
  }

  onDragEnd(event: { node: TreeNode; event: DragEvent }): void {
    // Clear dragged node ID
    this.draggedNodeId.set(null);
    this.dragEnd.emit({ node: event.node, event: event.event });
  }

  onDrop(event: {
    node: TreeNode;
    event: DragEvent;
    position: 'before' | 'after' | 'inside';
  }): void {
    this.drop.emit({ node: event.node, event: event.event, position: event.position });
  }

  onDragOver(event: {
    node: TreeNode;
    event: DragEvent;
    position: 'before' | 'after' | 'inside';
  }): void {
    // Clear between-elements indicators when dragging over node itself
    if (event.position === 'inside') {
      this.dragOverNodeId.set(null);
      this.dragOverPosition.set(null);
    }

    this.dragOver.emit({ node: event.node, event: event.event, position: event.position });
  }

  onBetweenElementsDragOver(event: DragEvent, node: TreeNode, position: 'before' | 'after'): void {
    if (!this.dropZone() || node.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'move';

    this.dragOverNodeId.set(node.id);
    this.dragOverPosition.set(position);

    this.dragOver.emit({ node, event, position });
  }

  onBetweenElementsDragLeave(event: DragEvent): void {
    // Only clear if we're actually leaving the drop indicator
    const relatedTarget = event.relatedTarget as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;
    if (!currentTarget.contains(relatedTarget)) {
      this.dragOverNodeId.set(null);
      this.dragOverPosition.set(null);
    }
  }

  onBetweenElementsDrop(event: DragEvent, node: TreeNode, position: 'before' | 'after'): void {
    if (!this.dropZone() || node.disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.dragOverNodeId.set(null);
    this.dragOverPosition.set(null);

    this.drop.emit({ node, event, position });
  }

  shouldRenderDropIndicator(nodeId: string | number, position: 'before' | 'after'): boolean {
    const draggedId = this.draggedNodeId();

    // Don't render drop indicator if this is the dragged node
    if (draggedId === nodeId) {
      return false;
    }

    // Don't render drop indicator before/after if the target is next to the dragged node
    if (draggedId !== null) {
      const children = this.node().children;
      if (children && children.length > 0) {
        const draggedIndex = children.findIndex(n => n.id === draggedId);
        const targetIndex = children.findIndex(n => n.id === nodeId);

        if (draggedIndex !== -1 && targetIndex !== -1) {
          // Hide "after" indicator on node before dragged node
          if (position === 'after' && targetIndex === draggedIndex - 1) {
            return false;
          }
          // Hide "before" indicator on node after dragged node
          if (position === 'before' && targetIndex === draggedIndex + 1) {
            return false;
          }
        }
      }
    }

    return true;
  }

  shouldShowDropIndicator(nodeId: string | number, position: 'before' | 'after'): boolean {
    if (!this.shouldRenderDropIndicator(nodeId, position)) {
      return false;
    }

    return (
      this.dropZone() && this.dragOverNodeId() === nodeId && this.dragOverPosition() === position
    );
  }
}
