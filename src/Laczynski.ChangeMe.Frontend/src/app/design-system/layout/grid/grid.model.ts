// =============================================================================
// Grid Component Models
// =============================================================================
// Type definitions and interfaces for the modern Grid layout system
// Supporting responsive design, flexible columns, and advanced grid features

import { TemplateRef, Signal } from '@angular/core';

// =============================================================================
// CORE GRID INTERFACES
// =============================================================================

/**
 * Grid configuration for the design system
 */
export interface GridConfig {
  /** Number of columns or auto configuration */
  columns: GridColumns;

  /** Gap between grid items */
  gap: GridGap;

  /** Responsive breakpoints configuration */
  responsive: GridResponsive;

  /** Grid items alignment */
  alignment: GridAlignment;

  /** Grid container sizing */
  sizing: GridSizing;

  /** Whether grid items should auto-fit */
  autoFit: boolean;

  /** Whether grid items should auto-fill */
  autoFill: boolean;

  /** Minimum column width for auto layouts */
  minColumnWidth: string;

  /** Maximum column width for auto layouts */
  maxColumnWidth: string;

  /** Grid template areas definition */
  templateAreas?: string[];

  /** Whether grid is dense (fill gaps) */
  dense: boolean;
}

/**
 * Grid item configuration
 */
export interface GridItemConfig {
  /** Column span (how many columns the item takes) */
  columnSpan?: number;

  /** Row span (how many rows the item takes) */
  rowSpan?: number;

  /** Column start position */
  columnStart?: number;

  /** Column end position */
  columnEnd?: number;

  /** Row start position */
  rowStart?: number;

  /** Row end position */
  rowEnd?: number;

  /** Grid area name (for template areas) */
  area?: string;

  /** Item-specific alignment */
  alignSelf?: GridItemAlignment;

  /** Item-specific justification */
  justifySelf?: GridItemJustification;

  /** Item order */
  order?: number;
}

/**
 * Grid responsive configuration
 */
export interface GridResponsive {
  /** Extra small devices configuration */
  xs?: Partial<GridConfig>;

  /** Small devices configuration */
  sm?: Partial<GridConfig>;

  /** Medium devices configuration */
  md?: Partial<GridConfig>;

  /** Large devices configuration */
  lg?: Partial<GridConfig>;

  /** Extra large devices configuration */
  xl?: Partial<GridConfig>;

  /** Extra extra large devices configuration */
  xxl?: Partial<GridConfig>;
}

/**
 * Grid alignment configuration
 */
export interface GridAlignment {
  /** Horizontal alignment of grid items */
  horizontal: GridHorizontalAlignment;

  /** Vertical alignment of grid items */
  vertical: GridVerticalAlignment;

  /** Content alignment within the grid container */
  content: GridContentAlignment;

  /** Items alignment within the grid container */
  items: GridItemsAlignment;
}

/**
 * Grid sizing configuration
 */
export interface GridSizing {
  /** Container width behavior */
  width: GridWidth;

  /** Container height behavior */
  height: GridHeight;

  /** Container maximum width */
  maxWidth?: string;

  /** Container minimum width */
  minWidth?: string;

  /** Container maximum height */
  maxHeight?: string;

  /** Container minimum height */
  minHeight?: string;
}

// =============================================================================
// GRID TYPES & VARIANTS
// =============================================================================

/**
 * Grid column configurations
 */
export type GridColumns =
  | number
  | 'auto'
  | 'auto-fit'
  | 'auto-fill'
  | string
  | GridColumnDefinition[];

/**
 * Grid column definition
 */
export interface GridColumnDefinition {
  /** Column size */
  size: string | number;
  /** Column name */
  name?: string;
  /** Minimum size */
  minSize?: string;
  /** Maximum size */
  maxSize?: string;
}

/**
 * Grid gap sizes
 */
export type GridGap =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | string
  | { x: string; y: string };

/**
 * Grid width behaviors
 */
export type GridWidth = 'auto' | 'full' | 'fit' | 'screen' | string;

/**
 * Grid height behaviors
 */
export type GridHeight = 'auto' | 'full' | 'fit' | 'screen' | string;

