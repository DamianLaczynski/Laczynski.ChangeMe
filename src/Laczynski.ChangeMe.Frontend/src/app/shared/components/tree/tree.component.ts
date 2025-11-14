import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  model,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { Size, TreeStyle, Appearance, Orientation, ChevronPosition } from '../utils';
import { TreeNode } from '../tree-node/tree-node.component';
import { IconName } from '../icon';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  imports: [CommonModule, TreeNodeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {
  // Inputs - Tree Data
  nodes = model<TreeNode[]>([]);
  size = input<Size>('medium');
  style = input<TreeStyle>('subtle');

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

  // Inputs - Drag and Drop
  draggable = input<boolean>(false);
  dropZone = input<boolean>(false);

  // Content Projection
  contentTemplate = contentChild<TemplateRef<any>>('content');

  // Template
  quickActionsTemplate = contentChild<TemplateRef<any>>('quickActions');

  // Drop zone state for between-elements indicators
  dragOverNodeId = signal<string | number | null>(null);
  dragOverPosition = signal<'before' | 'after' | 'inside' | null>(null);
  draggedNodeId = signal<string | number | null>(null);

  // Outputs
  nodeClick = output<TreeNode>();
  nodeToggle = output<TreeNode>();
  nodeSelect = output<TreeNode>();
  nodeMoved = output<{
    node: TreeNode;
    target: TreeNode;
    position: 'before' | 'after' | 'inside';
  }>();

  treeClasses(): string {
    const classes = ['tree'];

    classes.push(`tree--${this.size()}`);
    classes.push(`tree--${this.style()}`);

    return classes.join(' ');
  }

  onNodeClick(node: TreeNode): void {
    this.onNodeSelect(node);
    this.nodeClick.emit(node);
  }

  onNodeToggle(node: TreeNode): void {
    this.nodeToggle.emit(node);
  }

  onNodeSelect(node: TreeNode): void {
    this.clearSelection(this.nodes());
    node.selected = true;

    this.nodeSelect.emit(node);
  }

  // Drag and drop handlers
  onDragStart(event: { node: TreeNode; event: DragEvent }): void {
    // Store the dragged node in the dataTransfer for later retrieval
    event.event.dataTransfer!.effectAllowed = 'move';
    event.event.dataTransfer!.setData('application/json', JSON.stringify({ id: event.node.id }));
    // Track dragged node ID to hide drop areas on it and its neighbors
    this.draggedNodeId.set(event.node.id);
  }

  onDragEnd(event: { node: TreeNode; event: DragEvent }): void {
    // Clear dragged node ID
    this.draggedNodeId.set(null);
    this.dragOverNodeId.set(null);
    this.dragOverPosition.set(null);
  }

  onDrop(event: {
    node: TreeNode;
    event: DragEvent;
    position: 'before' | 'after' | 'inside';
  }): void {
    try {
      const data = event.event.dataTransfer!.getData('application/json');
      const draggedNodeData = JSON.parse(data);
      const draggedNodeId = draggedNodeData.id;

      // Find the dragged node in the tree
      const draggedNode = this.findNodeById(this.nodes(), draggedNodeId);
      if (!draggedNode) {
        return;
      }

      const targetNode = event.node;

      // Prevent dropping node on itself or its descendants
      if (draggedNodeId === targetNode.id || this.isDescendant(draggedNode, targetNode)) {
        return;
      }

      // Remove the dragged node from its current location
      this.removeNode(this.nodes(), draggedNodeId);

      // Add the dragged node to the new location
      this.insertNode(this.nodes(), draggedNode, targetNode, event.position);

      // Update parent references and levels
      this.updateTreeStructure(this.nodes());

      // Emit the move event
      this.nodeMoved.emit({
        node: draggedNode,
        target: targetNode,
        position: event.position,
      });
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }

  onDragOver(event: {
    node: TreeNode;
    event: DragEvent;
    position: 'before' | 'after' | 'inside';
  }): void {
    if (!this.dropZone() || event.node.disabled) {
      return;
    }

    event.event.preventDefault();
    event.event.stopPropagation();
    event.event.dataTransfer!.dropEffect = 'move';

    // Handle different positions
    if (event.position === 'inside') {
      // Clear between-elements indicators when dragging over node itself
      this.dragOverNodeId.set(null);
      this.dragOverPosition.set(null);
    } else if (event.position === 'before' || event.position === 'after') {
      // Update indicators for between-elements positions
      this.dragOverNodeId.set(event.node.id);
      this.dragOverPosition.set(event.position);
    }
  }

  onBetweenElementsDragOver(event: DragEvent, node: TreeNode, position: 'before' | 'after'): void {
    if (!this.dropZone() || node.disabled) {
      return;
    }

    // Prevent default and stop propagation immediately to ensure real-time updates
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'move';

    // Update indicators immediately
    this.dragOverNodeId.set(node.id);
    this.dragOverPosition.set(position);
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

    this.onDrop({ node, event, position });
  }

  shouldRenderDropIndicator(nodeId: string | number, position: 'before' | 'after'): boolean {
    const draggedId = this.draggedNodeId();

    // Don't render drop indicator if this is the dragged node
    if (draggedId === nodeId) {
      return false;
    }

    // Don't render drop indicator before/after if the target is next to the dragged node
    if (draggedId !== null) {
      const nodes = this.nodes();
      const draggedIndex = nodes.findIndex(n => n.id === draggedId);
      const targetIndex = nodes.findIndex(n => n.id === nodeId);

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

  private findNodeById(nodes: TreeNode[], id: string | number): TreeNode | null {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeById(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private isDescendant(ancestor: TreeNode, descendant: TreeNode): boolean {
    if (!ancestor.children) {
      return false;
    }
    if (ancestor.children.some(child => child.id === descendant.id)) {
      return true;
    }
    return ancestor.children.some(child => this.isDescendant(child, descendant));
  }

  private removeNode(nodes: TreeNode[], id: string | number): boolean {
    const index = nodes.findIndex(node => node.id === id);
    if (index !== -1) {
      nodes.splice(index, 1);
      return true;
    }
    for (const node of nodes) {
      if (node.children && this.removeNode(node.children, id)) {
        return true;
      }
    }
    return false;
  }

  private insertNode(
    nodes: TreeNode[],
    nodeToInsert: TreeNode,
    targetNode: TreeNode,
    position: 'before' | 'after' | 'inside',
  ): void {
    if (position === 'inside') {
      // Insert as child of target node
      if (!targetNode.children) {
        targetNode.children = [];
        targetNode.hasChildren = true;
      }
      targetNode.children.push(nodeToInsert);
      nodeToInsert.parent = targetNode;
      // Expand target node to show the new child
      targetNode.expanded = true;
    } else {
      // Insert before or after target node
      const targetIndex = nodes.findIndex(node => node.id === targetNode.id);
      if (targetIndex !== -1) {
        const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
        nodes.splice(insertIndex, 0, nodeToInsert);
        nodeToInsert.parent = targetNode.parent;
      } else {
        // Target is nested, search in children
        for (const node of nodes) {
          if (node.children) {
            this.insertNodeInChildren(node.children, nodeToInsert, targetNode, position);
          }
        }
      }
    }
  }

  private insertNodeInChildren(
    children: TreeNode[],
    nodeToInsert: TreeNode,
    targetNode: TreeNode,
    position: 'before' | 'after' | 'inside',
  ): boolean {
    const targetIndex = children.findIndex(node => node.id === targetNode.id);
    if (targetIndex !== -1) {
      if (position === 'inside') {
        if (!targetNode.children) {
          targetNode.children = [];
          targetNode.hasChildren = true;
        }
        targetNode.children.push(nodeToInsert);
        nodeToInsert.parent = targetNode;
        targetNode.expanded = true;
      } else {
        const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
        children.splice(insertIndex, 0, nodeToInsert);
        nodeToInsert.parent = targetNode.parent;
      }
      return true;
    }
    for (const child of children) {
      if (
        child.children &&
        this.insertNodeInChildren(child.children, nodeToInsert, targetNode, position)
      ) {
        return true;
      }
    }
    return false;
  }

  private updateTreeStructure(
    nodes: TreeNode[],
    parent: TreeNode | null = null,
    level: number = 0,
  ): void {
    nodes.forEach(node => {
      node.parent = parent || undefined;
      node.level = level;
      if (node.children && node.children.length > 0) {
        node.hasChildren = true;
        this.updateTreeStructure(node.children, node, level + 1);
      } else {
        node.hasChildren = false;
      }
    });
  }

  private clearSelection(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      node.selected = false;
      if (node.children && node.children.length > 0) {
        this.clearSelection(node.children);
      }
    });
  }
}
