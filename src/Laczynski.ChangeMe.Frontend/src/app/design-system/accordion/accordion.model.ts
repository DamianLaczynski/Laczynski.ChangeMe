// =============================================================================
// Accordion Component Models
// =============================================================================
// TypeScript interfaces and types for the Accordion component
// Provides type safety and documentation for component usage

import {
  ComponentSize,
  ComponentVariant,
  ComponentState,
  ComponentClickEvent,
  ComponentFocusEvent,
} from '../shared';

// =============================================================================
// ACCORDION-SPECIFIC TYPES
// =============================================================================

/**
 * Accordion item state
 */
export type AccordionItemState = 'expanded' | 'collapsed' | 'disabled';

/**
 * Accordion expansion mode
 */
export type AccordionMode = 'single' | 'multiple';

// =============================================================================
// ACCORDION EVENT INTERFACES
// =============================================================================

/**
 * Accordion item expansion event payload
 */
export interface AccordionItemExpandEvent extends ComponentClickEvent<HTMLButtonElement> {
  /** Item index that was expanded/collapsed */
  itemIndex: number;
  /** Item key if provided */
  itemKey?: string;
  /** Whether item is now expanded */
  expanded: boolean;
  /** Item data */
  item: AccordionItem;
}

/**
 * Accordion focus event payload
 */
export interface AccordionFocusEvent extends ComponentFocusEvent<HTMLElement> {
  /** Focused item index */
  itemIndex: number;
}

// =============================================================================
// ACCORDION ITEM INTERFACE
// =============================================================================

/**
 * Single accordion item configuration
 */
export interface AccordionItem {
  /** Unique identifier for the item */
  key?: string;
  /** Item title/header text */
  title: string;
  /** Item content (can be HTML string or template) */
  content: string;
  /** Whether item is initially expanded */
  expanded?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Custom icon name for the item */
  icon?: string;
  /** Custom CSS classes for the item */
  customClasses?: string;
  /** Accessibility label for the item */
  ariaLabel?: string;
  /** Additional data attached to the item */
  data?: any;
}

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Accordion component configuration interface
 */
export interface AccordionConfig {
  /** Default expansion mode */
  defaultMode: AccordionMode;
  /** Default component size */
  defaultSize: ComponentSize;
  /** Default component variant */
  defaultVariant: ComponentVariant;
  /** Whether to animate expansions */
  defaultAnimated: boolean;
  /** Animation duration in milliseconds */
  defaultAnimationDuration: number;
  /** Whether to show icons by default */
  defaultShowIcons: boolean;
  /** Default icon for collapsed items */
  defaultCollapsedIcon: string;
  /** Default icon for expanded items */
  defaultExpandedIcon: string;
}

/**
 * Accordion accessibility configuration
 */
export interface AccordionAccessibilityConfig {
  /** Default ARIA label for accordion */
  defaultAriaLabel?: string;
  /** Whether to automatically generate item IDs */
  autoGenerateIds: boolean;
  /** Prefix for auto-generated IDs */
  idPrefix: string;
  /** Whether to announce expansion state changes */
  announceStateChanges: boolean;
  /** Whether to enable keyboard navigation */
  keyboardNavigation: boolean;
}

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

/**
 * Accordion variant style definition
 */
export interface AccordionVariantDefinition {
  /** Variant name */
  name: ComponentVariant;
  /** CSS class name */
  className: string;
  /** Display label for the variant */
  label: string;
  /** Description of when to use this variant */
  description: string;
  /** Whether this variant supports icons */
  supportsIcons: boolean;
  /** Default border color */
  defaultBorderColor?: string;
  /** Default background color */
  defaultBackgroundColor?: string;
}

/**
 * All available accordion variants with their definitions
 */
export const ACCORDION_VARIANTS: Record<ComponentVariant, AccordionVariantDefinition> = {
  primary: {
    name: 'primary',
    className: 'ds-accordion--primary',
    label: 'Primary',
    description: 'Primary accordion with brand colors',
    supportsIcons: true,
    defaultBorderColor: 'var(--color-primary)',
    defaultBackgroundColor: 'var(--color-surface)',
  },
  secondary: {
    name: 'secondary',
    className: 'ds-accordion--secondary',
    label: 'Secondary',
    description: 'Secondary accordion with subtle styling',
    supportsIcons: true,
    defaultBorderColor: 'var(--color-secondary)',
    defaultBackgroundColor: 'var(--color-surface)',
  },
  success: {
    name: 'success',
    className: 'ds-accordion--success',
    label: 'Success',
    description: 'Success accordion for positive content',
    supportsIcons: true,
    defaultBorderColor: 'var(--color-success)',
    defaultBackgroundColor: 'var(--color-surface)',
  },
  warning: {
    name: 'warning',
    className: 'ds-accordion--warning',
    label: 'Warning',
    description: 'Warning accordion for cautionary content',
    supportsIcons: true,
    defaultBorderColor: 'var(--color-warning)',
    defaultBackgroundColor: 'var(--color-surface)',
  },
  danger: {
    name: 'danger',
    className: 'ds-accordion--danger',
    label: 'Danger',
    description: 'Danger accordion for critical content',
    supportsIcons: true,
    defaultBorderColor: 'var(--color-danger)',
    defaultBackgroundColor: 'var(--color-surface)',
  },
  info: {
    name: 'info',
    className: 'ds-accordion--info',
    label: 'Info',
    description: 'Info accordion for informational content',
    supportsIcons: true,
    defaultBorderColor: 'var(--color-info)',
    defaultBackgroundColor: 'var(--color-surface)',
  },
  ghost: {
    name: 'ghost',
    className: 'ds-accordion--ghost',
    label: 'Ghost',
    description: 'Minimal accordion with no background',
    supportsIcons: true,
    defaultBorderColor: 'var(--color-border)',
    defaultBackgroundColor: 'transparent',
  },
  link: {
    name: 'link',
    className: 'ds-accordion--link',
    label: 'Link',
    description: 'Link-style accordion',
    supportsIcons: true,
    defaultBorderColor: 'transparent',
    defaultBackgroundColor: 'transparent',
  },
};

