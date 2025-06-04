// =============================================================================
// ScrollPanel Component Models
// =============================================================================
// Type definitions and interfaces for the ScrollPanel component
// Supports custom scrollbars, scroll tracking, and accessibility features

// =============================================================================
// CORE SCROLLPANEL INTERFACES
// =============================================================================

/**
 * ScrollPanel component configuration
 */
export interface ScrollPanelConfig {
  /** ScrollPanel size variant */
  size: ScrollPanelSize;

  /** ScrollPanel state */
  state: ScrollPanelState;

  /** Scroll direction support */
  scrollDirection: ScrollDirection;

  /** Whether to show scrollbars */
  showScrollbars: boolean;

  /** Whether scrollbars should auto-hide */
  autoHideScrollbars: boolean;

  /** Custom scrollbar styling */
  customScrollbar: boolean;

  /** Whether to enable smooth scrolling */
  smoothScrolling: boolean;

  /** Whether to show scroll indicators */
  showScrollIndicators: boolean;
}

/**
 * Scroll position information
 */
export interface ScrollPosition {
  /** Horizontal scroll position */
  scrollLeft: number;

  /** Vertical scroll position */
  scrollTop: number;

  /** Scroll percentage (0-100) horizontally */
  scrollPercentageX: number;

  /** Scroll percentage (0-100) vertically */
  scrollPercentageY: number;

  /** Whether at top */
  atTop: boolean;

  /** Whether at bottom */
  atBottom: boolean;

  /** Whether at left */
  atLeft: boolean;

  /** Whether at right */
  atRight: boolean;
}

/**
 * Scroll dimensions information
 */
export interface ScrollDimensions {
  /** Container width */
  containerWidth: number;

  /** Container height */
  containerHeight: number;

  /** Content width (scrollable area) */
  contentWidth: number;

  /** Content height (scrollable area) */
  contentHeight: number;

  /** Whether content overflows horizontally */
  overflowX: boolean;

  /** Whether content overflows vertically */
  overflowY: boolean;
}

// =============================================================================
// SCROLLPANEL TYPES & VARIANTS
// =============================================================================

/**
 * ScrollPanel size variants
 */
export type ScrollPanelSize = 'sm' | 'md' | 'lg' | 'full';

/**
 * ScrollPanel states
 */
export type ScrollPanelState = 'default' | 'loading' | 'error' | 'disabled';

/**
 * Scroll direction support
 */
export type ScrollDirection = 'vertical' | 'horizontal' | 'both' | 'none';

/**
 * Scroll behavior
 */
export type ScrollBehavior = 'auto' | 'smooth';

// =============================================================================
// SCROLLPANEL EVENTS
// =============================================================================

/**
 * Scroll event
 */
export interface ScrollEvent {
  /** Current scroll position */
  position: ScrollPosition;

  /** Scroll dimensions */
  dimensions: ScrollDimensions;

  /** ScrollPanel element reference */
  element: HTMLElement;

  /** Original scroll event */
  originalEvent: Event;

  /** Scroll direction (up/down/left/right) */
  direction: 'up' | 'down' | 'left' | 'right' | null;
}

/**
 * Scroll end event (triggered after scrolling stops)
 */
export interface ScrollEndEvent {
  /** Final scroll position */
  position: ScrollPosition;

  /** ScrollPanel element reference */
  element: HTMLElement;

  /** Duration of scroll (ms) */
  duration: number;
}

/**
 * Scroll edge event (triggered when reaching edges)
 */
export interface ScrollEdgeEvent {
  /** Which edge was reached */
  edge: 'top' | 'bottom' | 'left' | 'right';

  /** Current scroll position */
  position: ScrollPosition;

