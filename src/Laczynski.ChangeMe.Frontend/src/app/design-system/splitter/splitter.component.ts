// =============================================================================
// Splitter Component
// =============================================================================
// Resizable panel splitter component with horizontal/vertical orientations
// Signal-based architecture with accessibility support

import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  viewChild,
  ElementRef,
  HostListener,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SplitterConfig,
  SplitterPanel,
  SplitterOrientation,
  SplitterHandleVariant,
  SplitterResizeState,
  SplitterResizeEvent,
  SplitterResizeStartEvent,
  SplitterResizeEndEvent,
  DEFAULT_SPLITTER_CONFIG,
  createSplitterConfig,
  normalizePanelSizes,
  calculatePanelConstraints,
  positionToPanelSize,
  getSplitterOrientationStyles,
  createInitialPanels,
  getSplitterAriaAttributes,
  getSplitterHandleAriaAttributes,
} from './splitter.model';

@Component({
  selector: 'ds-splitter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ds-splitter',
    '[class]': 'hostClasses()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-resizable]': 'resizable()',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.role]': '"group"',
  },
})
export class SplitterComponent implements OnDestroy {
  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Splitter orientation */
  orientation = input<SplitterOrientation>('horizontal');

  /** Whether splitter is resizable */
  resizable = input<boolean>(true);

  /** Minimum panel size percentage */
  minSize = input<number>(10);

  /** Maximum panel size percentage */
  maxSize = input<number>(90);

  /** Initial panel sizes */
  initialSizes = input<number[]>([50, 50]);

  /** Splitter handle size in pixels */
  handleSize = input<number>(4);

  /** Whether to show split handle */
  showHandle = input<boolean>(true);

  /** Split handle variant */
  handleVariant = input<SplitterHandleVariant>('default');

  /** Number of panels */
  panelCount = input<number>(2);

  /** Custom CSS classes */
  customClasses = input<string>('');

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  /** Emitted when panel is resized */
  panelResize = output<SplitterResizeEvent>();

  /** Emitted when resize starts */
  resizeStart = output<SplitterResizeStartEvent>();

  /** Emitted when resize ends */
  resizeEnd = output<SplitterResizeEndEvent>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  splitterContainer = viewChild<ElementRef<HTMLDivElement>>('splitterContainer');

  // =============================================================================
  // SIGNALS
  // =============================================================================

  /** Current splitter configuration */
  config = computed(() =>
    createSplitterConfig({
      orientation: this.orientation(),
      resizable: this.resizable(),
      minSize: this.minSize(),
      maxSize: this.maxSize(),
      initialSizes: this.initialSizes(),
      handleSize: this.handleSize(),
      showHandle: this.showHandle(),
      handleVariant: this.handleVariant(),
    }),
  );

  /** Current panels state */
  panels = signal<SplitterPanel[]>([]);

  /** Current resize state */
  resizeState = signal<SplitterResizeState>({
    isResizing: false,
    activePanelIndex: -1,
    startPosition: 0,
    currentPosition: 0,
    startSizes: [],
  });

  /** Host CSS classes */
  hostClasses = computed(() => {
    const config = this.config();
    const resizeState = this.resizeState();

    return [
      'ds-splitter',
      `ds-splitter--${config.orientation}`,
      `ds-splitter--handle-${config.handleVariant}`,
      config.resizable ? 'ds-splitter--resizable' : 'ds-splitter--static',
      resizeState.isResizing ? 'ds-splitter--resizing' : '',
      this.customClasses(),
    ]
      .filter(Boolean)
      .join(' ');
  });

  /** Splitter container styles */
  containerStyles = computed(() => {
    const config = this.config();
    const orientationStyles = getSplitterOrientationStyles(config.orientation);

    return {
      'flex-direction': orientationStyles.flexDirection,
      height: '100%',
      width: '100%',
    };
  });

  /** Panel styles */
  panelStyles = computed(() => {
    const panels = this.panels();
    const config = this.config();

    return panels.map((panel, index) => ({
      flex: `0 0 ${panel.size}%`,
      'min-width': config.orientation === 'horizontal' ? `${config.minSize}%` : undefined,
      'min-height': config.orientation === 'vertical' ? `${config.minSize}%` : undefined,
      overflow: 'hidden',
    }));
  });

