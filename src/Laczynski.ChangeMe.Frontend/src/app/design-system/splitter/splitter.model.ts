// =============================================================================
// Splitter Component Models
// =============================================================================
// Type definitions and interfaces for the Splitter component
// Supports horizontal and vertical splitting with resizable panels

// =============================================================================
// CORE SPLITTER INTERFACES
// =============================================================================

/**
 * Splitter component configuration
 */
export interface SplitterConfig {
  /** Splitter orientation */
  orientation: SplitterOrientation;

  /** Whether splitter is resizable */
  resizable: boolean;

  /** Minimum panel size */
  minSize: number;

  /** Maximum panel size */
  maxSize: number;

  /** Initial panel sizes */
  initialSizes: number[];

  /** Splitter handle size */
  handleSize: number;

  /** Whether to show split handle */
  showHandle: boolean;

  /** Split handle variant */
  handleVariant: SplitterHandleVariant;
}

/**
 * Splitter panel configuration
 */
export interface SplitterPanel {
  /** Panel id */
  id: string;

  /** Panel size (percentage or pixels) */
  size: number;

  /** Minimum panel size */
  minSize?: number;

  /** Maximum panel size */
  maxSize?: number;

  /** Panel content template */
  content?: any;
}

/**
 * Splitter resize state
 */
export interface SplitterResizeState {
  /** Whether currently resizing */
  isResizing: boolean;

  /** Active panel index being resized */
  activePanelIndex: number;

  /** Start position of resize */
  startPosition: number;

  /** Current position during resize */
  currentPosition: number;

  /** Panel sizes at start of resize */
  startSizes: number[];
}

// =============================================================================
// SPLITTER TYPES & VARIANTS
// =============================================================================

/**
 * Splitter orientation
 */
export type SplitterOrientation = 'horizontal' | 'vertical';

/**
 * Splitter handle variants
 */
export type SplitterHandleVariant = 'default' | 'ghost' | 'accent';

/**
 * Splitter size unit
 */
export type SplitterSizeUnit = 'percentage' | 'pixels';

// =============================================================================
// SPLITTER EVENTS
// =============================================================================

/**
 * Splitter panel resize event
 */
export interface SplitterResizeEvent {
  /** Panel index that was resized */
  panelIndex: number;

  /** New panel size */
  newSize: number;

  /** All panel sizes after resize */
  allSizes: number[];

  /** Original DOM event */
  originalEvent: MouseEvent | TouchEvent;
}

/**
 * Splitter resize start event
 */
export interface SplitterResizeStartEvent {
  /** Panel index being resized */
  panelIndex: number;

  /** Current panel size */
  currentSize: number;

  /** Resize start position */
  startPosition: number;

  /** Original DOM event */
  originalEvent: MouseEvent | TouchEvent;
}

/**
 * Splitter resize end event
 */
export interface SplitterResizeEndEvent {
  /** Panel index that was resized */
  panelIndex: number;

  /** Final panel size */
  finalSize: number;

  /** All final panel sizes */
  finalSizes: number[];

