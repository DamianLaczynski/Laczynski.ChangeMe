import { Component, input, model, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode, TreeNodeComponent } from '../tree-node/tree-node.component';
import { NavSectionHeaderComponent } from './nav-section-header.component';
import { DividerComponent } from '../divider';
import { Size, ChevronPosition, Appearance, Orientation } from '../utils';
import { IconName } from '../icon';

export interface NavNode extends TreeNode<any> {
  isDivider?: boolean;
  isSectionHeader?: boolean;
  size?: Size;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  imports: [CommonModule, TreeNodeComponent, NavSectionHeaderComponent, DividerComponent],
})
export class NavComponent {
  // Configuration inputs
  width = input<number>(260);
  collapsedWidth = input<number>(56);

  items = input<NavNode[]>([]);

  // Tree Node Configuration Inputs
  size = input<Size>('medium');
  showSelectionIndicator = input<boolean>(true);
  indicatorPosition = input<Orientation>('vertical');
  variant = input<Appearance | undefined>(undefined);
  chevronPosition = input<ChevronPosition>('after');
  chevronIconCollapsed = input<IconName>('chevron_down');
  chevronIconExpanded = input<IconName>('chevron_up');
  asButton = input<boolean>(true);
  expandOnClick = input<boolean | undefined>(undefined);
  selectOnClick = input<boolean | undefined>(undefined);
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);
  contentTemplate = input<TemplateRef<any> | null>(null);

  // Handle item click
  onItemClick(item: NavNode): void {
    if (item.onClick) {
      item.onClick();
    }
  }

  // Helper methods to determine behavior
  shouldExpandOnClick(item: NavNode): boolean {
    const expandOnClick = this.expandOnClick();
    if (expandOnClick !== undefined) {
      return expandOnClick;
    }
    // Auto-detect: expand if has children
    return !!(item.children && item.children.length > 0);
  }

  shouldSelectOnClick(item: NavNode): boolean {
    const selectOnClick = this.selectOnClick();
    if (selectOnClick !== undefined) {
      return selectOnClick;
    }
    // Auto-detect: select if no children
    return !(item.children && item.children.length > 0);
  }

  getItemSize(item: NavNode): Size {
    return item.size || this.size();
  }
}
