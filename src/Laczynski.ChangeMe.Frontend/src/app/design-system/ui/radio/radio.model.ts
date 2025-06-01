// =============================================================================
// Radio Component Models
// =============================================================================
// Type definitions and interfaces for the Radio component
// Supports radio button groups with single selection

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
  size: RadioSize;

  /** Layout for radio group */
  groupLayout: RadioGroupLayout;

  /** Whether labels are clickable */
  labelClickable: boolean;

  /** Whether to show validation messages */
  showValidation: boolean;
}

/**
 * Radio validation state
 */
export interface RadioValidation {
  /** Whether radio selection is valid */
  valid: boolean;

  /** Validation error message */
  errorMessage?: string;

  /** Custom validation rules */
  customRules?: RadioValidationRule[];
}

/**
 * Custom validation rule for radio
 */
export interface RadioValidationRule {
  /** Rule name */
  name: string;

  /** Validation function */
  validator: (value: any) => boolean;

  /** Error message if validation fails */
  errorMessage: string;
}

// =============================================================================
// RADIO TYPES & VARIANTS
// =============================================================================

/**
 * Radio variants
 */
export type RadioVariant = 'default' | 'filled' | 'outlined';

/**
 * Radio size variants
 */
export type RadioSize = 'sm' | 'md' | 'lg';

/**
 * Radio states
 */
export type RadioState = 'default' | 'selected' | 'disabled' | 'error';

/**
 * Radio group layout
 */
export type RadioGroupLayout = 'vertical' | 'horizontal' | 'grid';

// =============================================================================
// RADIO EVENTS
// =============================================================================

/**
 * Radio change event
 */
export interface RadioChangeEvent<T = any> {
  /** New selected value */
  value: T;

  /** Selected option */
  option: RadioOption<T>;

  /** Previous value */
  previousValue: T | null;

  /** Original DOM event */
  originalEvent: Event;
}

/**
 * Radio focus event
 */
export interface RadioFocusEvent {
  /** Focus direction */
  direction: 'in' | 'out';

  /** Original focus event */
  originalEvent: FocusEvent;

  /** Focused option value */
  value?: any;
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
};

/**
 * Radio size configurations
 */
export const RADIO_SIZE_CONFIG = {
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
 * Validate radio value
 */
export function validateRadioValue<T = any>(
  value: T | null,
  required: boolean = false,
  customRules: RadioValidationRule[] = [],
): RadioValidation {
  const validation: RadioValidation = {
    valid: true,
  };

  // Required validation
  if (required && (value === null || value === undefined)) {
    validation.valid = false;
    validation.errorMessage = 'Please select an option';
    return validation;
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
 * Get radio state from value and validation
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
 * Check if option is selected
 */
export function isRadioOptionSelected<T = any>(option: RadioOption<T>, value: T | null): boolean {
  return value === option.value;
}

/**
 * Get selected option from value
 */
export function getSelectedRadioOption<T = any>(
  options: RadioOption<T>[],
  value: T | null,
): RadioOption<T> | null {
  return options.find(option => option.value === value) || null;
}

/**
 * Get next selectable option (for keyboard navigation)
 */
export function getNextRadioOption<T = any>(
  options: RadioOption<T>[],
  currentValue: T | null,
  direction: 'next' | 'previous',
): RadioOption<T> | null {
  const enabledOptions = options.filter(opt => !opt.disabled);
  if (enabledOptions.length === 0) return null;

  const currentIndex = enabledOptions.findIndex(opt => opt.value === currentValue);

  if (direction === 'next') {
    const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
    return enabledOptions[nextIndex];
  } else {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
    return enabledOptions[prevIndex];
  }
}

/**
 * Get accessibility attributes for radio
 */
export function getRadioAriaAttributes<T = any>(
  option: RadioOption<T>,
  value: T | null,
  validation: RadioValidation,
  groupName: string,
  describedBy: string[] = [],
): Record<string, string> {
  const attrs: Record<string, string> = {
    role: 'radio',
    'aria-checked': (value === option.value).toString(),
    name: groupName,
  };

  if (!validation.valid) {
    attrs['aria-invalid'] = 'true';
  }

  if (option.disabled) {
    attrs['aria-disabled'] = 'true';
  }

  if (describedBy.length > 0) {
    attrs['aria-describedby'] = describedBy.join(' ');
  }

  return attrs;
}

/**
 * Get radio group accessibility attributes
 */
export function getRadioGroupAriaAttributes(
  validation: RadioValidation,
  describedBy: string[] = [],
): Record<string, string> {
  const attrs: Record<string, string> = {
    role: 'radiogroup',
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
 * Validate radio group completeness
 */
export function validateRadioGroup<T = any>(
  options: RadioOption<T>[],
): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for duplicate values
  const values = options.map(opt => opt.value);
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    errors.push('Radio options must have unique values');
  }

  // Check for empty labels
  const emptyLabels = options.filter(opt => !opt.label || opt.label.trim() === '');
  if (emptyLabels.length > 0) {
    errors.push('All radio options must have labels');
  }

  // Check minimum options
  if (options.length < 2) {
    errors.push('Radio group must have at least 2 options');
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

  const searchTerm = query.toLowerCase().trim();

  return options.filter(
    option =>
      option.label.toLowerCase().includes(searchTerm) ||
      (option.description && option.description.toLowerCase().includes(searchTerm)),
  );
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
 * Group radio options by custom grouping function
 */
export function groupRadioOptions<T = any>(
  options: RadioOption<T>[],
  groupFn: (option: RadioOption<T>) => string,
): Record<string, RadioOption<T>[]> {
  return options.reduce(
    (groups, option) => {
      const group = groupFn(option);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    },
    {} as Record<string, RadioOption<T>[]>,
  );
}
