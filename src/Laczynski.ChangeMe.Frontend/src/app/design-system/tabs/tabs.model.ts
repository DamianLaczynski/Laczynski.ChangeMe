// =============================================================================
// Tabs Component Models
// =============================================================================
// Type definitions and interfaces for the Tabs component
// Supports text content, template content, and accessibility features

import {
  ComponentSize,
  ComponentVariant,
  ComponentState,
  ComponentChangeEvent,
  ComponentFocusEvent,
  ValidationResult,
  generateComponentId,
  createAccessibilityAttributes,
} from '../shared';
import { TemplateRef } from '@angular/core';

// =============================================================================
// TABS-SPECIFIC TYPES
// =============================================================================

/**
 * Tabs variants extending base component variants
 */
export type TabsVariant =
  | Extract<ComponentVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>
  | 'default';

/**
 * Tabs orientation
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Tab alignment options
 */
export type TabsAlignment = 'start' | 'center' | 'end' | 'justified';

/**
 * Tab states
 */
export type TabState = 'default' | 'active' | 'disabled' | 'loading';

// =============================================================================
// CORE TABS INTERFACES
// =============================================================================

/**
 * Tab item interface supporting both text and template content
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;

  /** Tab label */
  label: string;

  /** Text content (for simple tabs) */
  content?: string;

  /** Template content (for complex tabs) */
  template?: TemplateRef<any>;

  /** Whether tab is disabled */
  disabled?: boolean;

  /** Whether tab is loading */
  loading?: boolean;

  /** Whether tab is closable */
  closable?: boolean;

  /** Optional icon HTML */
  icon?: string;

  /** Optional badge text */
  badge?: string;

  /** Tab-specific CSS classes */
  customClasses?: string;

  /** Custom data for the tab */
  data?: any;
}

/**
 * Tab group interface for organizing tabs
 */
export interface TabGroup {
  /** Group identifier */
  id: string;

  /** Group display label */
  label: string;

  /** Tabs in this group */
  tabs: TabItem[];

  /** Whether group is disabled */
  disabled?: boolean;
}

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Tabs component configuration
 */
export interface TabsConfig {
  /** Tabs variant */
  variant: TabsVariant;

  /** Tabs size */
  size: ComponentSize;

  /** Tabs orientation */
  orientation: TabsOrientation;

  /** Tab alignment */
  alignment: TabsAlignment;

  /** Whether tabs can be closed */
  closable: boolean;

  /** Whether tabs support drag and drop reordering */
  draggable: boolean;

  /** Whether tabs support lazy loading */
  lazy: boolean;

  /** Animation duration in milliseconds */
  animationDuration: number;

  /** Whether to show scroll buttons for overflow */
  scrollable: boolean;

  /** Maximum number of visible tabs */
  maxVisibleTabs?: number;
}

/**
 * Tabs component state
 */
export interface TabsComponentState extends ComponentState {
  /** Currently active tab ID */
  activeTabId: string | null;

  /** Whether tabs are scrollable */
  isScrollable: boolean;

  /** Current scroll position */
  scrollPosition: number;

  /** Whether left scroll is available */
  canScrollLeft: boolean;

  /** Whether right scroll is available */
  canScrollRight: boolean;

  /** Currently focused tab index */
  focusedTabIndex: number;
}

// =============================================================================
// EVENTS
// =============================================================================

/**
 * Tab change event
 */
export interface TabChangeEvent extends ComponentChangeEvent<string, HTMLElement> {
  /** Previously active tab */
  previousTab: TabItem | null;

  /** Currently active tab */
  currentTab: TabItem;

  /** Tab index */
  index: number;
}

/**
 * Tab close event
 */
export interface TabCloseEvent {
  /** Tab being closed */
  tab: TabItem;

  /** Tab index */
  index: number;

  /** Original event */
  originalEvent: Event;

  /** Whether close can be prevented */
  preventDefault: () => void;
}

/**
 * Tab focus event
 */
export interface TabFocusEvent extends ComponentFocusEvent<HTMLElement> {
  /** Focused tab */
  tab: TabItem;

  /** Tab index */
  index: number;

  /** Focus direction */
  direction: 'in' | 'out';
}

/**
 * Tab reorder event
 */
export interface TabReorderEvent {
  /** Tab being moved */
  tab: TabItem;

  /** Previous index */
  previousIndex: number;

  /** New index */
  newIndex: number;

