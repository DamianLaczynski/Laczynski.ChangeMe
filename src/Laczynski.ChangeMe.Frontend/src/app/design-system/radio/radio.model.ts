// =============================================================================
// Radio Component Models
// =============================================================================
// Type definitions and interfaces for the Radio component
// Supports radio button groups with single selection

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
} from '../shared';

// =============================================================================
// RADIO-SPECIFIC TYPES
// =============================================================================

/**
 * Radio variants extending base component variants
 */
export type RadioVariant =
  | Extract<ComponentVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>
  | 'default';

/**
 * Radio states
 */
export type RadioState = 'default' | 'selected' | 'disabled' | 'error';

/**
 * Radio group layout
 */
export type RadioGroupLayout = 'vertical' | 'horizontal' | 'grid';

// =============================================================================
// CORE RADIO INTERFACES
// =============================================================================

/**
 * Radio option interface
 */
export interface RadioOption<T = any> {
  /** Unique identifier for the option */
  value: T;

  /** Display label */
  label: string;

  /** Whether option is disabled */
  disabled?: boolean;

  /** Optional description or subtitle */
  description?: string;

  /** Optional custom CSS classes */
  customClasses?: string;

  /** Custom data for the option */
  data?: any;
}

/**
 * Radio component configuration
 */
export interface RadioConfig {
  /** Radio variant */
  variant: RadioVariant;

  /** Radio size */
  size: ComponentSize;

  /** Layout for radio group */
  groupLayout: RadioGroupLayout;

  /** Whether labels are clickable */
  labelClickable: boolean;

  /** Whether to show validation messages */
  showValidation: boolean;

  /** Animation duration in milliseconds */
  animationDuration: number;
}

/**
 * Radio state extending form component state
 */
export interface RadioComponentState extends FormComponentState {
  /** Currently selected value */
  selectedValue: any;

  /** Current radio visual state */
  radioState: RadioState;
}

// =============================================================================
// EVENTS
// =============================================================================

/**
 * Radio change event
 */
export interface RadioChangeEvent<T = any> extends ComponentChangeEvent<T, HTMLInputElement> {
  /** Selected option */
  option: RadioOption<T>;
}

/**
 * Radio focus event
 */
export interface RadioFocusEvent extends ComponentFocusEvent<HTMLInputElement> {
  /** Focus direction */
  direction: 'in' | 'out';

