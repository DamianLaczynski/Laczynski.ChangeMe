// =============================================================================
// List Component Module Exports
// =============================================================================
// Public API for the List component and related types

// Main component
export { ListComponent } from './list.component';

// Showcase component
export { ListShowcaseComponent } from './list-showcase.component';

// Type exports
export type {
  // Core interfaces
  ListConfig,
  ListItem,
  ListData,
  ListDataSource,
  ListState,
  ListEmptyState,
  ListEmptyAction,
  ListSelection,
  ListVirtualScroll,
  ListInfiniteScroll,

  // Type variants
  ListVariant,
  ListSize,
  ListLayout,
  ListSelectionMode,

  // Event types
  ListItemSelectEvent,
  ListItemClickEvent,
  ListScrollEvent,
  ListLoadMoreEvent,

  // Re-exported compatibility types
  PaginationParameters,
  PaginationResult,
  State,
} from './list.model';

// Value exports
export {
  // Configuration and utilities
  DEFAULT_LIST_CONFIG,
  LIST_SIZE_CONFIG,
  createListConfig,
  createListItem,
  createListEmptyState,
  getListClasses,
  getListItemClasses,
  getNestedValue,
  filterListData,
  sortListData,
  generateListId,
  calculateVisibleItems,
} from './list.model';
