// =============================================================================
// Switch Component Models
// =============================================================================
// TypeScript models and types for Switch component

import {
  ComponentSize,
  ComponentVariant,
  FormComponentState,
  ComponentChangeEvent,
  ComponentFocusEvent,
  AccessibilityConfig,
  ValidationResult,
  ValidationRule,
  generateComponentId,
  createAccessibilityAttributes,
  getSizeConfiguration,
  isValidComponentSize,
} from '../shared';

// =============================================================================
// SWITCH-SPECIFIC TYPES
// =============================================================================

/**
 * Switch variants extending base component variants
 */
export type SwitchVariant =
  | Extract<ComponentVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>
  | 'default';

/**
 * Switch states
 */
export type SwitchState = 'checked' | 'unchecked' | 'indeterminate';

// =============================================================================
// BASE INTERFACES
// =============================================================================

/**
 * Switch configuration interface
 */
export interface SwitchConfig {
  /** Switch size */
  size: ComponentSize;

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

  /** Animation duration in milliseconds */
  animationDuration: number;

  /** Custom CSS classes */
  className?: string;
}

/**
 * Switch state extending form component state
 */
export interface SwitchComponentState extends FormComponentState {
  /** Whether switch is checked */
  isChecked: boolean;

  /** Current switch visual state */
  switchState: SwitchState;
}

// =============================================================================
// EVENT INTERFACES
// =============================================================================

/**
 * Switch change event
 */
export interface SwitchChangeEvent extends ComponentChangeEvent<boolean, HTMLInputElement> {
  /** New checked state */
  checked: boolean;
}

/**
 * Switch focus event
 */
export interface SwitchFocusEvent extends ComponentFocusEvent<HTMLInputElement> {
  /** Focus direction */
  direction: 'in' | 'out';

  /** Current checked state */
  checked: boolean;
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
  code: string;

  /** Whether modifier keys were pressed */
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;

  /** Original keyboard event */
  originalEvent: KeyboardEvent;

  /** Event timestamp */
  timestamp: number;

