// =============================================================================
// Design System Shared Types
// =============================================================================
// Common types and interfaces used across design system components
// Ensures consistency and reusability of type definitions

// =============================================================================
// SIZE TYPES
// =============================================================================

/**
 * Standard component sizes used across the design system
 * Used by buttons, inputs, cards, lists, and other components
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Extended component sizes that includes extra large
 * Used by components that need more size variants (e.g., cards, modals)
 */
export type ExtendedComponentSize = ComponentSize | 'xl';

// =============================================================================
// VARIANT TYPES
// =============================================================================

/**
 * Standard color variants used across components
 */
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'ghost'
  | 'link';

/**
 * Input-specific variants
 */
export type InputVariant = 'outline' | 'filled' | 'underline' | 'ghost';

// =============================================================================
// COMMON EVENT INTERFACES
// =============================================================================

/**
 * Base event interface for all design system events
 */
export interface BaseComponentEvent<TElement = HTMLElement> {
  /** Original DOM event */
  event: Event;
  /** Reference to the component element */
  element: TElement;
  /** Timestamp when event occurred */
  timestamp: number;
}

/**
 * Click event interface
 */
export interface ComponentClickEvent<TElement = HTMLElement> extends BaseComponentEvent<TElement> {
  event: MouseEvent;
}

/**
 * Focus event interface
 */
export interface ComponentFocusEvent<TElement = HTMLElement> extends BaseComponentEvent<TElement> {
  event: FocusEvent;
}

/**
 * Change event interface
 */
export interface ComponentChangeEvent<TValue = string, TElement = HTMLElement>
  extends BaseComponentEvent<TElement> {
  /** Current value */
  value: TValue;
  /** Previous value */
  previousValue?: TValue;
}

// =============================================================================
// SIZE CONFIGURATION
// =============================================================================

/**
 * Size configuration interface for components
 */
export interface SizeConfiguration {
  /** Size identifier */
  name: ComponentSize | ExtendedComponentSize;
  /** CSS class name */
  className: string;
  /** Display label */
  label: string;
  /** Height in pixels */
  height?: number;
  /** Font size */
  fontSize?: string;
  /** Padding */
  padding?: string;
}

/**
 * Standard size configurations for consistent sizing across components
 */
export const STANDARD_SIZE_CONFIG: Record<ComponentSize, SizeConfiguration> = {
  sm: {
    name: 'sm',
    className: 'ds-size--sm',
    label: 'Small',
    height: 32,
    fontSize: 'var(--font-size-sm)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
  },
  md: {
    name: 'md',
    className: 'ds-size--md',
    label: 'Medium',
    height: 40,
    fontSize: 'var(--font-size-base)',
    padding: 'var(--spacing-md) var(--spacing-lg)',
  },
  lg: {
    name: 'lg',
    className: 'ds-size--lg',
    label: 'Large',
    height: 48,
    fontSize: 'var(--font-size-lg)',
    padding: 'var(--spacing-lg) var(--spacing-xl)',
  },
};

/**
 * Extended size configurations including extra large
 */
export const EXTENDED_SIZE_CONFIG: Record<ExtendedComponentSize, SizeConfiguration> = {
  ...STANDARD_SIZE_CONFIG,
  xl: {
    name: 'xl',
    className: 'ds-size--xl',
    label: 'Extra Large',
    height: 56,
    fontSize: 'var(--font-size-xl)',
    padding: 'var(--spacing-xl) var(--spacing-2xl)',
  },
};

// =============================================================================
// ACCESSIBILITY INTERFACES
// =============================================================================

/**
 * Common accessibility configuration for components
 */
export interface AccessibilityConfig {
  /** ARIA label */
  ariaLabel?: string;
  /** ARIA described by */
  ariaDescribedBy?: string;
  /** ARIA controls */
  ariaControls?: string;
  /** ARIA expanded */
  ariaExpanded?: boolean;
  /** ARIA pressed (for toggle buttons) */
  ariaPressed?: boolean;
  /** ARIA invalid (for form controls) */
  ariaInvalid?: boolean;
  /** Tab index */
  tabIndex?: number;
  /** Role */
  role?: string;
}

// =============================================================================
// COMPONENT STATE INTERFACES
// =============================================================================

/**
 * Common component state
 */
export interface ComponentState {
  /** Whether component is focused */
  isFocused: boolean;
  /** Whether component is hovered */
  isHovered: boolean;
  /** Whether component is active/pressed */
  isActive: boolean;
  /** Whether component is disabled */
  isDisabled: boolean;
  /** Whether component is loading */
  isLoading: boolean;
  /** Current variant */
  variant: ComponentVariant;
  /** Current size */
  size: ComponentSize;
}

/**
 * Form component specific state
 */
export interface FormComponentState extends ComponentState {
  /** Whether component is invalid */
  isInvalid: boolean;
  /** Whether component is required */
  isRequired: boolean;
  /** Whether component is readonly */
  isReadonly: boolean;
  /** Current validation message */
  validationMessage?: string;
}

// =============================================================================
// VALIDATION INTERFACES
// =============================================================================

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation error message */
  errorMessage?: string;
  /** Validation error code */
  errorCode?: string;
  /** Field name that failed validation */
  field?: string;
}

/**
 * Validation rule interface
 */
export interface ValidationRule<T = any> {
  /** Rule name */
  name: string;
  /** Validation function */
  validator: (value: T) => boolean | Promise<boolean>;
  /** Error message when validation fails */
  errorMessage: string;
  /** Whether rule is async */
  async?: boolean;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a string is a valid component size
 */
export const isValidComponentSize = (size: string): size is ComponentSize => {
  return ['sm', 'md', 'lg'].includes(size);
};

/**
 * Check if a string is a valid extended component size
 */
export const isValidExtendedComponentSize = (size: string): size is ExtendedComponentSize => {
  return ['sm', 'md', 'lg', 'xl'].includes(size);
};

/**
 * Check if a string is a valid component variant
 */
export const isValidComponentVariant = (variant: string): variant is ComponentVariant => {
  return ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'ghost', 'link'].includes(
    variant,
  );
};

/**
 * Get size configuration by name
 */
export const getSizeConfiguration = (size: ComponentSize): SizeConfiguration => {
  return STANDARD_SIZE_CONFIG[size];
};

/**
 * Get extended size configuration by name
 */
export const getExtendedSizeConfiguration = (size: ExtendedComponentSize): SizeConfiguration => {
  return EXTENDED_SIZE_CONFIG[size];
};

/**
 * Generate unique component ID
 */
export const generateComponentId = (prefix: string = 'ds-component'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Merge CSS classes safely
 */
export const mergeClasses = (...classes: (string | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Create accessibility attributes object
 */
export const createAccessibilityAttributes = (
  config: AccessibilityConfig,
): Record<string, string | null> => {
  const attributes: Record<string, string | null> = {};

  if (config.ariaLabel) attributes['aria-label'] = config.ariaLabel;
  if (config.ariaDescribedBy) attributes['aria-describedby'] = config.ariaDescribedBy;
  if (config.ariaControls) attributes['aria-controls'] = config.ariaControls;
  if (config.ariaExpanded !== undefined)
    attributes['aria-expanded'] = config.ariaExpanded.toString();
  if (config.ariaPressed !== undefined) attributes['aria-pressed'] = config.ariaPressed.toString();
  if (config.ariaInvalid !== undefined) attributes['aria-invalid'] = config.ariaInvalid.toString();
  if (config.role) attributes['role'] = config.role;

  return attributes;
};
