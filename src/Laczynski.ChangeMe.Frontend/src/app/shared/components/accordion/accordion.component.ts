import { Component, input, output, signal, computed } from '@angular/core';
import { ChevronPosition, Size } from '../utils';
import { TreeNode } from '../tree-node/tree-node.component';
import { TreeNodeComponent } from '../tree-node/tree-node.component';

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
  icon = input<string>('');

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
