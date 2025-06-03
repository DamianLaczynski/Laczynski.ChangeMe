// =============================================================================
// Select Component Models
// =============================================================================
// Type definitions and interfaces for the Select component
// Supports single and multi-select with search, grouping, and async loading

import {
  ComponentSize,
  ComponentVariant,
  ComponentState,
  FormComponentState,
  ComponentChangeEvent,
  ComponentFocusEvent,
  AccessibilityConfig,
  ValidationResult,
  ValidationRule,
  generateComponentId,
  mergeClasses,
  createAccessibilityAttributes,
  getSizeConfiguration,
  isValidComponentSize,
  isValidComponentVariant,
} from '../shared';

// =============================================================================
// SELECT-SPECIFIC TYPES
// =============================================================================

/**
 * Select variants extending base component variants
 */
export type SelectVariant =
  | Extract<ComponentVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>
  | 'default';

/**
 * Select states
 */
export type SelectState = 'default' | 'error' | 'success' | 'warning' | 'disabled' | 'loading';

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

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Select component configuration
 */
export interface SelectConfig {
  /** Select variant */
  variant: SelectVariant;

  /** Select size */
  size: ComponentSize;

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

  /** Animation duration in milliseconds */
  animationDuration: number;

  /** Whether to show validation icons */
  showValidationIcons: boolean;
}

/**
 * Select state extending form component state
 */
export interface SelectComponentState extends FormComponentState {
  /** Whether dropdown is open */
  isOpen: boolean;

  /** Current search query */
  searchQuery: string;

  /** Currently highlighted option index */
  highlightedIndex: number;

  /** Current select visual state */
  selectState: SelectState;
}

// =============================================================================
// EVENTS
// =============================================================================

/**
 * Select change event
 */
