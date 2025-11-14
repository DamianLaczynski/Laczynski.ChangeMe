import { Component, input, output, signal, computed, TemplateRef } from '@angular/core';
import { ChevronPosition, Size, Appearance, Orientation } from '../utils';
import { TreeNode } from '../tree-node/tree-node.component';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { IconName } from '../icon';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  imports: [TreeNodeComponent],
})
export class AccordionComponent {
  label = input.required<string>();
  size = input<Size>('medium');
  chevronPosition = input<ChevronPosition>('before');
  disabled = input<boolean>(false);
  expanded = signal<boolean>(false);
  icon = input<IconName | undefined>(undefined);

  // Visual Configuration
  showSelectionIndicator = input<boolean>(false);
  indicatorPosition = input<Orientation>('vertical');
  variant = input<Appearance | undefined>(undefined);
  chevronIconCollapsed = input<IconName | undefined>(undefined);
  chevronIconExpanded = input<IconName | undefined>(undefined);

  // Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

  toggle = output<boolean>();

  // Create a TreeNode for the accordion header
  accordionNode = computed<TreeNode<any>>(() => ({
    id: 'accordion-node',
    label: this.label(),
    icon: this.icon(),
    disabled: this.disabled(),
    hasChildren: true,
    expanded: this.expanded(),
    children: [],
  }));

  // Computed chevron icons based on position if not explicitly provided
  computedChevronIconCollapsed = computed<IconName>(() => {
    if (this.chevronIconCollapsed()) {
      return this.chevronIconCollapsed()!;
    }
    return this.chevronPosition() === 'before' ? 'chevron_right' : 'chevron_down';
  });

  computedChevronIconExpanded = computed<IconName>(() => {
    if (this.chevronIconExpanded()) {
      return this.chevronIconExpanded()!;
    }
    return this.chevronPosition() === 'before' ? 'chevron_down' : 'chevron_up';
  });

  accordionClasses(): string {
    const classes = ['accordion'];

    classes.push(`accordion--${this.size()}`);

    if (this.expanded()) {
      classes.push('accordion--expanded');
    }

    if (this.disabled()) {
      classes.push('accordion--disabled');
    }

    return classes.join(' ');
  }

  onNodeToggle(node: TreeNode<any>): void {
    if (this.disabled()) {
      return;
    }

    this.expanded.set(node.expanded || false);
    this.toggle.emit(this.expanded());
  }
}
