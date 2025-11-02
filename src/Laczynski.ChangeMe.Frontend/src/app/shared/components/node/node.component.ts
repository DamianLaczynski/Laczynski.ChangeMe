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
import { Size, Appearance, Orientation, Layout } from '../utils';

export type Node<T = any> = {
  id: string | number;
  label: string;
  icon?: string;
  disabled?: boolean;
  selected?: boolean;
  data?: T;
  onClick?: () => void;
};

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
export class NodeComponent {
  // Inputs - Node Data
  node = input.required<Node>();
  size = input<Size>('medium');

  // Inputs - Visual Configuration
  showSelectionIndicator = input<boolean>(false);
  indicatorPosition = input<Orientation>('horizontal');
  variant = input<Appearance | undefined>(undefined);
  layout = input<Layout | undefined>(undefined);
  iconOnly = input<boolean>(false);

  // Inputs - Behavior Configuration
  asButton = input<boolean>(false);
  selectOnClick = input<boolean>(true);

  // Inputs - Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

  // Outputs
  nodeClick = output<Node>();
  nodeSelect = output<Node>();

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

    // Add variant classes
    const variant = this.variant();
    if (variant) {
      classes.push(`node--${variant}`);
    }

    // Add layout classes
    const layout = this.layout();
    if (layout) {
      classes.push(`node--${layout}`);
    }

    // Add indicator position classes
    const indicatorPosition = this.indicatorPosition();
    if (this.showSelectionIndicator()) {
      classes.push(`node--indicator-${indicatorPosition}`);
    }

    // Add icon-only class
    if (this.iconOnly()) {
      classes.push('node--icon-only');
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
    const position = this.indicatorPosition();

    classes.push(`node__selection-indicator--${position}`);

    if (this.node().selected) {
      classes.push('node__selection-indicator--visible');
    }

    return classes.join(' ');
  }

  /**
   * Check if icon should be shown
   */
  shouldShowIcon(): boolean {
    const layout = this.layout();
    if (layout === 'text-only') {
      return false;
    }
    return !!this.node().icon;
  }

  /**
   * Check if label should be shown
   */
  shouldShowLabel(): boolean {
    if (this.iconOnly()) {
      return false;
    }
    const layout = this.layout();
    return layout !== 'icon-only';
  }

  /**
   * Get selector width for horizontal indicator
   */
  getSelectorWidth(): string {
    if (this.layout() === 'icon-only') {
      return '16px';
    }
    if (this.layout() === 'text-only') {
      return '80%';
    }
    return '70%';
  }

  /**
   * Get selector height for vertical indicator
   */
  getSelectorHeight(): string {
    if (this.size() === 'small') {
      return '24';
    }
    return '32';
  }

  /**
   * Get selector height numeric value for viewBox
   */
  getSelectorHeightValue(): number {
    if (this.size() === 'small') {
      return 24;
    }
    return 32;
  }

  /**
   * Get vertical indicator SVG path
   */
  getVerticalIndicatorPath(): string {
    if (this.size() === 'small') {
      return 'M0 5.5C0 4.67157 0.671573 4 1.5 4C2.32843 4 3 4.67157 3 5.5V18.5C3 19.3284 2.32843 20 1.5 20C0.671573 20 0 19.3284 0 18.5V5.5Z';
    }
    return 'M0 9.5C0 8.67157 0.671573 8 1.5 8C2.32843 8 3 8.67157 3 9.5V22.5C3 23.3284 2.32843 24 1.5 24C0.671573 24 0 23.3284 0 22.5V9.5Z';
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
