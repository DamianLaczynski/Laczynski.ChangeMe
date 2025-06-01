// =============================================================================
// Checkbox Component Models
// =============================================================================
// Type definitions and interfaces for the Checkbox component
// Supports single checkboxes, checkbox groups, and indeterminate states

// =============================================================================
// CORE CHECKBOX INTERFACES
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

/**
 * Checkbox component configuration
 */
export interface CheckboxConfig {
  /** Checkbox variant */
  variant: CheckboxVariant;

  /** Checkbox size */
  size: CheckboxSize;

  /** Whether checkbox is in a group */
  isGroup: boolean;

  /** Layout for checkbox groups */
  groupLayout: CheckboxGroupLayout;

  /** Whether labels are clickable */
  labelClickable: boolean;
}

/**
 * Checkbox validation state
 */
export interface CheckboxValidation {
  /** Whether checkbox state is valid */
  valid: boolean;

  /** Validation error message */
  errorMessage?: string;

  /** Custom validation rules */
  customRules?: CheckboxValidationRule[];
}

/**
 * Custom validation rule for checkbox
 */
export interface CheckboxValidationRule {
  /** Rule name */
  name: string;

  /** Validation function */
  validator: (value: boolean | any[]) => boolean;

  /** Error message if validation fails */
  errorMessage: string;
}

// =============================================================================
// CHECKBOX TYPES & VARIANTS
// =============================================================================

/**
 * Checkbox variants
 */
export type CheckboxVariant = 'default' | 'filled' | 'outlined';

/**
 * Checkbox size variants
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * Checkbox states
 */
export type CheckboxState = 'default' | 'checked' | 'indeterminate' | 'disabled' | 'error';

/**
 * Checkbox group layout
 */
export type CheckboxGroupLayout = 'vertical' | 'horizontal' | 'grid';

// =============================================================================
// CHECKBOX EVENTS
// =============================================================================

/**
 * Checkbox change event
 */
export interface CheckboxChangeEvent<T = any> {
  /** New checked state or selected values */
  checked: boolean | T[];

  /** Original DOM event */
  originalEvent: Event;

  /** Source checkbox (for groups) */
  source?: CheckboxOption<T>;
}

/**
 * Checkbox focus event
 */
export interface CheckboxFocusEvent {
  /** Focus direction */
  direction: 'in' | 'out';

  /** Original focus event */
  originalEvent: FocusEvent;
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
};

/**
 * Checkbox size configurations
 */
export const CHECKBOX_SIZE_CONFIG = {
  sm: {
    size: '16px',
    fontSize: '14px',
    gap: '8px',
  },
  md: {
    size: '20px',
    fontSize: '16px',
    gap: '12px',
  },
  lg: {
    size: '24px',
    fontSize: '18px',
    gap: '16px',
  },
} as const;

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
 * Validate checkbox value
 */
export function validateCheckboxValue<T = any>(
  value: boolean | T[],
  required: boolean = false,
  customRules: CheckboxValidationRule[] = [],
): CheckboxValidation {
  const validation: CheckboxValidation = {
    valid: true,
  };

  // Required validation
  if (required) {
    const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
    if (isEmpty) {
      validation.valid = false;
      validation.errorMessage = 'This field is required';
      return validation;
    }
  }

  // Custom validation rules
  for (const rule of customRules) {
    if (!rule.validator(value)) {
      validation.valid = false;
      validation.errorMessage = rule.errorMessage;
      break;
    }
  }

  return validation;
}

/**
 * Get checkbox state from value and validation
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
 * Check if option is selected in group
 */
export function isCheckboxOptionSelected<T = any>(option: CheckboxOption<T>, values: T[]): boolean {
  return values.includes(option.value);
}

/**
 * Toggle option selection in group
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
 * Get selected options from values
 */
export function getSelectedCheckboxOptions<T = any>(
  options: CheckboxOption<T>[],
  values: T[],
): CheckboxOption<T>[] {
  return options.filter(option => values.includes(option.value));
}

/**
 * Get indeterminate state for "select all" checkbox
 */
export function getIndeterminateState<T = any>(
  options: CheckboxOption<T>[],
  selectedValues: T[],
): { checked: boolean; indeterminate: boolean } {
  const availableOptions = options.filter(opt => !opt.disabled);
  const selectedCount = selectedValues.length;
  const totalCount = availableOptions.length;

  if (selectedCount === 0) {
    return { checked: false, indeterminate: false };
  }

  if (selectedCount === totalCount) {
    return { checked: true, indeterminate: false };
  }

  return { checked: false, indeterminate: true };
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
 * Get accessibility attributes for checkbox
 */
export function getCheckboxAriaAttributes(
  checked: boolean,
  indeterminate: boolean,
  validation: CheckboxValidation,
  describedBy: string[] = [],
): Record<string, string> {
  const attrs: Record<string, string> = {
    'aria-checked': indeterminate ? 'mixed' : checked.toString(),
  };

  if (!validation.valid) {
    attrs['aria-invalid'] = 'true';
  }

  if (describedBy.length > 0) {
    attrs['aria-describedby'] = describedBy.join(' ');
  }

  return attrs;
}

/**
 * Format checkbox group selection text
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
    return selectedOptions.map(opt => opt.label).join(', ');
  }

  const displayItems = selectedOptions.slice(0, maxDisplayItems).map(opt => opt.label);
  const remaining = selectedOptions.length - maxDisplayItems;

  return `${displayItems.join(', ')} and ${remaining} more`;
}

/**
 * Validate checkbox group minimum/maximum selections
 */
export function validateGroupSelection<T = any>(
  selectedValues: T[],
  minSelections?: number,
  maxSelections?: number,
): CheckboxValidation {
  const validation: CheckboxValidation = { valid: true };
  const count = selectedValues.length;

  if (minSelections !== undefined && count < minSelections) {
    validation.valid = false;
    validation.errorMessage = `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`;
    return validation;
  }

  if (maxSelections !== undefined && count > maxSelections) {
    validation.valid = false;
    validation.errorMessage = `Please select no more than ${maxSelections} option${maxSelections > 1 ? 's' : ''}`;
    return validation;
  }

  return validation;
}