  /** ScrollPanel element reference */
  element: HTMLElement;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default scrollpanel configuration
 */
export const DEFAULT_SCROLLPANEL_CONFIG: ScrollPanelConfig = {
  size: 'md',
  state: 'default',
  scrollDirection: 'both',
  showScrollbars: true,
  autoHideScrollbars: false,
  customScrollbar: true,
  smoothScrolling: true,
  showScrollIndicators: false,
};

/**
 * ScrollPanel size configurations with dimensions
 */
export const SCROLLPANEL_SIZE_CONFIG = {
  sm: {
    maxHeight: '200px',
    scrollbarWidth: '6px',
    scrollbarThumbRadius: '3px',
  },
  md: {
    maxHeight: '400px',
    scrollbarWidth: '8px',
    scrollbarThumbRadius: '4px',
  },
  lg: {
    maxHeight: '600px',
    scrollbarWidth: '10px',
    scrollbarThumbRadius: '5px',
  },
  full: {
    maxHeight: '100%',
    scrollbarWidth: '12px',
    scrollbarThumbRadius: '6px',
  },
} as const;

/**
 * Scroll direction configurations
 */
export const SCROLL_DIRECTION_CONFIG = {
  vertical: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  horizontal: {
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  both: {
    overflowX: 'auto',
    overflowY: 'auto',
  },
  none: {
    overflowX: 'hidden',
    overflowY: 'hidden',
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create scrollpanel configuration with defaults
 */
export function createScrollPanelConfig(
  partial: Partial<ScrollPanelConfig> = {},
): ScrollPanelConfig {
  return {
    ...DEFAULT_SCROLLPANEL_CONFIG,
    ...partial,
  };
}

/**
 * Calculate scroll position information
 */
export function calculateScrollPosition(element: HTMLElement): ScrollPosition {
  const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = element;

  const maxScrollLeft = scrollWidth - clientWidth;
  const maxScrollTop = scrollHeight - clientHeight;

  return {
    scrollLeft,
    scrollTop,
    scrollPercentageX: maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 0,
    scrollPercentageY: maxScrollTop > 0 ? (scrollTop / maxScrollTop) * 100 : 0,
    atTop: scrollTop === 0,
    atBottom: scrollTop >= maxScrollTop,
    atLeft: scrollLeft === 0,
    atRight: scrollLeft >= maxScrollLeft,
  };
}

/**
 * Calculate scroll dimensions
 */
export function calculateScrollDimensions(element: HTMLElement): ScrollDimensions {
  const { clientWidth, clientHeight, scrollWidth, scrollHeight } = element;

  return {
    containerWidth: clientWidth,
    containerHeight: clientHeight,
    contentWidth: scrollWidth,
    contentHeight: scrollHeight,
    overflowX: scrollWidth > clientWidth,
    overflowY: scrollHeight > clientHeight,
  };
}

/**
 * Get scroll direction based on previous and current positions
 */
export function getScrollDirection(
  previousPosition: ScrollPosition,
  currentPosition: ScrollPosition,
): 'up' | 'down' | 'left' | 'right' | null {
  const deltaX = currentPosition.scrollLeft - previousPosition.scrollLeft;
  const deltaY = currentPosition.scrollTop - previousPosition.scrollTop;

  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    return deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : null;
  } else if (Math.abs(deltaX) > 0) {
    return deltaX > 0 ? 'right' : 'left';
  }

  return null;
}

/**
 * Check if scrollpanel can scroll in given direction
 */
export function canScroll(
  element: HTMLElement,
  direction: 'up' | 'down' | 'left' | 'right',
): boolean {
  const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = element;

  switch (direction) {
    case 'up':
      return scrollTop > 0;
    case 'down':
      return scrollTop < scrollHeight - clientHeight;
    case 'left':
      return scrollLeft > 0;
    case 'right':
      return scrollLeft < scrollWidth - clientWidth;
    default:
      return false;
  }
}

/**
 * Scroll to position with optional smooth behavior
 */
export function scrollToPosition(
  element: HTMLElement,
  x: number,
  y: number,
  behavior: ScrollBehavior = 'smooth',
): void {
  element.scrollTo({
    left: x,
    top: y,
    behavior,
  });
}

/**
 * Scroll by offset with optional smooth behavior
 */
export function scrollByOffset(
  element: HTMLElement,
  deltaX: number,
  deltaY: number,
  behavior: ScrollBehavior = 'smooth',
): void {
  element.scrollBy({
    left: deltaX,
    top: deltaY,
    behavior,
  });
}

/**
 * Get scrollpanel accessibility attributes
 */
export function getScrollPanelAriaAttributes(
  config: ScrollPanelConfig,
  position: ScrollPosition,
  describedBy: string[] = [],
): Record<string, string> {
  const attrs: Record<string, string> = {
    role: 'region',
    'aria-label': 'Scrollable content area',
  };

  if (describedBy.length > 0) {
    attrs['aria-describedby'] = describedBy.join(' ');
  }

  if (config.state === 'disabled') {
    attrs['aria-disabled'] = 'true';
  }

  // Add scroll position information for screen readers
  if (config.showScrollIndicators) {
    const scrollInfo = [];
    if (position.scrollPercentageY > 0) {
      scrollInfo.push(`Scrolled ${Math.round(position.scrollPercentageY)}% vertically`);
    }
    if (position.scrollPercentageX > 0) {
      scrollInfo.push(`Scrolled ${Math.round(position.scrollPercentageX)}% horizontally`);
    }

    if (scrollInfo.length > 0) {
      attrs['aria-valuetext'] = scrollInfo.join(', ');
    }
  }

  return attrs;
}
