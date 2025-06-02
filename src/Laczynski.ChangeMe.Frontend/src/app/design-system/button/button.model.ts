// =============================================================================
// Button Component Models
// =============================================================================
// TypeScript interfaces and types for the Button component
// Provides type safety and documentation for component usage

import {
  ComponentSize,
  ComponentVariant,
  ComponentState,
  ComponentClickEvent,
  ComponentFocusEvent,
} from '../shared';

// =============================================================================
// BUTTON-SPECIFIC TYPES
// =============================================================================

/**
 * Button HTML type attribute values
 */
export type ButtonType = 'button' | 'submit' | 'reset';

// =============================================================================
// BUTTON EVENT INTERFACES
// =============================================================================

/**
 * Button click event payload with button-specific data
 */
export interface ButtonClickEvent extends ComponentClickEvent<HTMLButtonElement> {
  /** Button variant that was clicked */
  variant: ComponentVariant;
  /** Button size that was clicked */
  size: ComponentSize;
  /** Whether button was in loading state */
  wasLoading: boolean;
}

/**
 * Button focus event payload
 */
export interface ButtonFocusEvent extends ComponentFocusEvent<HTMLButtonElement> {}

/**
 * Button blur event payload (same as focus)
 */
export interface ButtonBlurEvent extends ComponentFocusEvent<HTMLButtonElement> {}

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Button component configuration interface
 * Used for setting default values and component behavior
 */
export interface ButtonConfig {
  /** Default button variant */
  defaultVariant: ComponentVariant;
  /** Default button size */
  defaultSize: ComponentSize;
  /** Whether to show loading spinner by default */
  defaultShowSpinner: boolean;
  /** Default tab index */
  defaultTabIndex: number;
  /** Whether buttons are full width by default */
  defaultFullWidth: boolean;
}

/**
 * Button accessibility configuration
 */
export interface ButtonAccessibilityConfig {
  /** Default ARIA label prefix */
  defaultAriaLabelPrefix?: string;
  /** Whether to automatically generate ARIA labels */
  autoAriaLabel: boolean;
  /** Default tab index for disabled buttons */
  disabledTabIndex: number;
  /** Whether to announce loading state changes */
  announceLoadingChanges: boolean;
}

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

/**
 * Button variant style definition
 */
export interface ButtonVariantDefinition {
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
  /** Default text color for contrast checking */
  defaultTextColor: string;
  /** Default background color */
  defaultBackgroundColor: string;
}

/**
 * All available button variants with their definitions
 */
export const BUTTON_VARIANTS: Record<ComponentVariant, ButtonVariantDefinition> = {
  primary: {
    name: 'primary',
    className: 'ds-button--primary',
    label: 'Primary',
    description: 'Main call-to-action buttons',
    supportsIcons: true,
    defaultTextColor: '#ffffff',
    defaultBackgroundColor: 'var(--color-primary)',
  },
  secondary: {
    name: 'secondary',
    className: 'ds-button--secondary',
    label: 'Secondary',
    description: 'Secondary actions and alternative choices',
    supportsIcons: true,
    defaultTextColor: '#ffffff',
    defaultBackgroundColor: 'var(--color-secondary)',
  },
  success: {
    name: 'success',
    className: 'ds-button--success',
    label: 'Success',
    description: 'Positive actions like save, confirm, approve',
    supportsIcons: true,
    defaultTextColor: '#ffffff',
    defaultBackgroundColor: 'var(--color-success)',
  },
  warning: {
    name: 'warning',
    className: 'ds-button--warning',
    label: 'Warning',
    description: 'Caution actions that need user attention',
    supportsIcons: true,
    defaultTextColor: 'var(--color-gray-900)',
    defaultBackgroundColor: 'var(--color-warning)',
  },
  danger: {
    name: 'danger',
    className: 'ds-button--danger',
    label: 'Danger',
    description: 'Destructive actions like delete, remove, cancel',
    supportsIcons: true,
    defaultTextColor: '#ffffff',
    defaultBackgroundColor: 'var(--color-danger)',
  },
  info: {
    name: 'info',
    className: 'ds-button--info',
    label: 'Info',
    description: 'Informational actions and neutral choices',
    supportsIcons: true,
    defaultTextColor: '#ffffff',
    defaultBackgroundColor: 'var(--color-info)',
  },
  ghost: {
    name: 'ghost',
    className: 'ds-button--ghost',
    label: 'Ghost',
    description: 'Subtle actions with minimal visual weight',
    supportsIcons: true,
    defaultTextColor: 'var(--color-text)',
    defaultBackgroundColor: 'transparent',
  },
  link: {
    name: 'link',
    className: 'ds-button--link',
    label: 'Link',
    description: 'Text-like buttons for inline actions',
    supportsIcons: true,
    defaultTextColor: 'var(--color-primary)',
    defaultBackgroundColor: 'transparent',
  },
};