  /** Original DOM event */
  originalEvent: MouseEvent | TouchEvent;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default splitter configuration
 */
export const DEFAULT_SPLITTER_CONFIG: SplitterConfig = {
  orientation: 'horizontal',
  resizable: true,
  minSize: 10,
  maxSize: 90,
  initialSizes: [50, 50],
  handleSize: 4,
  showHandle: true,
  handleVariant: 'default',
};

/**
 * Splitter orientation configurations
 */
export const SPLITTER_ORIENTATION_CONFIG = {
  horizontal: {
    flexDirection: 'row',
    cursor: 'col-resize',
    handleDimension: 'width',
    sizeDimension: 'width',
  },
  vertical: {
    flexDirection: 'column',
    cursor: 'row-resize',
    handleDimension: 'height',
    sizeDimension: 'height',
  },
} as const;

/**
 * Splitter handle size configurations
 */
export const SPLITTER_HANDLE_CONFIG = {
  thin: {
    size: '2px',
    activeSize: '4px',
  },
  default: {
    size: '4px',
    activeSize: '6px',
  },
  thick: {
    size: '8px',
    activeSize: '10px',
  },
} as const;

/**
 * Minimum panel size constraints
 */
export const SPLITTER_CONSTRAINTS = {
  minPanelSize: 5, // 5% minimum
  maxPanelSize: 95, // 95% maximum
  minPanelSizePx: 50, // 50px minimum
  handleMinSize: 2, // 2px minimum handle
  handleMaxSize: 20, // 20px maximum handle
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create splitter configuration with defaults
 */
export function createSplitterConfig(partial: Partial<SplitterConfig> = {}): SplitterConfig {
  return {
    ...DEFAULT_SPLITTER_CONFIG,
    ...partial,
  };
}

/**
 * Validate and normalize panel sizes
 */
export function normalizePanelSizes(
  sizes: number[],
  unit: SplitterSizeUnit = 'percentage',
): number[] {
  if (sizes.length === 0) return [100];

  if (unit === 'percentage') {
    const totalSize = sizes.reduce((sum, size) => sum + size, 0);
    if (Math.abs(totalSize - 100) > 0.1) {
      // Normalize to 100%
      return sizes.map(size => (size / totalSize) * 100);
    }
  }

  return sizes;
}

/**
 * Calculate panel size constraints
 */
export function calculatePanelConstraints(
  panelIndex: number,
  currentSizes: number[],
  minSize: number,
  maxSize: number,
): { min: number; max: number } {
  const otherPanelsSize = currentSizes.reduce((sum, size, index) => {
    return index === panelIndex ? sum : sum + size;
  }, 0);

  const availableSpace = 100 - otherPanelsSize;

  return {
    min: Math.max(minSize, SPLITTER_CONSTRAINTS.minPanelSize),
    max: Math.min(maxSize, availableSpace, SPLITTER_CONSTRAINTS.maxPanelSize),
  };
}

/**
 * Convert mouse/touch position to panel size
 */
export function positionToPanelSize(
  position: number,
  containerSize: number,
  orientation: SplitterOrientation,
  panelIndex: number,
): number {
  const percentage =
    orientation === 'horizontal'
      ? (position / containerSize) * 100
      : (position / containerSize) * 100;

  return Math.max(0, Math.min(100, percentage));
}

/**
 * Get splitter orientation styles
 */
export function getSplitterOrientationStyles(orientation: SplitterOrientation) {
  return SPLITTER_ORIENTATION_CONFIG[orientation];
}

/**
 * Create initial panel configuration
 */
export function createInitialPanels(count: number, sizes?: number[]): SplitterPanel[] {
  const normalizedSizes = sizes ? normalizePanelSizes(sizes) : Array(count).fill(100 / count);

  return Array.from({ length: count }, (_, index) => ({
    id: `panel-${index}`,
    size: normalizedSizes[index] || 100 / count,
  }));
}

/**
 * Get accessibility attributes for splitter
 */
export function getSplitterAriaAttributes(
  orientation: SplitterOrientation,
  resizable: boolean,
  panelCount: number,
): Record<string, string> {
  return {
    role: 'group',
    'aria-orientation': orientation,
    'aria-label': `${orientation} splitter with ${panelCount} panels`,
    'aria-live': resizable ? 'polite' : 'off',
  };
}

/**
 * Get accessibility attributes for splitter handle
 */
export function getSplitterHandleAriaAttributes(
  panelIndex: number,
  orientation: SplitterOrientation,
  currentSize: number,
): Record<string, string> {
  return {
    role: 'separator',
    'aria-orientation': orientation,
    'aria-label': `Resize panel ${panelIndex + 1}`,
    'aria-valuenow': Math.round(currentSize).toString(),
    'aria-valuemin': SPLITTER_CONSTRAINTS.minPanelSize.toString(),
    'aria-valuemax': SPLITTER_CONSTRAINTS.maxPanelSize.toString(),
    tabindex: '0',
  };
}
