import {
  Component,
  input,
  output,
  signal,
  effect,
  ElementRef,
  viewChildren,
  contentChildren,
  afterNextRender,
  TemplateRef,
  Directive,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Orientation } from '../utils';

@Directive({
  selector: '[appSplitterPanel]',
})
export class SplitterPanelDirective {
  @Input('appSplitterPanel') id!: string;

  constructor(public templateRef: TemplateRef<any>) {}
}

export interface SplitterPanel {
  id: string;
  size?: number; // Initial size in pixels or percentage
  minSize?: number; // Minimum size in pixels
  maxSize?: number; // Maximum size in pixels
  collapsed?: boolean; // Is the panel currently collapsed
  resizable?: boolean; // Can this panel be resized (default: true)
}

export interface SplitterResizeEvent {
  panelIndex: number;
  newSize: number;
  panelId: string;
}

@Component({
  selector: 'app-splitter',

  imports: [CommonModule],
  templateUrl: './splitter.component.html',
})
export class SplitterComponent {
  orientation = input<Orientation>('horizontal');
  panels = input.required<SplitterPanel[]>();
  gutterSize = input<number>(6);
  ariaLabel = input<string>('Resizable splitter');

  panelResize = output<SplitterResizeEvent>();
  panelCollapse = output<{ panelIndex: number; panelId: string }>();
  panelExpand = output<{ panelIndex: number; panelId: string }>();

  panelSizes = signal<number[]>([]);
  isDragging = signal<boolean>(false);
  currentGutterIndex = signal<number>(-1);

  panelTemplates = contentChildren(SplitterPanelDirective);

  private panelElements = viewChildren<ElementRef>('panel');

  getPanelTemplate(panelId: string): TemplateRef<any> | null {
    const template = this.panelTemplates().find(t => t.id === panelId);
    return template?.templateRef || null;
  }

  private dragStartPosition = 0;
  private dragStartSizes: number[] = [];
  private containerSize = 0;

  constructor() {
    effect(() => {
      const panels = this.panels();
      if (panels.length > 0) {
        this.initializePanelSizes();
      }
    });

    // Listen for window resize to adjust panels
    afterNextRender(() => {
      window.addEventListener('resize', () => this.onWindowResize());
    });
  }

  private initializePanelSizes(): void {
    const panels = this.panels();
    const sizes: number[] = [];

    // If panels have defined sizes, use them
    const hasDefinedSizes = panels.some(p => p.size !== undefined);

    if (hasDefinedSizes) {
      panels.forEach(panel => {
        sizes.push(panel.collapsed ? 0 : panel.size || 100);
      });
    } else {
      // Equal distribution
      const equalSize = 100 / panels.length;
      panels.forEach(() => sizes.push(equalSize));
    }

    this.panelSizes.set(sizes);
  }

  private onWindowResize(): void {
    // Recalculate sizes on window resize
    this.initializePanelSizes();
  }

  splitterClasses(): string {
    const classes = ['splitter'];
    classes.push(`splitter--${this.orientation()}`);

    if (this.isDragging()) {
      classes.push('splitter--dragging');
    }

    return classes.join(' ');
  }

  panelClasses(index: number): string {
    const classes = ['splitter__panel'];
    const panel = this.panels()[index];

    if (panel.collapsed) {
      classes.push('splitter__panel--collapsed');
    }

    if (panel.resizable === false) {
      classes.push('splitter__panel--non-resizable');
    }

    return classes.join(' ');
  }

  gutterClasses(index: number): string {
    const classes = ['splitter__gutter'];

    if (this.currentGutterIndex() === index && this.isDragging()) {
      classes.push('splitter__gutter--dragging');
    }

    const panel = this.panels()[index];
    const nextPanel = this.panels()[index + 1];

    if (panel?.resizable === false || nextPanel?.resizable === false) {
      classes.push('splitter__gutter--disabled');
    }

    return classes.join(' ');
  }

  getPanelStyle(index: number): Record<string, string> {
    const size = this.panelSizes()[index];
    const isHorizontal = this.orientation() === 'horizontal';

    // Calculate total gutter size to subtract from percentage
    const numberOfGutters = this.panels().length - 1;
    const totalGutterSize = numberOfGutters * this.gutterSize();
    const gutterAdjustment = (totalGutterSize * size) / 100;

    return {
      [isHorizontal ? 'width' : 'height']: `calc(${size}% - ${gutterAdjustment}px)`,
      [isHorizontal ? 'height' : 'width']: '100%',
    };
  }

  getGutterStyle(): Record<string, string> {
    const isHorizontal = this.orientation() === 'horizontal';
    const gutterSize = this.gutterSize();

    return {
      [isHorizontal ? 'width' : 'height']: `${gutterSize}px`,
      [isHorizontal ? 'min-height' : 'min-width']: '100%',
    };
  }

