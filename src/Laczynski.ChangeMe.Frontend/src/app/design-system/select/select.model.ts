// =============================================================================
// Select Component Models
// =============================================================================
// Type definitions and interfaces for the Select component
// Supports single and multi-select with search, grouping, and async loading

// =============================================================================
// CORE SELECT INTERFACES
// =============================================================================

/**
 * Select option interface
 */
export interface SelectOption<T = any> {
  /** Unique identifier for the option */
  value: T;

  /** Display label */
  label: string;

  /** Optional description or subtitle */
  description?: string;

  /** Whether option is disabled */
  disabled?: boolean;

  /** Optional group identifier */
  group?: string;

  /** Optional icon HTML */
  icon?: string;

  /** Custom data for the option */
  data?: any;
}

/**
 * Select option group
 */
export interface SelectOptionGroup<T = any> {
  /** Group identifier */
  id: string;

  /** Group display label */
  label: string;

  /** Options in this group */
  options: SelectOption<T>[];

  /** Whether group is disabled */
  disabled?: boolean;
}

/**
 * Select component configuration
 */
export interface SelectConfig {
  /** Select variant */
  variant: SelectVariant;

  /** Select size */
  size: SelectSize;

  /** Whether multiple selection is allowed */
  multiple: boolean;

  /** Whether search is enabled */
  searchable: boolean;

  /** Whether options are loaded asynchronously */
  async: boolean;

  /** Maximum number of selected items (for multiple) */
  maxSelections?: number;

  /** Virtual scrolling for large datasets */
  virtual: boolean;
}

/**
 * Select validation state
 */
export interface SelectValidation {
  /** Whether selection is valid */
  valid: boolean;

  /** Validation error message */
  errorMessage?: string;

  /** Custom validation rules */
  customRules?: SelectValidationRule[];
}

/**
 * Custom validation rule for select
 */
export interface SelectValidationRule {
  /** Rule name */
  name: string;

  /** Validation function */
  validator: (value: any | any[]) => boolean;

  /** Error message if validation fails */
  errorMessage: string;
}

// =============================================================================
// SELECT TYPES & VARIANTS
// =============================================================================

/**
 * Select variants
 */
export type SelectVariant = 'default' | 'filled' | 'outlined';

/**
 * Select size variants
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * Select states
 */
export type SelectState = 'default' | 'error' | 'success' | 'warning' | 'disabled' | 'loading';

// =============================================================================
// SELECT EVENTS
// =============================================================================

/**
 * Select change event
 */
export interface SelectChangeEvent<T = any> {
  /** New selected value(s) */
  value: T | T[];

  /** Selected option(s) */
  option: SelectOption<T> | SelectOption<T>[];

  /** Previous value(s) */
  previousValue: T | T[];

  /** Original DOM event */
  originalEvent?: Event;
}

/**
 * Select search event
 */
export interface SelectSearchEvent {
  /** Search query */
  query: string;

  /** Original input event */
  originalEvent: Event;
}

/**
 * Select open/close event
 */
export interface SelectToggleEvent {
  /** Whether dropdown is open */
  isOpen: boolean;

  /** Reason for toggle */
  reason: 'click' | 'keyboard' | 'focus' | 'blur' | 'escape';

  /** Original event */
  originalEvent?: Event;
}

/**
 * Select focus event
 */
export interface SelectFocusEvent {
  /** Focus direction */
  direction: 'in' | 'out';