  /** Handle styles */
  handleStyles = computed(() => {
    const config = this.config();
    const orientationStyles = getSplitterOrientationStyles(config.orientation);

    return {
      cursor: config.resizable ? orientationStyles.cursor : 'default',
      width: config.orientation === 'horizontal' ? `${config.handleSize}px` : '100%',
      height: config.orientation === 'vertical' ? `${config.handleSize}px` : '100%',
      flex: '0 0 auto',
    };
  });

  // =============================================================================
  // EFFECTS
  // =============================================================================

  /** Initialize panels when configuration changes */
  private initializePanelsEffect = effect(() => {
    const config = this.config();
    const count = this.panelCount();

    const initialPanels = createInitialPanels(count, config.initialSizes);
    this.panels.set(initialPanels);
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle mouse down on splitter handle */
  onHandleMouseDown(event: MouseEvent, handleIndex: number): void {
    if (!this.resizable()) return;

    event.preventDefault();
    event.stopPropagation();

    const container = this.splitterContainer()?.nativeElement;
    if (!container) return;

    const startPosition = this.orientation() === 'horizontal' ? event.clientX : event.clientY;

    const panels = this.panels();
    const startSizes = panels.map(p => p.size);

    this.resizeState.set({
      isResizing: true,
      activePanelIndex: handleIndex,
      startPosition,
      currentPosition: startPosition,
      startSizes,
    });

    this.resizeStart.emit({
      panelIndex: handleIndex,
      currentSize: panels[handleIndex].size,
      startPosition,
      originalEvent: event,
    });

    // Add global event listeners
    document.addEventListener('mousemove', this.onDocumentMouseMove);
    document.addEventListener('mouseup', this.onDocumentMouseUp);
    document.body.style.cursor = this.orientation() === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }

  /** Handle touch start on splitter handle */
  onHandleTouchStart(event: TouchEvent, handleIndex: number): void {
    if (!this.resizable()) return;

    event.preventDefault();
    event.stopPropagation();

    const touch = event.touches[0];
    const startPosition = this.orientation() === 'horizontal' ? touch.clientX : touch.clientY;

    const panels = this.panels();
    const startSizes = panels.map(p => p.size);

    this.resizeState.set({
      isResizing: true,
      activePanelIndex: handleIndex,
      startPosition,
      currentPosition: startPosition,
      startSizes,
    });

    this.resizeStart.emit({
      panelIndex: handleIndex,
      currentSize: panels[handleIndex].size,
      startPosition,
      originalEvent: event,
    });

    // Add global touch event listeners
    document.addEventListener('touchmove', this.onDocumentTouchMove, { passive: false });
    document.addEventListener('touchend', this.onDocumentTouchEnd);
  }

  /** Handle keyboard navigation on splitter handle */
  onHandleKeyDown(event: KeyboardEvent, handleIndex: number): void {
    if (!this.resizable()) return;

    const step = 5; // 5% step for keyboard navigation
    let deltaSize = 0;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        deltaSize = -step;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        deltaSize = step;
        break;
      case 'Home':
        deltaSize = this.minSize() - this.panels()[handleIndex].size;
        break;
      case 'End':
        deltaSize = this.maxSize() - this.panels()[handleIndex].size;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.adjustPanelSize(handleIndex, deltaSize);
  }

  // =============================================================================
  // GLOBAL EVENT HANDLERS
  // =============================================================================

  private onDocumentMouseMove = (event: MouseEvent) => {
    this.handleResizeMove(event.clientX, event.clientY, event);
  };

  private onDocumentMouseUp = (event: MouseEvent) => {
    this.handleResizeEnd(event);
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
  };

  private onDocumentTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    this.handleResizeMove(touch.clientX, touch.clientY, event);
  };

  private onDocumentTouchEnd = (event: TouchEvent) => {
    this.handleResizeEnd(event);
    document.removeEventListener('touchmove', this.onDocumentTouchMove);
    document.removeEventListener('touchend', this.onDocumentTouchEnd);
  };

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private handleResizeMove(clientX: number, clientY: number, originalEvent: Event): void {
    const resizeState = this.resizeState();
    if (!resizeState.isResizing) return;

    const container = this.splitterContainer()?.nativeElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const currentPosition = this.orientation() === 'horizontal' ? clientX : clientY;
    const containerSize =
      this.orientation() === 'horizontal' ? containerRect.width : containerRect.height;

    const delta = currentPosition - resizeState.startPosition;
    const deltaPercentage = (delta / containerSize) * 100;

    // Use start sizes as base for calculation
    this.updatePanelSizesFromDelta(
      resizeState.activePanelIndex,
      deltaPercentage,
      resizeState.startSizes,
      originalEvent,
    );

    this.resizeState.update(state => ({
      ...state,
      currentPosition,
    }));
  }

  private updatePanelSizesFromDelta(
    panelIndex: number,
    deltaPercentage: number,
    startSizes: number[],
    originalEvent: Event,
  ): void {
    const panels = this.panels();
    if (panelIndex < 0 || panelIndex >= panels.length - 1) return;

    // Calculate new sizes based on start sizes + delta
    const proposedCurrentSize = startSizes[panelIndex] + deltaPercentage;
    const proposedNextSize = startSizes[panelIndex + 1] - deltaPercentage;

    // Check constraints for both panels
    const currentMinSize = this.minSize();
    const currentMaxSize = this.maxSize();

    // If either panel would violate constraints, stop the resize
    if (
      proposedCurrentSize < currentMinSize ||
      proposedCurrentSize > currentMaxSize ||
      proposedNextSize < currentMinSize ||
      proposedNextSize > currentMaxSize
    ) {
      // Update cursor to indicate resize is blocked
      const cursor = this.orientation() === 'horizontal' ? 'not-allowed' : 'not-allowed';
      document.body.style.cursor = cursor;

      return; // Don't update anything if constraints would be violated
    }

    // Reset cursor to normal resize cursor
    const normalCursor = this.orientation() === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.cursor = normalCursor;

    // Apply the changes only to the two affected panels
    const updatedPanels = panels.map((panel, index) => {
      if (index === panelIndex) {
        return { ...panel, size: proposedCurrentSize };
      } else if (index === panelIndex + 1) {
        return { ...panel, size: proposedNextSize };
      }
      return panel; // Keep other panels unchanged
    });

    this.panels.set(updatedPanels);

    this.panelResize.emit({
      panelIndex,
      newSize: proposedCurrentSize,
      allSizes: updatedPanels.map(p => p.size),
      originalEvent: originalEvent as MouseEvent | TouchEvent,
    });
  }

  private handleResizeEnd(originalEvent: Event): void {
    const resizeState = this.resizeState();
    const panels = this.panels();

    if (resizeState.isResizing && resizeState.activePanelIndex >= 0) {
      this.resizeEnd.emit({
        panelIndex: resizeState.activePanelIndex,
        finalSize: panels[resizeState.activePanelIndex].size,
        finalSizes: panels.map(p => p.size),
        originalEvent: originalEvent as MouseEvent | TouchEvent,
      });
    }

    this.resizeState.set({
      isResizing: false,
      activePanelIndex: -1,
      startPosition: 0,
      currentPosition: 0,
      startSizes: [],
    });

    // Reset global styles
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  private adjustPanelSize(panelIndex: number, deltaPercentage: number): void {
    const panels = this.panels();
    if (panelIndex < 0 || panelIndex >= panels.length - 1) return;

    const currentSizes = panels.map(p => p.size);
    this.updatePanelSizesFromDelta(
      panelIndex,
      deltaPercentage,
      currentSizes,
      new MouseEvent('keydown'),
    );
  }

  // =============================================================================
  // ACCESSIBILITY METHODS
  // =============================================================================

  getSplitterAriaAttributes() {
    const config = this.config();
    const panels = this.panels();

    return getSplitterAriaAttributes(config.orientation, config.resizable, panels.length);
  }

  getHandleAriaAttributes(handleIndex: number) {
    const config = this.config();
    const panels = this.panels();

    if (handleIndex >= 0 && handleIndex < panels.length) {
      return getSplitterHandleAriaAttributes(
        handleIndex,
        config.orientation,
        panels[handleIndex].size,
      );
    }

    return {};
  }

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnDestroy(): void {
    // Clean up global event listeners
    document.removeEventListener('mousemove', this.onDocumentMouseMove);
    document.removeEventListener('mouseup', this.onDocumentMouseUp);
    document.removeEventListener('touchmove', this.onDocumentTouchMove);
    document.removeEventListener('touchend', this.onDocumentTouchEnd);

    // Reset global styles
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
}