  /** Element that triggered the event */
  element: HTMLInputElement;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Switch validation result
 */
export interface SwitchValidation extends ValidationResult {
  /** Custom validation rules */
  customRules?: SwitchValidationRule[];
}

/**
 * Custom validation rule for switch
 */
export interface SwitchValidationRule extends ValidationRule<boolean> {
  /** Validation function specific to switch */
  validator: (value: boolean) => boolean | Promise<boolean>;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default switch configuration
 */
export const DEFAULT_SWITCH_CONFIG: SwitchConfig = {
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
  animationDuration: 200,
};

/**
 * Switch size configurations extending base size config
 */
export const SWITCH_SIZE_CONFIG = {
  sm: {
    ...getSizeConfiguration('sm'),
    switchWidth: '32px',
    switchHeight: '18px',
    thumbSize: '14px',
  },
  md: {
    ...getSizeConfiguration('md'),
    switchWidth: '44px',
    switchHeight: '24px',
    thumbSize: '20px',
  },
  lg: {
    ...getSizeConfiguration('lg'),
    switchWidth: '56px',
    switchHeight: '30px',
    thumbSize: '26px',
  },
} as const;

/**
 * Switch variant definitions
 */
export const SWITCH_VARIANTS: Record<SwitchVariant, { className: string; label: string }> = {
  default: {
    className: 'ds-switch--default',
    label: 'Default',
  },
  primary: {
    className: 'ds-switch--primary',
    label: 'Primary',
  },
  secondary: {
    className: 'ds-switch--secondary',
    label: 'Secondary',
  },
  success: {
    className: 'ds-switch--success',
    label: 'Success',
  },
  warning: {
    className: 'ds-switch--warning',
    label: 'Warning',
  },
  danger: {
    className: 'ds-switch--danger',
    label: 'Danger',
  },
};

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create switch configuration with defaults
 */
export function createSwitchConfig(overrides?: Partial<SwitchConfig>): SwitchConfig {
  return {
    ...DEFAULT_SWITCH_CONFIG,
    ...overrides,
  };
}

/**
 * Create switch component state
 */
export function createSwitchState(
  partial: Partial<SwitchComponentState> = {},
): SwitchComponentState {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    isInvalid: false,
    isRequired: false,
    isReadonly: false,
    isChecked: false,
    variant: 'primary',
    size: 'md',
    switchState: 'unchecked',
    ...partial,
  };
}

/**
 * Create switch change event
 */
export function createSwitchChangeEvent(
  checked: boolean,
  originalEvent: Event,
  element: HTMLInputElement,
): SwitchChangeEvent {
  return {
    event: originalEvent,
    element,
    timestamp: Date.now(),
    value: checked,
    previousValue: undefined, // Will be set by component
    checked,
  };
}

/**
 * Create switch focus event
 */
export function createSwitchFocusEvent(
  direction: 'in' | 'out',
  checked: boolean,
  originalEvent: FocusEvent,
  element: HTMLInputElement,
): SwitchFocusEvent {
  return {
    event: originalEvent,
    element,
    timestamp: Date.now(),
    direction,
    checked,
  };
}

/**
 * Create switch keyboard event
 */
export function createSwitchKeyboardEvent(
  checked: boolean,
  originalEvent: KeyboardEvent,
  element: HTMLInputElement,
): SwitchKeyboardEvent {
  return {
    checked,
    key: originalEvent.key,
    code: originalEvent.code,
    ctrlKey: originalEvent.ctrlKey,
    shiftKey: originalEvent.shiftKey,
    altKey: originalEvent.altKey,
    metaKey: originalEvent.metaKey,
    originalEvent,
    timestamp: Date.now(),
    element,
  };
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate switch value
 */
export function validateSwitchValue(
  value: boolean,
  required: boolean = false,
  customRules: SwitchValidationRule[] = [],
): SwitchValidation {
  let valid = true;
  let errorMessage = '';

  // Required validation
  if (required && !value) {
    valid = false;
    errorMessage = 'This switch must be enabled';
  }

  // Custom validation rules
  if (valid && customRules.length > 0) {
    for (const rule of customRules) {
      if (!rule.validator(value)) {
        valid = false;
        errorMessage = rule.errorMessage;
        break;
      }
    }
  }

  return {
    valid,
    errorMessage,
    customRules,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if size is valid
 */
export function isValidSwitchSize(size: string): size is ComponentSize {
  return isValidComponentSize(size);
}

/**
 * Check if variant is valid
 */
export function isValidSwitchVariant(variant: string): variant is SwitchVariant {
  return Object.keys(SWITCH_VARIANTS).includes(variant);
}

/**
 * Get switch size label
 */
export function getSwitchSizeLabel(size: ComponentSize): string {
  const sizeLabels = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  };
  return sizeLabels[size];
}

/**
 * Get switch variant label
 */
export function getSwitchVariantLabel(variant: SwitchVariant): string {
  return SWITCH_VARIANTS[variant].label;
}

/**
 * Get switch state from checked value
 */
export function getSwitchState(checked: boolean): SwitchState {
  return checked ? 'checked' : 'unchecked';
}

/**
 * Get switch ARIA attributes
 */
export function getSwitchAriaAttributes(
  validation: SwitchValidation,
  describedBy: string[] = [],
): Record<string, string> {
  const config: AccessibilityConfig = {
    ariaInvalid: !validation.valid,
    ariaDescribedBy: describedBy.length > 0 ? describedBy.join(' ') : undefined,
  };

  const rawAttributes = createAccessibilityAttributes(config);

  // Filter out null values and ensure all values are strings
  const attributes: Record<string, string> = {};

  Object.entries(rawAttributes).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      attributes[key] = value;
    }
  });

  return attributes;
}

/**
 * Get switch CSS classes
 */
export function getSwitchClasses(config: SwitchConfig, state: SwitchComponentState): string[] {
  const sizeConfig = getSizeConfiguration(config.size);
  const variantConfig = SWITCH_VARIANTS[config.variant];

  const classes = ['ds-switch', sizeConfig.className, variantConfig.className];

  if (state.isDisabled) classes.push('ds-switch--disabled');
  if (state.isChecked) classes.push('ds-switch--checked');
  if (state.isFocused) classes.push('ds-switch--focused');
  if (state.isHovered) classes.push('ds-switch--hovered');
  if (state.isInvalid) classes.push('ds-switch--invalid');

  return classes;
}

/**
 * Generate unique switch ID
 */
export function generateSwitchId(): string {
  return generateComponentId('ds-switch');
}
