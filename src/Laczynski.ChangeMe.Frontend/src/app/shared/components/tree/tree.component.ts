import { Component, input, output, TemplateRef, contentChild, model } from '@angular/core';
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

  private clearSelection(nodes: TreeNode[]): void {
    nodes.forEach(node => {
      node.selected = false;
      if (node.children && node.children.length > 0) {
        this.clearSelection(node.children);
      }
    });
  }
}
