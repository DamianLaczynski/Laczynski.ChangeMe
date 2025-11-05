import { Component, input, output, TemplateRef, contentChild, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { Size, TreeStyle, Appearance, Orientation, ChevronPosition } from '../utils';
import { TreeNode } from '../tree-node/tree-node.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  imports: [CommonModule, TreeNodeComponent],
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
  chevronIconCollapsed = input<string>('chevron_right');
  chevronIconExpanded = input<string>('chevron_down');

  // Inputs - Behavior Configuration
  asButton = input<boolean>(false);
  expandOnClick = input<boolean>(false);
  selectOnClick = input<boolean>(true);

  // Inputs - Quick Actions
  showQuickActions = input<boolean>(false);

  // Content Projection
  contentTemplate = contentChild<TemplateRef<any>>('content');

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