export interface SelectChangeEvent<T = any> extends ComponentChangeEvent<T | T[], HTMLElement> {
  /** Selected option(s) */
  option: SelectOption<T> | SelectOption<T>[];
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
export interface SelectFocusEvent extends ComponentFocusEvent<HTMLElement> {
  /** Focus direction */
  direction: 'in' | 'out';
}

/**
 * Select clear event
 */
export interface SelectClearEvent<T = any> {
  /** Select element reference */
  element: HTMLElement;
  /** Previous value before clear */
  previousValue: T | T[] | null;
  /** Previously selected options */
  previousOptions: SelectOption<T>[];
  /** Timestamp when clear occurred */
  timestamp: number;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Select validation result
 */
export interface SelectValidation extends ValidationResult {
  /** Custom validation rules */
  customRules?: SelectValidationRule[];
}

/**
 * Custom validation rule for select
 */
export interface SelectValidationRule extends ValidationRule<any | any[]> {
  /** Validation function specific to select */
  validator: (value: any | any[]) => boolean | Promise<boolean>;
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
  animationDuration: 200,
  showValidationIcons: true,
};

/**
 * Select variant definitions
 */
export const SELECT_VARIANTS: Record<SelectVariant, { className: string; label: string }> = {
  default: {
    className: 'ds-select--default',
    label: 'Default',
  },
  primary: {
    className: 'ds-select--primary',
    label: 'Primary',
  },
  secondary: {
    className: 'ds-select--secondary',
    label: 'Secondary',
  },
  success: {
    className: 'ds-select--success',
    label: 'Success',
  },
  warning: {
    className: 'ds-select--warning',
    label: 'Warning',
  },
  danger: {
    className: 'ds-select--danger',
    label: 'Danger',
  },
};

/**
 * Select size configurations extending base size config
 */
export const SELECT_SIZE_CONFIG = {
  sm: {
    ...getSizeConfiguration('sm'),
    dropdownMaxHeight: '200px',
    optionHeight: '32px',
  },
  md: {
    ...getSizeConfiguration('md'),
    dropdownMaxHeight: '250px',
    optionHeight: '40px',
  },
  lg: {
    ...getSizeConfiguration('lg'),
    dropdownMaxHeight: '300px',
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
 * Create select component state
 */
export function createSelectState(
  partial: Partial<SelectComponentState> = {},
): SelectComponentState {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    isInvalid: false,
    isRequired: false,
    isReadonly: false,
    isOpen: false,
    searchQuery: '',
    highlightedIndex: -1,
    variant: 'primary',
    size: 'md',
    selectState: 'default',
    ...partial,
  };
}

/**
 * Group options by group property
 */
export function groupOptions<T = any>(options: SelectOption<T>[]): SelectOptionGroup<T>[] {
  const grouped = new Map<string, SelectOption<T>[]>();
  const ungrouped: SelectOption<T>[] = [];

  // Separate grouped and ungrouped options
  options.forEach(option => {
    if (option.group) {
      if (!grouped.has(option.group)) {
        grouped.set(option.group, []);
      }
      grouped.get(option.group)!.push(option);
    } else {
      ungrouped.push(option);
    }
  });

  const groups: SelectOptionGroup<T>[] = [];

  // Add ungrouped options first
  if (ungrouped.length > 0) {
    groups.push({
      id: 'ungrouped',
      label: '',
      options: ungrouped,
    });
  }

  // Add grouped options
  grouped.forEach((groupOptions, groupLabel) => {
    groups.push({
      id: groupLabel,
      label: groupLabel,
      options: groupOptions,
    });
  });

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

  const searchTerm = query.toLowerCase();
  return options.filter(option => {
    const label = option.label.toLowerCase();
    const description = option.description?.toLowerCase() || '';

    return label.includes(searchTerm) || description.includes(searchTerm);
  });
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
  let valid = true;
  let errorMessage = '';

  // Required validation
  if (required) {
    if (Array.isArray(value)) {
      valid = value.length > 0;
      errorMessage = valid ? '' : 'At least one option must be selected';
    } else {
      valid = value !== null && value !== undefined && value !== '';
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
 * Get select state from validation
 */
export function getSelectStateFromValidation(validation: SelectValidation): SelectState {
  return validation.valid ? 'default' : 'error';
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
 * Get display text for selection
 */
export function getSelectionDisplayText<T = any>(
  options: SelectOption<T>[],
  values: T | T[],
  placeholder: string = 'Select...',
  maxDisplayItems: number = 3,
): string {
  const selectedOptions = getSelectedOptions(options, values);

  if (selectedOptions.length === 0) {
    return placeholder;
  }

  if (selectedOptions.length === 1) {
    return selectedOptions[0].label;
  }

  if (selectedOptions.length <= maxDisplayItems) {
    return selectedOptions.map(option => option.label).join(', ');
  }

  const displayed = selectedOptions.slice(0, maxDisplayItems).map(option => option.label);
  const remaining = selectedOptions.length - maxDisplayItems;

  return `${displayed.join(', ')} +${remaining} more`;
}

/**
 * Get select ARIA attributes
 */
export function getSelectAriaAttributes(
  validation: SelectValidation,
  isOpen: boolean,
  describedBy: string[] = [],
): Record<string, string> {
  const config: AccessibilityConfig = {
    ariaInvalid: !validation.valid,
    ariaExpanded: isOpen,
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

  // Add select-specific attributes
  attributes['aria-haspopup'] = 'listbox';

  return attributes;
}

/**
 * Get select CSS classes
 */
export function getSelectClasses(config: SelectConfig, state: SelectComponentState): string[] {
  const sizeConfig = getSizeConfiguration(config.size);
  const variantConfig = SELECT_VARIANTS[config.variant];

  const classes = ['ds-select', sizeConfig.className, variantConfig.className];

  if (state.isDisabled) classes.push('ds-select--disabled');
  if (state.isOpen) classes.push('ds-select--open');
  if (state.isFocused) classes.push('ds-select--focused');
  if (state.isHovered) classes.push('ds-select--hovered');
  if (state.isInvalid) classes.push('ds-select--invalid');
  if (state.isLoading) classes.push('ds-select--loading');
  if (config.multiple) classes.push('ds-select--multiple');
  if (config.searchable) classes.push('ds-select--searchable');

  return classes;
}

/**
 * Generate unique select ID
 */
export function generateSelectId(): string {
  return generateComponentId('ds-select');
}

/**
 * Check if a string is a valid select variant
 */
export function isValidSelectVariant(variant: string): variant is SelectVariant {
  return Object.keys(SELECT_VARIANTS).includes(variant);
}
