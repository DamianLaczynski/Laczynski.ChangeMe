import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  ElementRef,
  viewChild,
  contentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Size, Node } from '../utils';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  imports: [CommonModule, IconComponent],
})
export class NodeComponent<T extends Node<any> = Node<any>> {
  // Inputs - Node Data
  node = input.required<T>();
  size = input<Size>('medium');

  // Inputs - Visual Configuration
  showSelectionIndicator = input<boolean>(false);

  // Inputs - Behavior Configuration
  asButton = input<boolean>(false);
  selectOnClick = input<boolean>(true);

  // Inputs - Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

  // Outputs
  nodeClick = output<T>();
  nodeSelect = output<T>();

  beforeTemplate = contentChild<TemplateRef<any>>('before');
  afterTemplate = contentChild<TemplateRef<any>>('after');

  // State
  isFocused = signal<boolean>(false);
  isHovered = signal<boolean>(false);

  private nodeElement = viewChild<ElementRef>('nodeElement');

  // CSS class generators
  nodeClasses(): string {
    const classes = ['node'];
    const node = this.node();

    classes.push(`node--${this.size()}`);

    if (node.selected) {
      classes.push('node--selected');
    }

    if (node.disabled) {
      classes.push('node--disabled');
    }

    if (this.isFocused()) {
      classes.push('node--focused');
    }

    if (this.isHovered()) {
      classes.push('node--hovered');
    }

    return classes.join(' ');
  }

  contentClasses(): string {
    const classes = ['node__content'];

    if (this.asButton()) {
      classes.push('node__content--button');
    }

    return classes.join(' ');
  }

  selectionIndicatorClasses(): string {
    const classes = ['node__selection-indicator'];

    if (this.node().selected) {
      classes.push('node__selection-indicator--visible');
    }

    return classes.join(' ');
  }

  // Event handlers
  onContentClick(event: MouseEvent | Event): void {
    if (this.node().disabled) {
      return;
    }

    if (event instanceof MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Always emit click event
    this.nodeClick.emit(this.node());

    // Handle select behavior
    if (this.selectOnClick()) {
      this.nodeSelect.emit(this.node());
    }
  }

  onFocus(): void {
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  getTabIndex(): number {
    return this.node().disabled ? -1 : 0;
  }

  getRole(): string {
    if (this.asButton()) {
      return 'button';
    }
    return 'treeitem';
  }
}