  /** All tabs after reorder */
  tabs: TabItem[];
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Tabs validation result
 */
export interface TabsValidation extends ValidationResult {
  /** Validation specific to tabs */
  tabValidations?: { [tabId: string]: ValidationResult };
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create default tabs configuration
 */
export function createTabsConfig(partial: Partial<TabsConfig> = {}): TabsConfig {
  return {
    variant: 'default',
    size: 'md',
    orientation: 'horizontal',
    alignment: 'start',
    closable: false,
    draggable: false,
    lazy: false,
    animationDuration: 300,
    scrollable: true,
    maxVisibleTabs: undefined,
    ...partial,
  };
}

/**
 * Create a tab item
 */
export function createTabItem(
  id: string,
  label: string,
  options: Partial<Omit<TabItem, 'id' | 'label'>> = {},
): TabItem {
  return {
    id,
    label,
    disabled: false,
    loading: false,
    closable: false,
    ...options,
  };
}

/**
 * Create default tabs component state
 */
export function createTabsState(partial: Partial<TabsComponentState> = {}): TabsComponentState {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    variant: 'primary',
    size: 'md',
    activeTabId: null,
    isScrollable: false,
    scrollPosition: 0,
    canScrollLeft: false,
    canScrollRight: false,
    focusedTabIndex: -1,
    ...partial,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Find tab by ID
 */
export function findTabById(tabs: TabItem[], id: string): TabItem | undefined {
  return tabs.find(tab => tab.id === id);
}

/**
 * Find tab index by ID
 */
export function findTabIndexById(tabs: TabItem[], id: string): number {
  return tabs.findIndex(tab => tab.id === id);
}

/**
 * Get next enabled tab
 */
export function getNextEnabledTab(tabs: TabItem[], currentIndex: number): TabItem | null {
  const startIndex = (currentIndex + 1) % tabs.length;

  for (let i = 0; i < tabs.length; i++) {
    const index = (startIndex + i) % tabs.length;
    const tab = tabs[index];

    if (!tab.disabled && !tab.loading) {
      return tab;
    }
  }

  return null;
}

/**
 * Get previous enabled tab
 */
export function getPreviousEnabledTab(tabs: TabItem[], currentIndex: number): TabItem | null {
  const startIndex = currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1;

  for (let i = 0; i < tabs.length; i++) {
    const index = startIndex - i < 0 ? tabs.length - 1 - i + startIndex + 1 : startIndex - i;
    const tab = tabs[index];

    if (!tab.disabled && !tab.loading) {
      return tab;
    }
  }

  return null;
}

/**
 * Get first enabled tab
 */
export function getFirstEnabledTab(tabs: TabItem[]): TabItem | null {
  return tabs.find(tab => !tab.disabled && !tab.loading) || null;
}

/**
 * Get last enabled tab
 */
export function getLastEnabledTab(tabs: TabItem[]): TabItem | null {
  for (let i = tabs.length - 1; i >= 0; i--) {
    const tab = tabs[i];
    if (!tab.disabled && !tab.loading) {
      return tab;
    }
  }
  return null;
}

/**
 * Validate tabs configuration
 */
export function validateTabs(tabs: TabItem[], activeTabId: string | null): TabsValidation {
  const result: TabsValidation = {
    valid: true,
    tabValidations: {},
  };

  if (tabs.length === 0) {
    result.valid = false;
    result.errorMessage = 'At least one tab is required';
    return result;
  }

  // Check for duplicate IDs
  const ids = tabs.map(tab => tab.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    result.valid = false;
    result.errorMessage = `Duplicate tab IDs found: ${duplicateIds.join(', ')}`;
    return result;
  }

  // Validate active tab exists
  if (activeTabId && !findTabById(tabs, activeTabId)) {
    result.valid = false;
    result.errorMessage = `Active tab with ID "${activeTabId}" not found`;
    return result;
  }

  // Individual tab validations
  tabs.forEach(tab => {
    const tabValidation: ValidationResult = { valid: true };

    if (!tab.id || tab.id.trim() === '') {
      tabValidation.valid = false;
      tabValidation.errorMessage = 'Tab ID is required';
    }

    if (!tab.label || tab.label.trim() === '') {
      tabValidation.valid = false;
      tabValidation.errorMessage = 'Tab label is required';
    }

    if (!tabValidation.valid) {
      result.valid = false;
      result.tabValidations![tab.id] = tabValidation;
    }
  });

  return result;
}

/**
 * Get tabs ARIA attributes
 */
export function getTabsAriaAttributes(
  validation: TabsValidation,
  orientation: TabsOrientation,
  describedBy: string[] = [],
): Record<string, string> {
  const ariaDescribedBy = describedBy.length > 0 ? describedBy.join(' ') : '';

  const attributes = createAccessibilityAttributes({
    ariaInvalid: !validation.valid,
    ariaDescribedBy: ariaDescribedBy || undefined,
    role: 'tablist',
  });

  // Filter out null values and ensure all values are strings
  const result: Record<string, string> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      result[key] = String(value);
    }
  });

  return result;
}

/**
 * Get tabs component CSS classes
 */
export function getTabsClasses(config: TabsConfig, state: TabsComponentState): string[] {
  const classes = [
    'ds-tabs',
    `ds-tabs--${config.variant}`,
    `ds-tabs--${config.size}`,
    `ds-tabs--${config.orientation}`,
    `ds-tabs--${config.alignment}`,
  ];

  if (state.isScrollable) {
    classes.push('ds-tabs--scrollable');
  }

  if (config.closable) {
    classes.push('ds-tabs--closable');
  }

  if (config.draggable) {
    classes.push('ds-tabs--draggable');
  }

  if (state.isDisabled) {
    classes.push('ds-tabs--disabled');
  }

  if (state.isLoading) {
    classes.push('ds-tabs--loading');
  }

  return classes;
}

/**
 * Generate unique tabs ID
 */
export function generateTabsId(): string {
  return generateComponentId('ds-tabs');
}

/**
 * Generate unique tab ID
 */
export function generateTabId(tabsId: string, index: number): string {
  return `${tabsId}-tab-${index}`;
}

/**
 * Generate unique tab panel ID
 */
export function generateTabPanelId(tabsId: string, index: number): string {
  return `${tabsId}-panel-${index}`;
}

/**
 * Check if tabs variant is valid
 */
export function isValidTabsVariant(variant: string): variant is TabsVariant {
  return ['default', 'primary', 'secondary', 'success', 'warning', 'danger'].includes(variant);
}

/**
 * Check if tabs orientation is valid
 */
export function isValidTabsOrientation(orientation: string): orientation is TabsOrientation {
  return ['horizontal', 'vertical'].includes(orientation);
}

/**
 * Check if tabs alignment is valid
 */
export function isValidTabsAlignment(alignment: string): alignment is TabsAlignment {
  return ['start', 'center', 'end', 'justified'].includes(alignment);
}