// =============================================================================
// SIZE DEFINITIONS
// =============================================================================

/**
 * Button size definition with button-specific properties
 */
export interface ButtonSizeDefinition {
  /** Size name */
  name: ComponentSize;
  /** CSS class name */
  className: string;
  /** Display label */
  label: string;
  /** Height in pixels */
  height: number;
  /** Recommended minimum width */
  minWidth: number;
  /** Font size */
  fontSize: string;
  /** Padding horizontal */
  paddingHorizontal: string;
  /** Icon size */
  iconSize: string;
}

/**
 * All available button sizes with their definitions
 */
export const BUTTON_SIZES: Record<ComponentSize, ButtonSizeDefinition> = {
  sm: {
    name: 'sm',
    className: 'ds-button--sm',
    label: 'Small',
    height: 32,
    minWidth: 64,
    fontSize: '14px',
    paddingHorizontal: '12px',
    iconSize: '16px',
  },
  md: {
    name: 'md',
    className: 'ds-button--md',
    label: 'Medium',
    height: 40,
    minWidth: 80,
    fontSize: '16px',
    paddingHorizontal: '16px',
    iconSize: '18px',
  },
  lg: {
    name: 'lg',
    className: 'ds-button--lg',
    label: 'Large',
    height: 48,
    minWidth: 96,
    fontSize: '18px',
    paddingHorizontal: '20px',
    iconSize: '20px',
  },
};

// =============================================================================
// BUTTON STATE
// =============================================================================

/**
 * Button-specific state extending base component state
 */
export interface ButtonState extends ComponentState {
  /** Whether button is currently pressed */
  isPressed: boolean;
  /** Whether button shows loading spinner */
  showsSpinner: boolean;
  /** Whether button content is hidden during loading */
  contentHidden: boolean;
}

// =============================================================================
// BUTTON METRICS
// =============================================================================

/**
 * Button usage metrics for analytics
 */
export interface ButtonMetrics {
  /** Number of times button was clicked */
  clickCount: number;
  /** Average time between clicks */
  averageClickInterval: number;
  /** Last click timestamp */
  lastClickTime: number;
  /** Time spent in loading state */
  totalLoadingTime: number;
  /** Button render timestamp */
  renderTime: number;
  /** Most recent variant used */
  mostRecentVariant: ComponentVariant;
  /** Most recent size used */
  mostRecentSize: ComponentSize;
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

/**
 * Default button configuration
 */
export const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
  defaultVariant: 'primary',
  defaultSize: 'md',
  defaultShowSpinner: true,
  defaultTabIndex: 0,
  defaultFullWidth: false,
};

/**
 * Default button accessibility configuration
 */
export const DEFAULT_BUTTON_A11Y_CONFIG: ButtonAccessibilityConfig = {
  autoAriaLabel: false,
  disabledTabIndex: -1,
  announceLoadingChanges: true,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a string is a valid button variant
 */
export const isValidButtonVariant = (variant: string): variant is ComponentVariant => {
  return Object.keys(BUTTON_VARIANTS).includes(variant);
};

/**
 * Check if a string is a valid button size
 */
export const isValidButtonSize = (size: string): size is ComponentSize => {
  return Object.keys(BUTTON_SIZES).includes(size);
};

/**
 * Get button variant definition
 */
export const getButtonVariantDefinition = (variant: ComponentVariant): ButtonVariantDefinition => {
  return BUTTON_VARIANTS[variant];
};

/**
 * Get button size definition
 */
export const getButtonSizeDefinition = (size: ComponentSize): ButtonSizeDefinition => {
  return BUTTON_SIZES[size];
};

/**
 * Create button configuration with defaults
 */
export const createButtonConfig = (partial: Partial<ButtonConfig> = {}): ButtonConfig => {
  return { ...DEFAULT_BUTTON_CONFIG, ...partial };
};

/**
 * Create button state with defaults
 */
export const createButtonState = (partial: Partial<ButtonState> = {}): ButtonState => {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    isPressed: false,
    showsSpinner: true,
    contentHidden: false,
    variant: 'primary',
    size: 'md',
    ...partial,
  };
};
