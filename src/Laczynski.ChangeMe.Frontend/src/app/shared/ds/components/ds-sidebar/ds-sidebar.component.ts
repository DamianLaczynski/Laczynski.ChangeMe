import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TreeComponent, TreeNode } from '@shared/components/tree';
import { TextComponent } from '@shared/components/field/text/text.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DividerComponent } from '@shared/components/divider';

@Component({
  selector: 'app-ds-sidebar',
  imports: [TreeComponent, TextComponent, ButtonComponent, DividerComponent],
  templateUrl: './ds-sidebar.component.html',
})
export class DsSidebarComponent {
  private readonly router = inject(Router);
  treeNodes: TreeNode[] = [
    {
      id: 'form',
      label: 'Forms',
      hasChildren: true,
      children: [
        { id: 'checkbox', label: 'Checkbox' },
        { id: 'dropdown', label: 'Dropdown' },
        { id: 'number', label: 'Number' },
        { id: 'radio', label: 'Radio' },
        { id: 'slider', label: 'Slider' },
        { id: 'switch', label: 'Switch' },
        { id: 'text', label: 'Text' },
      ],
    },
    {
      id: 'accordion',
      label: 'Accordion',
    },
    {
      id: 'badge',
      label: 'Badge',
    },
    {
      id: 'breadcrumb',
      label: 'Breadcrumb',
    },
    {
      id: 'button',
      label: 'Button',
    },
    {
      id: 'card',
      label: 'Card',
    },

    {
      id: 'dialog',
      label: 'Dialog',
    },
    {
      id: 'divider',
      label: 'Divider',
    },

    {
      id: 'input',
      label: 'Input',
    },

    {
      id: 'progress-bar',
      label: 'Progress Bar',
    },
    {
      id: 'scroll-panel',
      label: 'Scroll Panel',
    },
    {
      id: 'skeleton',
      label: 'Skeleton',
    },
    {
      id: 'spinner',
      label: 'Spinner',
    },
    {
      id: 'splitter',
      label: 'Splitter',
    },
    {
      id: 'tag',
      label: 'Tag',
    },
    {
      id: 'tree',
      label: 'Tree',
    },
  ];

  onNodeSelect(node: TreeNode): void {
    this.router.navigate(['ds', node.id]);
  }
}
