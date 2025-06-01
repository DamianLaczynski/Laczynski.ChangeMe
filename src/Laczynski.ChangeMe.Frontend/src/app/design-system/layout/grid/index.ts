// =============================================================================
// Grid Layout Module Exports
// =============================================================================
// Public API for the Grid layout system and related components

// Main components
export { GridComponent } from './grid.component';
export { GridItemComponent } from './grid-item.component';

// Showcase component
export { GridShowcaseComponent } from './grid-showcase.component';

// Type exports
export type {
  // Core interfaces
  GridConfig,
  GridItemConfig,
  GridResponsive,
  GridAlignment,
  GridSizing,
  GridColumnDefinition,

  // Type variants
  GridColumns,
  GridGap,
  GridWidth,
  GridHeight,
  GridHorizontalAlignment,
  GridVerticalAlignment,
  GridContentAlignment,
  GridItemsAlignment,
  GridItemAlignment,
  GridItemJustification,
  GridBreakpoint,

  // Event types
  GridLayoutChangeEvent,
  GridItemMoveEvent,
  GridItemPosition,
} from './grid.model';

// Value exports
export {
  // Constants
  DEFAULT_GRID_CONFIG,
  GRID_GAP_CONFIG,
  GRID_BREAKPOINTS,
  GRID_LAYOUTS,

  // Utility functions
  createGridConfig,
  createGridItemConfig,
  getGridClasses,
  getGridItemClasses,
  generateGridTemplateColumns,
  getCurrentBreakpoint,
  mergeResponsiveConfig,
  calculateOptimalColumns,
  generateGridArea,
} from './grid.model';