// =============================================================================
// SIZE DEFINITIONS
// =============================================================================

/**
 * Accordion size definition with accordion-specific properties
 */
export interface AccordionSizeDefinition {
  /** Size name */
  name: ComponentSize;
  /** CSS class name */
  className: string;
  /** Display label */
  label: string;
  /** Header height in pixels */
  headerHeight: number;
  /** Font size for header */
  headerFontSize: string;
  /** Font size for content */
  contentFontSize: string;
  /** Padding for header */
  headerPadding: string;
  /** Padding for content */
  contentPadding: string;
  /** Icon size */
  iconSize: string;
}

/**
 * All available accordion sizes with their definitions
 */
export const ACCORDION_SIZES: Record<ComponentSize, AccordionSizeDefinition> = {
  sm: {
    name: 'sm',
    className: 'ds-accordion--sm',
    label: 'Small',
    headerHeight: 40,
    headerFontSize: 'var(--font-size-sm)',
    contentFontSize: 'var(--font-size-xs)',
    headerPadding: 'var(--spacing-sm) var(--spacing-md)',
    contentPadding: 'var(--spacing-md)',
    iconSize: '16px',
  },
  md: {
    name: 'md',
    className: 'ds-accordion--md',
    label: 'Medium',
    headerHeight: 48,
    headerFontSize: 'var(--font-size-base)',
    contentFontSize: 'var(--font-size-sm)',
    headerPadding: 'var(--spacing-md) var(--spacing-lg)',
    contentPadding: 'var(--spacing-lg)',
    iconSize: '20px',
  },
  lg: {
    name: 'lg',
    className: 'ds-accordion--lg',
    label: 'Large',
    headerHeight: 56,
    headerFontSize: 'var(--font-size-lg)',
    contentFontSize: 'var(--font-size-base)',
    headerPadding: 'var(--spacing-lg) var(--spacing-xl)',
    contentPadding: 'var(--spacing-xl)',
    iconSize: '24px',
  },
};

// =============================================================================
// COMPONENT STATE
// =============================================================================

/**
 * Accordion component state extending base ComponentState
 */
export interface AccordionState extends ComponentState {
  /** Array of expanded item indices */
  expandedItems: number[];
  /** Currently focused item index */
  focusedItem: number | null;
  /** Whether accordion is in single or multiple mode */
  mode: AccordionMode;
  /** Whether animations are enabled */
  animated: boolean;
  /** Whether initialExpanded has been processed (prevents reapplying) */
  initialExpandedProcessed: boolean;
}

/**
 * Accordion metrics for performance tracking
 */
export interface AccordionMetrics {
  /** Number of expansion events */
  expansionCount: number;
  /** Number of collapse events */
  collapseCount: number;
  /** Average time spent expanded per item */
  averageExpansionTime: number;
  /** Most frequently expanded item index */
  mostExpandedItem: number | null;
  /** Component render timestamp */
  renderTime: number;
  /** Total number of items */
  totalItems: number;
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

/**
 * Default accordion configuration
 */
export const DEFAULT_ACCORDION_CONFIG: AccordionConfig = {
  defaultMode: 'single',
  defaultSize: 'md',
  defaultVariant: 'primary',
  defaultAnimated: true,
  defaultAnimationDuration: 300,
  defaultShowIcons: true,
  defaultCollapsedIcon: 'chevron-right',
  defaultExpandedIcon: 'chevron-down',
};

/**
 * Default accordion accessibility configuration
 */
export const DEFAULT_ACCORDION_A11Y_CONFIG: AccordionAccessibilityConfig = {
  autoGenerateIds: true,
  idPrefix: 'ds-accordion',
  announceStateChanges: true,
  keyboardNavigation: true,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a mode is valid
 */
export const isValidAccordionMode = (mode: string): mode is AccordionMode => {
  return ['single', 'multiple'].includes(mode);
};

/**
 * Get accordion variant definition
 */
export const getAccordionVariantDefinition = (
  variant: ComponentVariant,
): AccordionVariantDefinition => {
  return ACCORDION_VARIANTS[variant];
};

/**
 * Get accordion size definition
 */
export const getAccordionSizeDefinition = (size: ComponentSize): AccordionSizeDefinition => {
  return ACCORDION_SIZES[size];
};

/**
 * Create accordion configuration with defaults
 */
export const createAccordionConfig = (partial: Partial<AccordionConfig> = {}): AccordionConfig => {
  return { ...DEFAULT_ACCORDION_CONFIG, ...partial };
};

/**
 * Create accordion state with defaults
 */
export const createAccordionState = (partial: Partial<AccordionState> = {}): AccordionState => {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    variant: 'primary',
    size: 'md',
    expandedItems: [],
    focusedItem: null,
    mode: 'single',
    animated: true,
    initialExpandedProcessed: false,
    ...partial,
  };
};

/**
 * Validate accordion item
 */
export const validateAccordionItem = (item: AccordionItem): boolean => {
  return !!(item.title && item.content);
};

/**
 * Generate unique ID for accordion item
 */
export const generateAccordionItemId = (accordionId: string, itemIndex: number): string => {
  return `${accordionId}-item-${itemIndex}`;
};
