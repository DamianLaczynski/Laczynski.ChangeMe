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
import { Size, Appearance, Orientation } from '../utils';

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

  // Inputs - Behavior Configuration
  asButton = input<boolean>(false);
  selectOnClick = input<boolean>(true);

  // Inputs - Quick Actions
  showQuickActions = input<boolean>(false);
  quickActionsTemplate = input<TemplateRef<any> | null>(null);

  // Inputs - Drag and Drop
  draggable = input<boolean>(false);
  dragData = input<any>(null);
  dropZone = input<boolean>(false);
  dropZonePosition = input<'before' | 'after' | 'inside'>('inside');

  // Outputs
  nodeClick = output<Node>();
  nodeSelect = output<Node>();
  dragStart = output<{ node: Node; event: DragEvent; data?: any }>();
  dragEnd = output<{ node: Node; event: DragEvent }>();
  drag = output<{ node: Node; event: DragEvent }>();
  drop = output<{ node: Node; event: DragEvent; position: 'before' | 'after' | 'inside' }>();
  dragOver = output<{ node: Node; event: DragEvent; position: 'before' | 'after' | 'inside' }>();
  dragLeave = output<{ node: Node; event: DragEvent }>();

  contentTemplate = contentChild<TemplateRef<any>>('content');

  private nodeElement = viewChild<ElementRef>('nodeElement');

  // Drop zone state
  isDragOver = signal<boolean>(false);
  dropPosition = signal<'before' | 'after' | 'inside' | null>(null);

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

    // Add variant classes
    const variant = this.variant();
    if (variant) {
      classes.push(`node--${variant}`);
    }

    // Add indicator position classes
    const indicatorPosition = this.indicatorPosition();
    if (this.showSelectionIndicator()) {
      classes.push(`node--indicator-${indicatorPosition}`);
    }

    return classes.join(' ');
  }

  contentClasses(): string {
    const classes = ['node__content'];

    if (this.asButton()) {
      classes.push('node__content--button');
    }

    if (this.draggable() && !this.node().disabled) {
      classes.push('node__content--draggable');
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
    return !!this.node().icon;
  }

  /**
   * Check if label should be shown
   */
  shouldShowLabel(): boolean {
    return true;
  }

  /**
   * Get selector width for horizontal indicator
   */
  getSelectorWidth(): string {
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

  getTabIndex(): number {
    return this.node().disabled ? -1 : 0;
  }

  getRole(): string {
    if (this.asButton()) {
      return 'button';
    }
    return 'treeitem';
  }

  // Drag and drop handlers
  onDragStart(event: DragEvent): void {
    if (!this.draggable() || this.node().disabled) {
      event.preventDefault();
      return;
    }

    const dragData = this.dragData() ?? this.node();
    event.dataTransfer!.effectAllowed = 'move';

    // Remove circular references before serialization
    const serializableData = this.removeCircularReferences(dragData);
    event.dataTransfer!.setData('application/json', JSON.stringify(serializableData));
    event.dataTransfer!.setData('text/plain', this.node().label);

    this.dragStart.emit({ node: this.node(), event, data: dragData });
  }

  /**
   * Remove circular references from object to allow JSON serialization
   */
  private removeCircularReferences(obj: any, visited = new WeakSet()): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (visited.has(obj)) {
      return undefined; // Circular reference detected
    }

    visited.add(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => this.removeCircularReferences(item, visited));
    }

    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Skip parent reference to break circular dependency
        if (key === 'parent') {
          continue;
        }
        const value = this.removeCircularReferences(obj[key], visited);
        if (value !== undefined) {
          result[key] = value;
        }
      }
    }

    return result;
  }

  onDragEnd(event: DragEvent): void {
    this.dragEnd.emit({ node: this.node(), event });
  }

  onDrag(event: DragEvent): void {
    this.drag.emit({ node: this.node(), event });
  }

  // Drop zone handlers
  onDragOver(event: DragEvent): void {
    if (!this.dropZone() || this.node().disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = 'move';

    const position = this.calculateDropPosition(event);
    this.isDragOver.set(true);
    this.dropPosition.set(position);

    this.dragOver.emit({ node: this.node(), event, position });
  }

  onDragLeave(event: DragEvent): void {
    if (!this.dropZone()) {
      return;
    }

    // Only clear if we're actually leaving the drop zone
    const relatedTarget = event.relatedTarget as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;
    if (!currentTarget.contains(relatedTarget)) {
      this.isDragOver.set(false);
      this.dropPosition.set(null);
      this.dragLeave.emit({ node: this.node(), event });
    }
  }

  onDrop(event: DragEvent): void {
    if (!this.dropZone() || this.node().disabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const position = this.dropPosition() || this.dropZonePosition();
    this.isDragOver.set(false);
    this.dropPosition.set(null);

    this.drop.emit({ node: this.node(), event, position });
  }

  private calculateDropPosition(event: DragEvent): 'before' | 'after' | 'inside' {
    if (!this.dropZone()) {
      return 'inside';
    }

    const element = event.currentTarget as HTMLElement;
    if (!element) {
      return this.dropZonePosition();
    }

    // Only support 'inside' position for node component
    // 'before' and 'after' are handled by parent tree components
    return 'inside';
  }

  getDropZoneClasses(): string {
    const classes = ['node__drop-zone'];

    if (this.isDragOver()) {
      classes.push('node__drop-zone--drag-over');
      const position = this.dropPosition();
      if (position) {
        classes.push(`node__drop-zone--${position}`);
      }
    }

    return classes.join(' ');
  }
}
