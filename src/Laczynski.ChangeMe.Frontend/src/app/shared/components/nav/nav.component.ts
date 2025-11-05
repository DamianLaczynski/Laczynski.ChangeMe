import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNode, TreeNodeComponent } from '../tree-node/tree-node.component';
import { NavSectionHeaderComponent } from './nav-section-header.component';
import { Node } from '../node/node.component';
import { DividerComponent } from '../divider';
import { ButtonComponent } from '../button/button.component';
import { Size } from '../utils';

export interface NavNode extends TreeNode<any> {
  isDivider?: boolean;
  isSectionHeader?: boolean;
  size?: Size;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  imports: [
    CommonModule,
    TreeNodeComponent,
    NavSectionHeaderComponent,
    DividerComponent,
    ButtonComponent,
  ],
})
export class NavComponent {
  // Configuration inputs
  width = input<number>(260);
  collapsedWidth = input<number>(56);
  collapsible = input<boolean>(true);
  isCollapsed = model<boolean>(false);

  items = input<NavNode[]>([]);

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

    this.isCollapsed.set(!this.isCollapsed());
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
  onItemClick(item: NavNode): void {
    if (item.onClick) {
      item.onClick();
    }
  }
}
