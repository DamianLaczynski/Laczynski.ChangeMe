// =============================================================================
// List Component Models
// =============================================================================
// Type definitions and interfaces for the modern List component
// Supporting virtual scrolling, infinite scroll, and various list types

import { TemplateRef, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { getNestedValue } from '../shared';

// Re-export compatibility types from existing system
export type { PaginationParameters } from '../../shared/data/models/pagination-parameters.model';
export type { PaginationResult } from '../../shared/data/models/pagination-result.model';
export type { State } from '../../shared/state/models/state.model';

// =============================================================================
// CORE LIST INTERFACES
// =============================================================================

/**
 * List configuration for the design system
 */
export interface ListConfig<T = any> {
  /** Visual variant */
  variant: ListVariant;

  /** List size */
  size: ListSize;

  /** List layout type */
  layout: ListLayout;

  /** Whether list is striped */
  striped: boolean;

  /** Whether list items are hoverable */
  hoverable: boolean;

  /** Whether list is scrollable */
  scrollable: boolean;

  /** Whether to show dividers between items */
  showDividers: boolean;

  /** Whether to show loading state */
  showLoading: boolean;

  /** Whether to show empty state */
  showEmptyState: boolean;

  /** Empty state configuration */
  emptyState: ListEmptyState;

  /** Selection configuration */
  selection: ListSelection;

  /** Virtual scrolling configuration */
  virtualScroll: ListVirtualScroll;

  /** Infinite scroll configuration */
  infiniteScroll: ListInfiniteScroll;
}

/**
 * List item configuration
 */
export interface ListItem<T = any> {
  /** Unique identifier */
  id: string | number;

  /** Display data */
  data: T;

  /** Whether item is disabled */
  disabled?: boolean;

  /** Whether item is selected */
  selected?: boolean;

  /** Custom CSS classes */
  cssClass?: string;

  /** Custom template reference */
  template?: string;

  /** Item metadata */
  metadata?: any;
}

/**
 * List data source configuration
 */
export interface ListDataSource<T = any, P = any> {
  /** Data loading function */
  loadData: (params: P) => Observable<ListData<T>>;

  /** Current parameters */
  params: P;

  /** Loading state signal */
  loading: Signal<boolean>;

  /** Error state signal */
  error: Signal<string | null>;
}

/**
 * List data structure
 */
export interface ListData<T = any> {
  /** Array of items */
  items: T[];

  /** Total number of items */
  totalCount: number;

  /** Current page number */
  currentPage: number;

  /** Page size */
  pageSize: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there's a previous page */
  hasPrevious: boolean;

  /** Whether there's a next page */
  hasNext: boolean;
}

/**
 * List state information
 */
export interface ListState<T = any> {
  /** Current data */
  data: ListData<T> | null;

  /** Loading state */
  isLoading: boolean;

  /** Error state */
  isError: boolean;

  /** Error message */
  error: string | null;

  /** Selected items */
  selectedItems: T[];

  /** Current search term */
  searchTerm: string;

  /** Current filters */
  filters: Record<string, any>;
}

/**
 * List empty state configuration
 */
export interface ListEmptyState {
  /** Empty state title */
  title?: string;

  /** Empty state message */
  message?: string;

  /** Empty state icon */
  icon?: string;

  /** Empty state image */
  image?: string;

  /** Empty state action button */
  action?: ListEmptyAction;
}

/**
 * List empty state action
 */
export interface ListEmptyAction {
  /** Action label */
  label: string;

  /** Action handler */
  handler: () => void;

  /** Action variant */
  variant?: 'primary' | 'secondary';

  /** Action icon */
  icon?: string;
}

/**
 * List selection configuration
 */
export interface ListSelection {
  /** Selection mode */
  mode: ListSelectionMode;

  /** Whether to show select all option */
  showSelectAll?: boolean;

  /** Whether selection is disabled */
  disabled?: boolean;

  /** Function to determine if item is selectable */
  isSelectable?: (item: any) => boolean;

  /** Function to get unique item identifier */
  getItemId?: (item: any) => string | number;
}

/**
 * Virtual scrolling configuration
 */
export interface ListVirtualScroll {
  /** Whether virtual scrolling is enabled */
  enabled: boolean;

  /** Item height in pixels */
  itemHeight?: number;

  /** Buffer size (number of items to render outside viewport) */
  bufferSize?: number;

  /** Container height */
  containerHeight?: string;
}

/**
 * Infinite scroll configuration
 */
export interface ListInfiniteScroll {
  /** Whether infinite scroll is enabled */
  enabled: boolean;

  /** Scroll threshold in pixels from bottom */
  threshold?: number;

  /** Whether to show loading indicator */
  showLoadingIndicator?: boolean;

  /** Loading indicator template */
  loadingTemplate?: TemplateRef<any>;
}

// =============================================================================
// LIST TYPES & VARIANTS
// =============================================================================

/**
 * List visual variants
 */
export type ListVariant = 'default' | 'minimal' | 'bordered' | 'elevated' | 'flush';

/**
 * List size variants
 */
export type ListSize = 'sm' | 'md' | 'lg';

/**
 * List layout types
 */
export type ListLayout = 'vertical' | 'horizontal' | 'grid' | 'masonry';

/**
 * List selection modes
 */
export type ListSelectionMode = 'none' | 'single' | 'multiple';

// =============================================================================
// LIST EVENTS
// =============================================================================

/**
 * List item selection event
 */
export interface ListItemSelectEvent<T = any> {
  /** Selected item */
  item: T;

  /** All selected items */
  selectedItems: T[];

  /** Original event */
  originalEvent: Event;
}

/**
 * List item click event
 */
export interface ListItemClickEvent<T = any> {
  /** Clicked item */
  item: T;

  /** Item index */
  index: number;

  /** Original event */
  originalEvent: Event;
}

/**
 * List scroll event
 */
export interface ListScrollEvent {
  /** Scroll position */
  scrollTop: number;

  /** Scroll direction */
  direction: 'up' | 'down';

  /** Whether at top */
  atTop: boolean;

  /** Whether at bottom */
  atBottom: boolean;

  /** Original event */
  originalEvent: Event;
}

/**
 * List load more event
 */
export interface ListLoadMoreEvent {
  /** Current page */
  currentPage: number;

  /** Next page to load */
  nextPage: number;

  /** Total pages */
  totalPages: number;

  /** Original event */
  originalEvent: Event;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default list configuration
 */
export const DEFAULT_LIST_CONFIG: ListConfig = {
  variant: 'default',
  size: 'md',
  layout: 'vertical',
  striped: false,
  hoverable: true,
  scrollable: true,
  showDividers: true,
  showLoading: true,
  showEmptyState: true,
  emptyState: {
    title: 'No items found',
    message: 'There are no items to display',
    icon: '📝',
  },
  selection: {
    mode: 'none',
    showSelectAll: false,
    disabled: false,
  },
  virtualScroll: {
    enabled: false,
    itemHeight: 48,
    bufferSize: 10,
    containerHeight: '400px',
  },
  infiniteScroll: {
    enabled: false,
    threshold: 200,
    showLoadingIndicator: true,
  },
};

/**
 * List size configurations
 */
export const LIST_SIZE_CONFIG = {
  sm: {
    itemHeight: '32px',
    padding: '8px 12px',
    fontSize: '13px',
    lineHeight: '1.4',
  },
  md: {
    itemHeight: '48px',
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  lg: {
    itemHeight: '64px',
    padding: '16px 20px',
    fontSize: '16px',
    lineHeight: '1.6',
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create list configuration with defaults
 */
export function createListConfig<T>(partial: Partial<ListConfig<T>> = {}): ListConfig<T> {
  return {
    ...DEFAULT_LIST_CONFIG,
    ...partial,
    emptyState: {
      ...DEFAULT_LIST_CONFIG.emptyState,
      ...partial.emptyState,
    },
    selection: {
      ...DEFAULT_LIST_CONFIG.selection,
      ...partial.selection,
    },
    virtualScroll: {
      ...DEFAULT_LIST_CONFIG.virtualScroll,
      ...partial.virtualScroll,
    },
    infiniteScroll: {
      ...DEFAULT_LIST_CONFIG.infiniteScroll,
      ...partial.infiniteScroll,
    },
  };
}

/**
 * Create list item
 */
export function createListItem<T>(
  id: string | number,
  data: T,
  options: Partial<ListItem<T>> = {},
): ListItem<T> {
  return {
    id,
    data,
    disabled: false,
    selected: false,
    ...options,
  };
}

/**
 * Create list empty state
 */
export function createListEmptyState(partial: Partial<ListEmptyState> = {}): ListEmptyState {
  return {
    title: 'No items found',
    message: 'There are no items to display',
    icon: '📝',
    ...partial,
  };
}

/**
 * Get list CSS classes
 */
export function getListClasses(config: ListConfig): string[] {
  const classes = ['ds-list'];

  // Variant classes
  classes.push(`ds-list--${config.variant}`);
  classes.push(`ds-list--${config.size}`);
  classes.push(`ds-list--${config.layout}`);

  // Feature classes
  if (config.striped) classes.push('ds-list--striped');
  if (config.hoverable) classes.push('ds-list--hoverable');
  if (config.scrollable) classes.push('ds-list--scrollable');
  if (config.showDividers) classes.push('ds-list--dividers');

  // State classes
  if (config.showLoading) classes.push('ds-list--with-loading');
  if (config.virtualScroll.enabled) classes.push('ds-list--virtual');
  if (config.infiniteScroll.enabled) classes.push('ds-list--infinite');

  return classes;
}

/**
 * Get list item CSS classes
 */
export function getListItemClasses(item: ListItem, config: ListConfig): string[] {
  const classes = ['ds-list__item'];

  // Size classes
  classes.push(`ds-list__item--${config.size}`);

  // State classes
  if (item.disabled) classes.push('ds-list__item--disabled');
  if (item.selected) classes.push('ds-list__item--selected');

  // Custom classes
  if (item.cssClass) classes.push(item.cssClass);

  return classes;
}

/**
 * Filter list data
 */
export function filterListData<T>(data: T[], searchTerm: string, searchFields: string[] = []): T[] {
  if (!searchTerm) return data;

  const searchLower = searchTerm.toLowerCase();

  return data.filter(item => {
    if (searchFields.length === 0) {
      // Search all string properties - properly handle unknown type
      if (typeof item === 'object' && item !== null) {
        return Object.values(item as Record<string, unknown>).some(
          value => typeof value === 'string' && value.toLowerCase().includes(searchLower),
        );
      }
      return false;
    }

    // Search specific fields
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      return typeof value === 'string' && value.toLowerCase().includes(searchLower);
    });
  });
}

/**
 * Sort list data
 */
export function sortListData<T>(data: T[], sortField: string, sortDirection: 'asc' | 'desc'): T[] {
  return [...data].sort((a, b) => {
    const aValue = getNestedValue(a, sortField);
    const bValue = getNestedValue(b, sortField);

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let result = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      result = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      result = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      result = aValue.getTime() - bValue.getTime();
    } else {
      result = String(aValue).localeCompare(String(bValue));
    }

    return sortDirection === 'desc' ? -result : result;
  });
}

/**
 * Generate unique list ID
 */
export function generateListId(prefix: string = 'list'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate visible items for virtual scrolling
 */
export function calculateVisibleItems(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  bufferSize: number = 5,
): { startIndex: number; endIndex: number; visibleItems: number } {
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
  const endIndex = Math.min(totalItems, startIndex + visibleItems + bufferSize * 2);

  return { startIndex, endIndex, visibleItems };
}