/**
 * Grid horizontal alignment options
 */
export type GridHorizontalAlignment =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

/**
 * Grid vertical alignment options
 */
export type GridVerticalAlignment = 'start' | 'end' | 'center' | 'stretch' | 'baseline';

/**
 * Grid content alignment options
 */
export type GridContentAlignment =
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

/**
 * Grid items alignment options
 */
export type GridItemsAlignment = 'start' | 'end' | 'center' | 'stretch' | 'baseline';

/**
 * Grid item alignment options
 */
export type GridItemAlignment = 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';

/**
 * Grid item justification options
 */
export type GridItemJustification = 'auto' | 'start' | 'end' | 'center' | 'stretch';

/**
 * Grid breakpoints
 */
export type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// =============================================================================
// GRID EVENTS
// =============================================================================

/**
 * Grid layout change event
 */
export interface GridLayoutChangeEvent {
  /** Current breakpoint */
  breakpoint: GridBreakpoint;

  /** Number of columns */
  columns: number;

  /** Grid container dimensions */
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Grid item move event
 */
export interface GridItemMoveEvent {
  /** Item that was moved */
  item: HTMLElement;

  /** Previous position */
  fromPosition: GridItemPosition;

  /** New position */
  toPosition: GridItemPosition;
}

/**
 * Grid item position
 */
export interface GridItemPosition {
  /** Column start */
  columnStart: number;

  /** Column end */
  columnEnd: number;

  /** Row start */
  rowStart: number;

  /** Row end */
  rowEnd: number;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default grid configuration
 */
export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 12,
  gap: 'md',
  responsive: {},
  alignment: {
    horizontal: 'start',
    vertical: 'start',
    content: 'start',
    items: 'stretch',
  },
  sizing: {
    width: 'full',
    height: 'auto',
  },
  autoFit: false,
  autoFill: false,
  minColumnWidth: '250px',
  maxColumnWidth: '1fr',
  dense: false,
};

/**
 * Grid gap configurations
 */
export const GRID_GAP_CONFIG = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  xxl: 'var(--spacing-xxl)',
} as const;

/**
 * Grid breakpoints configuration
 */
export const GRID_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

/**
 * Common grid layouts
 */
