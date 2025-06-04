// =============================================================================
// Checkbox Component Models
// =============================================================================
// Type definitions and interfaces for the Checkbox component
// Supports single checkboxes, checkbox groups, and indeterminate states

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
// CHECKBOX-SPECIFIC TYPES
// =============================================================================

/**
 * Checkbox variants extending base component variants
 */
export type CheckboxVariant =
  | Extract<ComponentVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>
  | 'default';

/**
 * Checkbox states
 */
export type CheckboxState = 'default' | 'checked' | 'indeterminate' | 'disabled' | 'error';

/**
 * Checkbox group layout
 */
export type CheckboxGroupLayout = 'vertical' | 'horizontal' | 'grid';

// =============================================================================
// CHECKBOX OPTION INTERFACE
// =============================================================================

/**
 * Checkbox option interface (for checkbox groups)
 */
export interface CheckboxOption<T = any> {
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

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Checkbox component configuration
 */
export interface CheckboxConfig {
  /** Checkbox variant */
  variant: CheckboxVariant;

  /** Checkbox size */
  size: ComponentSize;

  /** Whether checkbox is in a group */
  isGroup: boolean;

  /** Layout for checkbox groups */
  groupLayout: CheckboxGroupLayout;

  /** Whether labels are clickable */
  labelClickable: boolean;

  /** Whether to show validation icons */
  showValidationIcons: boolean;

  /** Animation duration in milliseconds */
  animationDuration: number;
}

/**
 * Checkbox state extending form component state
 */
export interface CheckboxComponentState extends FormComponentState {
  /** Whether checkbox is checked */
  isChecked: boolean;

  /** Whether checkbox is indeterminate */
  isIndeterminate: boolean;

