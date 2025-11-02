import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  model,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { Size, TreeStyle } from '../utils';
import { TreeNode } from '../tree-node/tree-node.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  imports: [CommonModule, TreeNodeComponent],
})
export class TreeComponent {
  // Inputs
  nodes = model<TreeNode[]>([]);
  size = input<Size>('medium');
  style = input<TreeStyle>('subtle');
  showQuickActions = input<boolean>(false);

  // Template
  quickActionsTemplate = contentChild<TemplateRef<any>>('quickActions');

  // Outputs
  nodeClick = output<TreeNode>();
  nodeToggle = output<TreeNode>();
  nodeSelect = output<TreeNode>();

  // Internal state
  focusedNodeId = signal<string | number | null>(null);
  private flattenedNodes: TreeNode[] = [];

  constructor() {
    effect(() => {
      // Update flattened nodes when tree structure changes
      this.flattenedNodes = this.getFlattenedVisibleNodes(this.nodes());

      // Set initial focus to first node if no node is focused
      if (this.flattenedNodes.length > 0 && this.focusedNodeId() === null) {
        this.focusedNodeId.set(this.flattenedNodes[0].id);
      }
    });
  }

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
    // Update flattened nodes after toggle as visibility changed
    this.flattenedNodes = this.getFlattenedVisibleNodes(this.nodes());
  }

  onNodeSelect(node: TreeNode): void {
    this.clearSelection(this.nodes());
    node.selected = true;
    this.focusedNodeId.set(node.id);

    this.nodeSelect.emit(node);
  }

  onKeyNavigation(event: { key: string; node: TreeNode }): void {
    const currentIndex = this.flattenedNodes.findIndex(n => n.id === event.node.id);

    if (currentIndex === -1) return;

    let targetNode: TreeNode | null = null;

    switch (event.key) {
      case 'ArrowDown':
        // Move to next visible node
        if (currentIndex < this.flattenedNodes.length - 1) {
          targetNode = this.flattenedNodes[currentIndex + 1];
        }
        break;

      case 'ArrowUp':
        // Move to previous visible node
        if (currentIndex > 0) {
          targetNode = this.flattenedNodes[currentIndex - 1];
        }
        break;

      case 'Home':
        // Move to first node
        targetNode = this.flattenedNodes[0];
        break;

      case 'End':
        // Move to last visible node
        targetNode = this.flattenedNodes[this.flattenedNodes.length - 1];
        break;
    }

    if (targetNode) {
      this.focusedNodeId.set(targetNode.id);
    }
  }

  private clearSelection(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      node.selected = false;
      if (node.children && node.children.length > 0) {
        this.clearSelection(node.children);
      }
    });
  }

  private getFlattenedVisibleNodes(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];

    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        result.push(node);
        // Only include children if node is expanded
        if (node.expanded && node.children && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(nodes);
    return result;
  }
}