export const GRID_LAYOUTS = {
  // Traditional layouts
  one: { columns: 1, gap: 'md' },
  two: { columns: 2, gap: 'md' },
  three: { columns: 3, gap: 'md' },
  four: { columns: 4, gap: 'md' },
  six: { columns: 6, gap: 'md' },
  twelve: { columns: 12, gap: 'md' },

  // Auto layouts
  autoFit: { columns: 'auto-fit', gap: 'md', minColumnWidth: '250px' },
  autoFill: { columns: 'auto-fill', gap: 'md', minColumnWidth: '250px' },

  // Responsive layouts
  responsive: {
    columns: 1,
    gap: 'md',
    responsive: {
      sm: { columns: 2 },
      md: { columns: 3 },
      lg: { columns: 4 },
      xl: { columns: 6 },
    },
  },

  // Masonry-like
  masonry: {
    columns: 'auto-fit',
    gap: 'md',
    minColumnWidth: '300px',
    dense: true,
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create grid configuration with defaults
 */
export function createGridConfig(partial: Partial<GridConfig> = {}): GridConfig {
  return {
    ...DEFAULT_GRID_CONFIG,
    ...partial,
    alignment: {
      ...DEFAULT_GRID_CONFIG.alignment,
      ...partial.alignment,
    },
    sizing: {
      ...DEFAULT_GRID_CONFIG.sizing,
      ...partial.sizing,
    },
    responsive: {
      ...DEFAULT_GRID_CONFIG.responsive,
      ...partial.responsive,
    },
  };
}

/**
 * Create grid item configuration
 */
export function createGridItemConfig(partial: Partial<GridItemConfig> = {}): GridItemConfig {
  return {
    ...partial,
  };
}

/**
 * Get grid CSS classes
 */
export function getGridClasses(config: GridConfig): string[] {
  const classes = ['ds-grid'];

  // Width classes
  if (typeof config.sizing.width === 'string' && config.sizing.width !== 'auto') {
    classes.push(`ds-grid--width-${config.sizing.width}`);
  }

  // Height classes
  if (typeof config.sizing.height === 'string' && config.sizing.height !== 'auto') {
    classes.push(`ds-grid--height-${config.sizing.height}`);
  }

  // Gap classes
  if (typeof config.gap === 'string' && config.gap in GRID_GAP_CONFIG) {
    classes.push(`ds-grid--gap-${config.gap}`);
  }

  // Alignment classes
  classes.push(`ds-grid--justify-${config.alignment.horizontal}`);
  classes.push(`ds-grid--align-${config.alignment.vertical}`);
  classes.push(`ds-grid--justify-content-${config.alignment.content}`);
  classes.push(`ds-grid--align-items-${config.alignment.items}`);

  // Feature classes
  if (config.autoFit) classes.push('ds-grid--auto-fit');
  if (config.autoFill) classes.push('ds-grid--auto-fill');
  if (config.dense) classes.push('ds-grid--dense');

  return classes;
}

/**
 * Get grid item CSS classes
 */
export function getGridItemClasses(config: GridItemConfig): string[] {
  const classes = ['ds-grid__item'];

  // Span classes
  if (config.columnSpan) classes.push(`ds-grid__item--col-${config.columnSpan}`);
  if (config.rowSpan) classes.push(`ds-grid__item--row-${config.rowSpan}`);

  // Alignment classes
  if (config.alignSelf) classes.push(`ds-grid__item--align-${config.alignSelf}`);
  if (config.justifySelf) classes.push(`ds-grid__item--justify-${config.justifySelf}`);

  return classes;
}

/**
 * Generate grid template columns CSS
 */
export function generateGridTemplateColumns(
  columns: GridColumns,
  minWidth?: string,
  maxWidth?: string,
): string {
  if (typeof columns === 'number') {
    return `repeat(${columns}, 1fr)`;
  }

  if (typeof columns === 'string') {
    if (columns === 'auto') return 'auto';
    if (columns === 'auto-fit')
      return `repeat(auto-fit, minmax(${minWidth || '250px'}, ${maxWidth || '1fr'}))`;
    if (columns === 'auto-fill')
      return `repeat(auto-fill, minmax(${minWidth || '250px'}, ${maxWidth || '1fr'}))`;
    return columns;
  }

  if (Array.isArray(columns)) {
    return columns
      .map(col => {
        if (typeof col.size === 'number') return `${col.size}fr`;
        return col.size;
      })
      .join(' ');
  }

  return 'repeat(12, 1fr)';
}

/**
 * Get current breakpoint based on screen width
 */
export function getCurrentBreakpoint(width: number): GridBreakpoint {
  if (width >= GRID_BREAKPOINTS.xxl) return 'xxl';
  if (width >= GRID_BREAKPOINTS.xl) return 'xl';
  if (width >= GRID_BREAKPOINTS.lg) return 'lg';
  if (width >= GRID_BREAKPOINTS.md) return 'md';
  if (width >= GRID_BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * Merge responsive grid configurations
 */
export function mergeResponsiveConfig(
  baseConfig: GridConfig,
  breakpoint: GridBreakpoint,
): GridConfig {
  const responsiveConfig = baseConfig.responsive[breakpoint];
  if (!responsiveConfig) return baseConfig;

  return {
    ...baseConfig,
    ...responsiveConfig,
    alignment: {
      ...baseConfig.alignment,
      ...responsiveConfig.alignment,
    },
    sizing: {
      ...baseConfig.sizing,
      ...responsiveConfig.sizing,
    },
  };
}

/**
 * Calculate optimal columns based on container width
 */
export function calculateOptimalColumns(
  containerWidth: number,
  minItemWidth: number,
  gap: number,
): number {
  const availableWidth = containerWidth - gap;
  const itemWithGap = minItemWidth + gap;
  return Math.max(1, Math.floor(availableWidth / itemWithGap));
}

/**
 * Generate grid area string from coordinates
 */
export function generateGridArea(
  rowStart: number,
  columnStart: number,
  rowEnd: number,
  columnEnd: number,
): string {
  return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
}