  /** Focused option value */
  value?: any;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Radio validation result
 */
export interface RadioValidation extends ValidationResult {
  /** Custom validation rules */
  customRules?: RadioValidationRule[];
}

/**
 * Custom validation rule for radio
 */
export interface RadioValidationRule extends ValidationRule<any> {
  /** Validation function specific to radio */
  validator: (value: any) => boolean | Promise<boolean>;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default radio configuration
 */
export const DEFAULT_RADIO_CONFIG: RadioConfig = {
  variant: 'default',
  size: 'md',
  groupLayout: 'vertical',
  labelClickable: true,
  showValidation: true,
  animationDuration: 200,
};

/**
 * Radio size configurations extending base size config
 */
export const RADIO_SIZE_CONFIG = {
  sm: {
    ...getSizeConfiguration('sm'),
    radioSize: '16px',
    fontSize: '14px',
    gap: '8px',
  },
  md: {
    ...getSizeConfiguration('md'),
    radioSize: '20px',
    fontSize: '16px',
    gap: '12px',
  },
  lg: {
    ...getSizeConfiguration('lg'),
    radioSize: '24px',
    fontSize: '18px',
    gap: '16px',
  },
} as const;

/**
 * Radio variant definitions
 */
export const RADIO_VARIANTS: Record<RadioVariant, { className: string; label: string }> = {
  default: {
    className: 'ds-radio--default',
    label: 'Default',
  },
  primary: {
    className: 'ds-radio--primary',
    label: 'Primary',
  },
  secondary: {
    className: 'ds-radio--secondary',
    label: 'Secondary',
  },
  success: {
    className: 'ds-radio--success',
    label: 'Success',
  },
  warning: {
    className: 'ds-radio--warning',
    label: 'Warning',
  },
  danger: {
    className: 'ds-radio--danger',
    label: 'Danger',
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create radio configuration with defaults
 */
export function createRadioConfig(partial: Partial<RadioConfig> = {}): RadioConfig {
  return {
    ...DEFAULT_RADIO_CONFIG,
    ...partial,
  };
}

/**
 * Create radio option
 */
export function createRadioOption<T = any>(
  value: T,
  label: string,
  options: Partial<RadioOption<T>> = {},
): RadioOption<T> {
  return {
    value,
    label,
    ...options,
  };
}

/**
 * Create radio component state
 */
export function createRadioState(partial: Partial<RadioComponentState> = {}): RadioComponentState {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    isInvalid: false,
    isRequired: false,
    isReadonly: false,
    selectedValue: null,
    variant: 'primary',
    size: 'md',
    radioState: 'default',
    ...partial,
  };
}

/**
 * Validate radio value
 */
export function validateRadioValue<T = any>(
  value: T | null,
  required: boolean = false,
  customRules: RadioValidationRule[] = [],
): RadioValidation {
  let valid = true;
  let errorMessage = '';

  // Required validation
  if (required && (value === null || value === undefined)) {
    valid = false;
    errorMessage = 'Please select an option';
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

/**
 * Get radio state from validation and other props
 */
export function getRadioState<T = any>(
  value: T | null,
  optionValue: T,
  disabled: boolean,
  validation: RadioValidation,
): RadioState {
  if (disabled) return 'disabled';
  if (!validation.valid) return 'error';
  if (value === optionValue) return 'selected';
  return 'default';
}

/**
 * Check if radio option is selected
 */
export function isRadioOptionSelected<T = any>(option: RadioOption<T>, value: T | null): boolean {
  return option.value === value;
}

/**
 * Get selected radio option
 */
export function getSelectedRadioOption<T = any>(
  options: RadioOption<T>[],
  value: T | null,
): RadioOption<T> | null {
  return options.find(option => option.value === value) || null;
}

/**
 * Get next radio option for keyboard navigation
 */
export function getNextRadioOption<T = any>(
  options: RadioOption<T>[],
  currentValue: T | null,
  direction: 'next' | 'previous',
): RadioOption<T> | null {
  const availableOptions = options.filter(option => !option.disabled);
  if (availableOptions.length === 0) return null;

  const currentIndex = availableOptions.findIndex(option => option.value === currentValue);

  if (direction === 'next') {
    const nextIndex = (currentIndex + 1) % availableOptions.length;
    return availableOptions[nextIndex];
  } else {
    const prevIndex = currentIndex <= 0 ? availableOptions.length - 1 : currentIndex - 1;
    return availableOptions[prevIndex];
  }
}

/**
 * Get radio ARIA attributes
 */
export function getRadioAriaAttributes<T = any>(
  option: RadioOption<T>,
  value: T | null,
  validation: RadioValidation,
  groupName: string,
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

  // Add radio-specific attributes
  attributes['aria-checked'] = (option.value === value).toString();
  attributes['name'] = groupName;
  attributes['role'] = 'radio';

  return attributes;
}

/**
 * Get radio group ARIA attributes
 */
export function getRadioGroupAriaAttributes(
  validation: RadioValidation,
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

  // Add group-specific attributes
  attributes['role'] = 'radiogroup';

  return attributes;
}

/**
 * Format radio selection text
 */
export function formatRadioSelectionText<T = any>(
  options: RadioOption<T>[],
  value: T | null,
  placeholder: string = 'No selection',
): string {
  const selectedOption = getSelectedRadioOption(options, value);
  return selectedOption ? selectedOption.label : placeholder;
}

/**
 * Validate radio group structure
 */
export function validateRadioGroup<T = any>(
  options: RadioOption<T>[],
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for duplicate values
  const values = options.map(option => option.value);
  const uniqueValues = new Set(values);
  if (values.length !== uniqueValues.size) {
    errors.push('Duplicate values found in radio options');
  }

  // Check for empty labels
  const emptyLabels = options.filter(option => !option.label?.trim());
  if (emptyLabels.length > 0) {
    errors.push('Empty labels found in radio options');
  }

  // Check for at least one enabled option
  const enabledOptions = options.filter(option => !option.disabled);
  if (enabledOptions.length === 0) {
    errors.push('At least one radio option must be enabled');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Filter radio options by search query
 */
export function filterRadioOptions<T = any>(
  options: RadioOption<T>[],
  query: string,
): RadioOption<T>[] {
  if (!query.trim()) return options;

  const searchTerm = query.toLowerCase();
  return options.filter(option => {
    const label = option.label.toLowerCase();
    const description = option.description?.toLowerCase() || '';

    return label.includes(searchTerm) || description.includes(searchTerm);
  });
}

/**
 * Sort radio options by label
 */
export function sortRadioOptions<T = any>(
  options: RadioOption<T>[],
  direction: 'asc' | 'desc' = 'asc',
): RadioOption<T>[] {
  return [...options].sort((a, b) => {
    const comparison = a.label.localeCompare(b.label);
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Group radio options by custom function
 */
export function groupRadioOptions<T = any>(
  options: RadioOption<T>[],
  groupFn: (option: RadioOption<T>) => string,
): Record<string, RadioOption<T>[]> {
  return options.reduce(
    (groups, option) => {
      const groupKey = groupFn(option);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(option);
      return groups;
    },
    {} as Record<string, RadioOption<T>[]>,
  );
}

/**
 * Get radio CSS classes
 */
export function getRadioClasses(config: RadioConfig, state: RadioComponentState): string[] {
  const sizeConfig = getSizeConfiguration(config.size);
  const variantConfig = RADIO_VARIANTS[config.variant];

  const classes = ['ds-radio', sizeConfig.className, variantConfig.className];

  if (state.isDisabled) classes.push('ds-radio--disabled');
  if (state.selectedValue !== null) classes.push('ds-radio--selected');
  if (state.isFocused) classes.push('ds-radio--focused');
  if (state.isHovered) classes.push('ds-radio--hovered');
  if (state.isInvalid) classes.push('ds-radio--invalid');

  return classes;
}

/**
 * Generate unique radio group name
 */
export function generateRadioGroupName(): string {
  return generateComponentId('ds-radio-group');
}

/**
 * Check if a string is a valid radio variant
 */
export function isValidRadioVariant(variant: string): variant is RadioVariant {
  return Object.keys(RADIO_VARIANTS).includes(variant);
}
