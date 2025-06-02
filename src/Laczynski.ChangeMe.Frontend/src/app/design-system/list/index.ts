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
  LIST_VARIANTS,
  createListConfig,
  createListItem,
  createListEmptyState,
  getListClasses,
  getListItemClasses,
  filterListData,
  sortListData,
  generateListId,
  calculateVisibleItems,
  isValidListVariant,
  getListVariantLabel,
  getListSizeLabel,
  getListAriaAttributes,
  createListItemSelectEvent,
  createListItemClickEvent,
  createListScrollEvent,
  createListLoadMoreEvent,
} from './list.model';