  /** Current checkbox visual state */
  checkboxState: CheckboxState;
}

// =============================================================================
// EVENTS
// =============================================================================

/**
 * Checkbox change event
 */
export interface CheckboxChangeEvent<T = any>
  extends ComponentChangeEvent<boolean | T[], HTMLInputElement> {
  /** New checked state or selected values */
  checked: boolean | T[];

  /** Source checkbox option (for groups) */
  source?: CheckboxOption<T>;

  /** Whether change was from select all */
  isSelectAll?: boolean;
}

/**
 * Checkbox focus event
 */
export interface CheckboxFocusEvent extends ComponentFocusEvent<HTMLInputElement> {
  /** Focus direction */
  direction: 'in' | 'out';
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Checkbox validation result
 */
export interface CheckboxValidation extends ValidationResult {
  /** Custom validation rules */
  customRules?: CheckboxValidationRule[];
}

/**
 * Custom validation rule for checkbox
 */
export interface CheckboxValidationRule extends ValidationRule<boolean | any[]> {
  /** Validation function specific to checkbox */
  validator: (value: boolean | any[]) => boolean | Promise<boolean>;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default checkbox configuration
 */
export const DEFAULT_CHECKBOX_CONFIG: CheckboxConfig = {
  variant: 'default',
  size: 'md',
  isGroup: false,
  groupLayout: 'vertical',
  labelClickable: true,
  showValidationIcons: true,
  animationDuration: 200,
};

/**
 * Checkbox size configurations extending base size config
 */
export const CHECKBOX_SIZE_CONFIG = {
  sm: {
    ...getSizeConfiguration('sm'),
    checkboxSize: '16px',
    fontSize: '14px',
    gap: '8px',
  },
  md: {
    ...getSizeConfiguration('md'),
    checkboxSize: '20px',
    fontSize: '16px',
    gap: '12px',
  },
  lg: {
    ...getSizeConfiguration('lg'),
    checkboxSize: '24px',
    fontSize: '18px',
    gap: '16px',
  },
} as const;

/**
 * Checkbox variant definitions
 */
export const CHECKBOX_VARIANTS: Record<CheckboxVariant, { className: string; label: string }> = {
  default: {
    className: 'ds-checkbox--default',
    label: 'Default',
  },
  primary: {
    className: 'ds-checkbox--primary',
    label: 'Primary',
  },
  secondary: {
    className: 'ds-checkbox--secondary',
    label: 'Secondary',
  },
  success: {
    className: 'ds-checkbox--success',
    label: 'Success',
  },
  warning: {
    className: 'ds-checkbox--warning',
    label: 'Warning',
  },
  danger: {
    className: 'ds-checkbox--danger',
    label: 'Danger',
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create checkbox configuration with defaults
 */
export function createCheckboxConfig(partial: Partial<CheckboxConfig> = {}): CheckboxConfig {
  return {
    ...DEFAULT_CHECKBOX_CONFIG,
    ...partial,
  };
}

/**
 * Create checkbox option
 */
export function createCheckboxOption<T = any>(
  value: T,
  label: string,
  options: Partial<CheckboxOption<T>> = {},
): CheckboxOption<T> {
  return {
    value,
    label,
    ...options,
  };
}

/**
 * Create checkbox component state
 */
export function createCheckboxState(
  partial: Partial<CheckboxComponentState> = {},
): CheckboxComponentState {
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
    isIndeterminate: false,
    variant: 'primary',
    size: 'md',
    checkboxState: 'default',
    ...partial,
  };
}

/**
 * Validate checkbox value
 */
export function validateCheckboxValue<T = any>(
  value: boolean | T[],
  required: boolean = false,
  customRules: CheckboxValidationRule[] = [],
): CheckboxValidation {
  let valid = true;
  let errorMessage = '';

  // Required validation
  if (required) {
    if (Array.isArray(value)) {
      valid = value.length > 0;
      errorMessage = valid ? '' : 'At least one option must be selected';
    } else {
      valid = value === true;
      errorMessage = valid ? '' : 'This field is required';
    }
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
 * Get checkbox state from validation and other props
 */
export function getCheckboxState(
  checked: boolean,
  indeterminate: boolean,
  disabled: boolean,
  validation: CheckboxValidation,
): CheckboxState {
  if (disabled) return 'disabled';
  if (!validation.valid) return 'error';
  if (indeterminate) return 'indeterminate';
  if (checked) return 'checked';
  return 'default';
}

/**
 * Check if checkbox option is selected
 */
export function isCheckboxOptionSelected<T = any>(option: CheckboxOption<T>, values: T[]): boolean {
  return values.includes(option.value);
}

/**
 * Toggle checkbox option selection
 */
export function toggleCheckboxOptionSelection<T = any>(
  option: CheckboxOption<T>,
  currentValues: T[],
): T[] {
  const isSelected = isCheckboxOptionSelected(option, currentValues);

  if (isSelected) {
    return currentValues.filter(value => value !== option.value);
  } else {
    return [...currentValues, option.value];
  }
}

/**
 * Get selected checkbox options
 */
export function getSelectedCheckboxOptions<T = any>(
  options: CheckboxOption<T>[],
  values: T[],
): CheckboxOption<T>[] {
  return options.filter(option => isCheckboxOptionSelected(option, values));
}

/**
 * Get indeterminate state for select all checkbox
 */
export function getIndeterminateState<T = any>(
  options: CheckboxOption<T>[],
  selectedValues: T[],
): { checked: boolean; indeterminate: boolean } {
  const availableOptions = options.filter(option => !option.disabled);

  if (availableOptions.length === 0) {
    return { checked: false, indeterminate: false };
  }

  const selectedCount = availableOptions.filter(option =>
    isCheckboxOptionSelected(option, selectedValues),
  ).length;

  if (selectedCount === 0) {
    return { checked: false, indeterminate: false };
  } else if (selectedCount === availableOptions.length) {
    return { checked: true, indeterminate: false };
  } else {
    return { checked: false, indeterminate: true };
  }
}

/**
 * Select all available options
 */
export function selectAllOptions<T = any>(options: CheckboxOption<T>[]): T[] {
  return options.filter(option => !option.disabled).map(option => option.value);
}

/**
 * Deselect all options
 */
export function deselectAllOptions<T = any>(): T[] {
  return [];
}

/**
 * Get checkbox ARIA attributes
 */
export function getCheckboxAriaAttributes(
  checked: boolean,
  indeterminate: boolean,
  validation: CheckboxValidation,
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

  // Add checkbox-specific attributes
  attributes['aria-checked'] = indeterminate ? 'mixed' : checked.toString();

  return attributes;
}

/**
 * Get checkbox CSS classes
 */
export function getCheckboxClasses(
  config: CheckboxConfig,
  state: CheckboxComponentState,
): string[] {
  const sizeConfig = getSizeConfiguration(config.size);
  const variantConfig = CHECKBOX_VARIANTS[config.variant];

  const classes = ['ds-checkbox', sizeConfig.className, variantConfig.className];

  if (state.isDisabled) classes.push('ds-checkbox--disabled');
  if (state.isChecked) classes.push('ds-checkbox--checked');
  if (state.isIndeterminate) classes.push('ds-checkbox--indeterminate');
  if (state.isFocused) classes.push('ds-checkbox--focused');
  if (state.isHovered) classes.push('ds-checkbox--hovered');
  if (state.isInvalid) classes.push('ds-checkbox--invalid');

  return classes;
}

/**
 * Format selection text for multiple selections
 */
export function formatSelectionText<T = any>(
  options: CheckboxOption<T>[],
  selectedValues: T[],
  maxDisplayItems: number = 3,
): string {
  const selectedOptions = getSelectedCheckboxOptions(options, selectedValues);

  if (selectedOptions.length === 0) {
    return 'None selected';
  }

  if (selectedOptions.length <= maxDisplayItems) {
    return selectedOptions.map(option => option.label).join(', ');
  }

  const displayed = selectedOptions.slice(0, maxDisplayItems).map(option => option.label);
  const remaining = selectedOptions.length - maxDisplayItems;

  return `${displayed.join(', ')} +${remaining} more`;
}

/**
 * Validate group selection with min/max constraints
 */
export function validateGroupSelection<T = any>(
  selectedValues: T[],
  minSelections?: number,
  maxSelections?: number,
): CheckboxValidation {
  let valid = true;
  let errorMessage = '';

  if (minSelections !== undefined && selectedValues.length < minSelections) {
    valid = false;
    errorMessage = `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`;
  } else if (maxSelections !== undefined && selectedValues.length > maxSelections) {
    valid = false;
    errorMessage = `Please select no more than ${maxSelections} option${maxSelections > 1 ? 's' : ''}`;
  }

  return { valid, errorMessage };
}

/**
 * Generate unique checkbox ID
 */
export function generateCheckboxId(): string {
  return generateComponentId('ds-checkbox');
}

/**
 * Check if a string is a valid checkbox variant
 */
export function isValidCheckboxVariant(variant: string): variant is CheckboxVariant {
  return Object.keys(CHECKBOX_VARIANTS).includes(variant);
}
