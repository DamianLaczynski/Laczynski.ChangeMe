// =============================================================================
// Button Component Models
// =============================================================================
// TypeScript interfaces and types for the Button component
// Provides type safety and documentation for component usage

// =============================================================================
// CORE BUTTON TYPES
// =============================================================================

/**
 * Available button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Available button style variants
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'link';

/**
 * Button HTML type attribute values
 */
export type ButtonType = 'button' | 'submit' | 'reset';

// =============================================================================
// EVENT INTERFACES
// =============================================================================

/**
 * Button click event payload
 * Contains all relevant information about the button click
 */
export interface ButtonClickEvent {
  /** Original DOM MouseEvent */
  event: MouseEvent;
  /** Reference to the button HTML element */
  buttonElement: HTMLButtonElement;
  /** Timestamp when the click occurred */
  timestamp: number;
  /** Button variant that was clicked */
  variant?: ButtonVariant;
  /** Button size that was clicked */
  size?: ButtonSize;
  /** Whether button was in loading state */
  wasLoading?: boolean;
}

/**
 * Button focus event payload
 */
export interface ButtonFocusEvent {
  /** Original DOM FocusEvent */
  event: FocusEvent;
  /** Reference to the button HTML element */
  buttonElement: HTMLButtonElement;
  /** Timestamp when focus occurred */
  timestamp: number;
}

/**
 * Button blur event payload
 */
export interface ButtonBlurEvent {
  /** Original DOM FocusEvent */
  event: FocusEvent;
  /** Reference to the button HTML element */
  buttonElement: HTMLButtonElement;
  /** Timestamp when blur occurred */
  timestamp: number;
}

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Button component configuration interface
 * Used for setting default values and component behavior
 */
export interface ButtonConfig {
  /** Default button variant */
  defaultVariant: ButtonVariant;
  /** Default button size */
  defaultSize: ButtonSize;
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
  name: ButtonVariant;
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
export const BUTTON_VARIANTS: Record<ButtonVariant, ButtonVariantDefinition> = {
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
    description: 'Text-like buttons for navigation or subtle actions',
    supportsIcons: false,
    defaultTextColor: 'var(--color-primary)',
    defaultBackgroundColor: 'transparent',
  },
};

/**
 * Button size definition
 */
export interface ButtonSizeDefinition {
  /** Size name */
  name: ButtonSize;
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
}

/**
 * All available button sizes with their definitions
 */
export const BUTTON_SIZES: Record<ButtonSize, ButtonSizeDefinition> = {
  sm: {
    name: 'sm',
    className: 'ds-button--sm',
    label: 'Small',
    height: 32,
    minWidth: 64,
    fontSize: 'var(--font-size-sm)',
    paddingHorizontal: 'var(--spacing-md)',
  },
  md: {
    name: 'md',
    className: 'ds-button--md',
    label: 'Medium',
    height: 40,
    minWidth: 80,
    fontSize: 'var(--font-size-base)',
    paddingHorizontal: 'var(--spacing-lg)',
  },
  lg: {
    name: 'lg',
    className: 'ds-button--lg',
    label: 'Large',
    height: 48,
    minWidth: 96,
    fontSize: 'var(--font-size-lg)',
    paddingHorizontal: 'var(--spacing-xl)',
  },
};

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Button state for analytics and debugging
 */
export interface ButtonState {
  /** Whether button is currently focused */
  isFocused: boolean;
  /** Whether button is currently hovered */
  isHovered: boolean;
  /** Whether button is currently pressed */
  isPressed: boolean;
  /** Whether button is disabled */
  isDisabled: boolean;
  /** Whether button is loading */
  isLoading: boolean;
  /** Current variant */
  variant: ButtonVariant;
  /** Current size */
  size: ButtonSize;
}

/**
 * Button metrics for performance monitoring
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
 * Default accessibility configuration
 */
export const DEFAULT_ACCESSIBILITY_CONFIG: ButtonAccessibilityConfig = {
  autoAriaLabel: false,
  disabledTabIndex: -1,
  announceLoadingChanges: true,
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a string is a valid button variant
 */
export const isValidButtonVariant = (variant: string): variant is ButtonVariant => {
  return Object.keys(BUTTON_VARIANTS).includes(variant);
};

/**
 * Check if a string is a valid button size
 */
export const isValidButtonSize = (size: string): size is ButtonSize => {
  return Object.keys(BUTTON_SIZES).includes(size);
};

/**
 * Get button variant definition by name
 */
export const getButtonVariantDefinition = (variant: ButtonVariant): ButtonVariantDefinition => {
  return BUTTON_VARIANTS[variant];
};

/**
 * Get button size definition by name
 */
export const getButtonSizeDefinition = (size: ButtonSize): ButtonSizeDefinition => {
  return BUTTON_SIZES[size];
};
