// =============================================================================
// Switch Component Models
// =============================================================================
// TypeScript models and types for Switch component

// =============================================================================
// BASE INTERFACES
// =============================================================================

/**
 * Switch configuration interface
 */
export interface SwitchConfig {
  /** Switch size */
  size: SwitchSize;

  /** Switch variant/style */
  variant: SwitchVariant;

  /** Whether switch is disabled */
  disabled: boolean;

  /** Whether switch is readonly */
  readonly: boolean;

  /** Whether switch is required in forms */
  required: boolean;

  /** Label text */
  label?: string;

  /** Helper text displayed below switch */
  helperText?: string;

  /** Aria label for accessibility */
  ariaLabel?: string;

  /** Custom CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT TYPES
// =============================================================================

/** Available switch sizes */
export type SwitchSize = 'sm' | 'md' | 'lg';

/** Available switch variants */
export type SwitchVariant = 'default' | 'success' | 'warning' | 'danger';

/** Switch states */
export type SwitchState = 'checked' | 'unchecked' | 'indeterminate';

// =============================================================================
// EVENT INTERFACES
// =============================================================================

/**
 * Switch change event
 */
export interface SwitchChangeEvent {
  /** New checked state */
  checked: boolean;

  /** Switch value */
  value: boolean;

  /** Original DOM event */
  originalEvent: Event;

  /** Event timestamp */
  timestamp: number;
}

/**
 * Switch focus event
 */
export interface SwitchFocusEvent {
  /** Current checked state */
  checked: boolean;

  /** Focus type */
  type: 'focus' | 'blur';

  /** Original DOM event */
  originalEvent: FocusEvent;

  /** Event timestamp */
  timestamp: number;
}

/**
 * Switch keyboard event
 */
export interface SwitchKeyboardEvent {
  /** Current checked state */
  checked: boolean;

  /** Key that was pressed */
  key: string;

  /** Key code */
  keyCode: number;

  /** Original DOM event */
  originalEvent: KeyboardEvent;

  /** Event timestamp */
  timestamp: number;
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create default switch configuration
 */
export const createSwitchConfig = (overrides?: Partial<SwitchConfig>): SwitchConfig => ({
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
  ...overrides,
});

/**
 * Create switch change event
 */
export const createSwitchChangeEvent = (
  checked: boolean,
  originalEvent: Event,
): SwitchChangeEvent => ({
  checked,
  value: checked,
  originalEvent,
  timestamp: Date.now(),
});

/**
 * Create switch focus event
 */
export const createSwitchFocusEvent = (
  checked: boolean,
  type: 'focus' | 'blur',
  originalEvent: FocusEvent,
): SwitchFocusEvent => ({
  checked,
  type,
  originalEvent,
  timestamp: Date.now(),
});

/**
 * Create switch keyboard event
 */
export const createSwitchKeyboardEvent = (
  checked: boolean,
  originalEvent: KeyboardEvent,
): SwitchKeyboardEvent => ({
  checked,
  key: originalEvent.key,
  keyCode: originalEvent.keyCode,
  originalEvent,
  timestamp: Date.now(),
});

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Check if switch size is valid
 */
export const isValidSwitchSize = (size: string): size is SwitchSize => {
  return ['sm', 'md', 'lg'].includes(size);
};

/**
 * Check if switch variant is valid
 */
export const isValidSwitchVariant = (variant: string): variant is SwitchVariant => {
  return ['default', 'success', 'warning', 'danger'].includes(variant);
};

/**
 * Get switch size label for display
 */
export const getSwitchSizeLabel = (size: SwitchSize): string => {
  const labels: Record<SwitchSize, string> = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  };
  return labels[size];
};

/**
 * Get switch variant label for display
 */
export const getSwitchVariantLabel = (variant: SwitchVariant): string => {
  const labels: Record<SwitchVariant, string> = {
    default: 'Default',
    success: 'Success',
    warning: 'Warning',
    danger: 'Danger',
  };
  return labels[variant];
};