  /** Original focus event */
  originalEvent: FocusEvent;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default select configuration
 */
export const DEFAULT_SELECT_CONFIG: SelectConfig = {
  variant: 'default',
  size: 'md',
  multiple: false,
  searchable: false,
  async: false,
  virtual: false,
};

/**
 * Select size configurations
 */
export const SELECT_SIZE_CONFIG = {
  sm: {
    height: '32px',
    fontSize: '14px',
    padding: '0 12px',
    optionHeight: '32px',
  },
  md: {
    height: '40px',
    fontSize: '16px',
    padding: '0 16px',
    optionHeight: '40px',
  },
  lg: {
    height: '48px',
    fontSize: '18px',
    padding: '0 20px',
    optionHeight: '48px',
  },
} as const;

/**
 * Maximum items to show before virtual scrolling
 */
export const VIRTUAL_SCROLL_THRESHOLD = 100;

/**
 * Default dropdown height
 */
export const DEFAULT_DROPDOWN_HEIGHT = '200px';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create select configuration with defaults
 */
export function createSelectConfig(partial: Partial<SelectConfig> = {}): SelectConfig {
  return {
    ...DEFAULT_SELECT_CONFIG,
    ...partial,
  };
}

/**
 * Create select option
 */
export function createSelectOption<T = any>(
  value: T,
  label: string,
  options: Partial<SelectOption<T>> = {},
): SelectOption<T> {
  return {
    value,
    label,
    ...options,
  };
}

/**
 * Group options by group property
 */
export function groupOptions<T = any>(options: SelectOption<T>[]): SelectOptionGroup<T>[] {
  const grouped = new Map<string, SelectOption<T>[]>();
  const ungrouped: SelectOption<T>[] = [];

  for (const option of options) {
    if (option.group) {
      if (!grouped.has(option.group)) {
        grouped.set(option.group, []);
      }
      grouped.get(option.group)!.push(option);
    } else {
      ungrouped.push(option);
    }
  }

  const groups: SelectOptionGroup<T>[] = [];

  // Add ungrouped options first
  if (ungrouped.length > 0) {
    groups.push({
      id: '__ungrouped__',
      label: '',
      options: ungrouped,
    });
  }

  // Add grouped options
  for (const [groupId, groupOptions] of grouped.entries()) {
    groups.push({
      id: groupId,
      label: groupId,
      options: groupOptions,
    });
  }

  return groups;
}

/**
 * Filter options by search query
 */
export function filterOptions<T = any>(
  options: SelectOption<T>[],
  query: string,
): SelectOption<T>[] {
  if (!query.trim()) return options;

  const searchTerm = query.toLowerCase().trim();

  return options.filter(
    option =>
      option.label.toLowerCase().includes(searchTerm) ||
      (option.description && option.description.toLowerCase().includes(searchTerm)),
  );
}

/**
 * Get selected options from values
 */
export function getSelectedOptions<T = any>(
  options: SelectOption<T>[],
  values: T | T[],
): SelectOption<T>[] {
  const valueArray = Array.isArray(values) ? values : [values];
  return options.filter(option => valueArray.includes(option.value));
}

/**
 * Validate select value
 */
export function validateSelectValue<T = any>(
  value: T | T[],
  required: boolean = false,
  customRules: SelectValidationRule[] = [],
): SelectValidation {
  const validation: SelectValidation = {
    valid: true,
  };

  // Required validation
  if (required) {
    const isEmpty = Array.isArray(value) ? value.length === 0 : value == null;
    if (isEmpty) {
      validation.valid = false;
      validation.errorMessage = 'Please select an option';
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
 * Get select state from validation
 */
export function getSelectStateFromValidation(validation: SelectValidation): SelectState {
  if (!validation.valid) return 'error';
  return 'default';
}

/**
 * Check if option is selected
 */
export function isOptionSelected<T = any>(option: SelectOption<T>, value: T | T[]): boolean {
  if (Array.isArray(value)) {
    return value.includes(option.value);
  }
  return option.value === value;
}

/**
 * Get display text for selected values
 */
export function getSelectionDisplayText<T = any>(
  options: SelectOption<T>[],
  values: T | T[],
  placeholder: string = 'Select...',
): string {
  const selectedOptions = getSelectedOptions(options, values);

  if (selectedOptions.length === 0) {
    return placeholder;
  }

  if (selectedOptions.length === 1) {
    return selectedOptions[0].label;
  }

  return `${selectedOptions.length} items selected`;
}

/**
 * Get accessibility attributes for select
 */
export function getSelectAriaAttributes(
  validation: SelectValidation,
  isOpen: boolean,
  describedBy: string[] = [],
): Record<string, string> {
  const attrs: Record<string, string> = {
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen.toString(),
  };

  if (!validation.valid) {
    attrs['aria-invalid'] = 'true';
  }

  if (describedBy.length > 0) {
    attrs['aria-describedby'] = describedBy.join(' ');
  }

  return attrs;
}