  canResize(gutterIndex: number): boolean {
    const panel = this.panels()[gutterIndex];
    const nextPanel = this.panels()[gutterIndex + 1];

    return (
      panel?.resizable !== false &&
      nextPanel?.resizable !== false &&
      !panel?.collapsed &&
      !nextPanel?.collapsed
    );
  }

  onGutterMouseDown(event: MouseEvent, gutterIndex: number): void {
    if (!this.canResize(gutterIndex)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.isDragging.set(true);
    this.currentGutterIndex.set(gutterIndex);

    const isHorizontal = this.orientation() === 'horizontal';
    this.dragStartPosition = isHorizontal ? event.clientX : event.clientY;
    this.dragStartSizes = [...this.panelSizes()];

    // Get container size
    const container = (event.target as HTMLElement).closest('.splitter');
    if (container) {
      const rect = container.getBoundingClientRect();
      this.containerSize = isHorizontal ? rect.width : rect.height;
    }

    // Add global listeners
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging()) return;

    const isHorizontal = this.orientation() === 'horizontal';
    const currentPosition = isHorizontal ? event.clientX : event.clientY;
    const delta = currentPosition - this.dragStartPosition;
    const deltaPercent = (delta / this.containerSize) * 100;

    const gutterIndex = this.currentGutterIndex();
    const newSizes = [...this.dragStartSizes];

    // Calculate target total (sum of both panels)
    const targetTotal = this.dragStartSizes[gutterIndex] + this.dragStartSizes[gutterIndex + 1];

    // Calculate desired sizes
    let leftSize = this.dragStartSizes[gutterIndex] + deltaPercent;
    let rightSize = this.dragStartSizes[gutterIndex + 1] - deltaPercent;

    // Get constraints
    const leftPanel = this.panels()[gutterIndex];
    const rightPanel = this.panels()[gutterIndex + 1];

    const leftMin = leftPanel.minSize ? (leftPanel.minSize / this.containerSize) * 100 : 0;
    const leftMax = leftPanel.maxSize ? (leftPanel.maxSize / this.containerSize) * 100 : 100;
    const rightMin = rightPanel.minSize ? (rightPanel.minSize / this.containerSize) * 100 : 0;
    const rightMax = rightPanel.maxSize ? (rightPanel.maxSize / this.containerSize) * 100 : 100;

    // Apply constraints while maintaining total size
    // Priority: respect minimum sizes first, then maximum sizes

    // Check if desired leftSize violates constraints
    if (leftSize < leftMin) {
      leftSize = leftMin;
      rightSize = targetTotal - leftSize;
    } else if (leftSize > leftMax) {
      leftSize = leftMax;
      rightSize = targetTotal - leftSize;
    }

    // Check if resulting rightSize violates its constraints
    if (rightSize < rightMin) {
      rightSize = rightMin;
      leftSize = targetTotal - rightSize;
      // Re-check leftSize constraints after adjustment
      if (leftSize > leftMax) {
        leftSize = leftMax;
        rightSize = targetTotal - leftSize;
      }
    } else if (rightSize > rightMax) {
      rightSize = rightMax;
      leftSize = targetTotal - rightSize;
      // Re-check leftSize constraints after adjustment
      if (leftSize < leftMin) {
        leftSize = leftMin;
        rightSize = targetTotal - leftSize;
      }
    }

    // Final safety check: ensure we're within all constraints
    leftSize = Math.max(leftMin, Math.min(leftMax, leftSize));
    rightSize = Math.max(rightMin, Math.min(rightMax, rightSize));

    // Ensure exact total (handle floating point errors)
    const actualTotal = leftSize + rightSize;
    if (Math.abs(actualTotal - targetTotal) > 0.001) {
      // Adjust the panel that has more room to adjust
      const leftRoom = Math.min(leftSize - leftMin, leftMax - leftSize);
      const rightRoom = Math.min(rightSize - rightMin, rightMax - rightSize);

      if (leftRoom >= rightRoom) {
        leftSize = targetTotal - rightSize;
        leftSize = Math.max(leftMin, Math.min(leftMax, leftSize));
      } else {
        rightSize = targetTotal - leftSize;
        rightSize = Math.max(rightMin, Math.min(rightMax, rightSize));
      }
    }

    newSizes[gutterIndex] = leftSize;
    newSizes[gutterIndex + 1] = rightSize;

    this.panelSizes.set(newSizes);
  };

  private onMouseUp = (event: MouseEvent): void => {
    if (!this.isDragging()) return;

    const gutterIndex = this.currentGutterIndex();
    const newSize = this.panelSizes()[gutterIndex];

    // Emit resize events
    this.panelResize.emit({
      panelIndex: gutterIndex,
      newSize: newSize,
      panelId: this.panels()[gutterIndex].id,
    });

    this.panelResize.emit({
      panelIndex: gutterIndex + 1,
      newSize: this.panelSizes()[gutterIndex + 1],
      panelId: this.panels()[gutterIndex + 1].id,
    });

    this.isDragging.set(false);
    this.currentGutterIndex.set(-1);

    // Remove global listeners
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  onGutterKeyDown(event: KeyboardEvent, gutterIndex: number): void {
    if (!this.canResize(gutterIndex)) {
      return;
    }

    const isHorizontal = this.orientation() === 'horizontal';
    let delta = 0;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        delta =
          isHorizontal && event.key === 'ArrowLeft'
            ? -10
            : !isHorizontal && event.key === 'ArrowUp'
              ? -10
              : 0;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        delta =
          isHorizontal && event.key === 'ArrowRight'
            ? 10
            : !isHorizontal && event.key === 'ArrowDown'
              ? 10
              : 0;
        break;
      case 'Home':
        event.preventDefault();
        // Minimize left panel
        delta = -this.panelSizes()[gutterIndex];
        break;
      case 'End':
        event.preventDefault();
        // Minimize right panel
        delta = this.panelSizes()[gutterIndex + 1];
        break;
    }

    if (delta !== 0) {
      this.resizeByKeyboard(gutterIndex, delta);
    }
  }

  private resizeByKeyboard(gutterIndex: number, deltaPixels: number): void {
    const container = document.querySelector('.splitter');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const isHorizontal = this.orientation() === 'horizontal';
    this.containerSize = isHorizontal ? rect.width : rect.height;

    const deltaPercent = (deltaPixels / this.containerSize) * 100;
    const currentSizes = [...this.panelSizes()];

    // Calculate target total
    const targetTotal = currentSizes[gutterIndex] + currentSizes[gutterIndex + 1];

    // Calculate desired sizes
    let leftSize = currentSizes[gutterIndex] + deltaPercent;
    let rightSize = currentSizes[gutterIndex + 1] - deltaPercent;

    // Get constraints
    const leftPanel = this.panels()[gutterIndex];
    const rightPanel = this.panels()[gutterIndex + 1];

    const leftMin = leftPanel.minSize ? (leftPanel.minSize / this.containerSize) * 100 : 0;
    const leftMax = leftPanel.maxSize ? (leftPanel.maxSize / this.containerSize) * 100 : 100;
    const rightMin = rightPanel.minSize ? (rightPanel.minSize / this.containerSize) * 100 : 0;
    const rightMax = rightPanel.maxSize ? (rightPanel.maxSize / this.containerSize) * 100 : 100;

    // Apply constraints while maintaining total size
    if (leftSize < leftMin) {
      leftSize = leftMin;
      rightSize = targetTotal - leftSize;
    } else if (leftSize > leftMax) {
      leftSize = leftMax;
      rightSize = targetTotal - leftSize;
    }

    if (rightSize < rightMin) {
      rightSize = rightMin;
      leftSize = targetTotal - rightSize;
      if (leftSize > leftMax) {
        leftSize = leftMax;
        rightSize = targetTotal - leftSize;
      }
    } else if (rightSize > rightMax) {
      rightSize = rightMax;
      leftSize = targetTotal - rightSize;
      if (leftSize < leftMin) {
        leftSize = leftMin;
        rightSize = targetTotal - leftSize;
      }
    }

    // Final safety check
    leftSize = Math.max(leftMin, Math.min(leftMax, leftSize));
    rightSize = Math.max(rightMin, Math.min(rightMax, rightSize));

    // Ensure exact total
    const actualTotal = leftSize + rightSize;
    if (Math.abs(actualTotal - targetTotal) > 0.001) {
      const leftRoom = Math.min(leftSize - leftMin, leftMax - leftSize);
      const rightRoom = Math.min(rightSize - rightMin, rightMax - rightSize);

      if (leftRoom >= rightRoom) {
        leftSize = targetTotal - rightSize;
        leftSize = Math.max(leftMin, Math.min(leftMax, leftSize));
      } else {
        rightSize = targetTotal - leftSize;
        rightSize = Math.max(rightMin, Math.min(rightMax, rightSize));
      }
    }

    const newSizes = [...this.panelSizes()];
    newSizes[gutterIndex] = leftSize;
    newSizes[gutterIndex + 1] = rightSize;

    this.panelSizes.set(newSizes);

    this.panelResize.emit({
      panelIndex: gutterIndex,
      newSize: newSizes[gutterIndex],
      panelId: this.panels()[gutterIndex].id,
    });

    this.panelResize.emit({
      panelIndex: gutterIndex + 1,
      newSize: newSizes[gutterIndex + 1],
      panelId: this.panels()[gutterIndex + 1].id,
    });
  }

  getGutterAriaLabel(gutterIndex: number): string {
    const leftPanel = this.panels()[gutterIndex];
    const rightPanel = this.panels()[gutterIndex + 1];
    return `Resize ${leftPanel.id} and ${rightPanel.id} panels`;
  }

  getGutterTabIndex(gutterIndex: number): number {
    return this.canResize(gutterIndex) ? 0 : -1;
  }
}
