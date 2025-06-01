// =============================================================================
// Input Component Models
// =============================================================================
// Type definitions and interfaces for the Input component
// Supports text, email, password, number, and search input types

// =============================================================================
// CORE INPUT INTERFACES
// =============================================================================

/**
 * Input component configuration
 */
export interface InputConfig {
  /** Input type */
  type: InputType;

  /** Input size variant */
  size: InputSize;

  /** Input state */
  state: InputState;

  /** Whether input has icon */
  hasIcon: boolean;

  /** Icon position */
  iconPosition: InputIconPosition;

  /** Whether input is clearable */
  clearable: boolean;

  /** Whether to show character counter */
  showCounter: boolean;
}

/**
 * Input validation state
 */
export interface InputValidation {
  /** Whether input is valid */
  valid: boolean;

  /** Validation error message */
  errorMessage?: string;

  /** Validation success message */
  successMessage?: string;

  /** Custom validation rules */
  customRules?: InputValidationRule[];
}

/**
 * Custom validation rule
 */
export interface InputValidationRule {
  /** Rule name */
  name: string;

  /** Validation function */
  validator: (value: string) => boolean;

  /** Error message if validation fails */
  errorMessage: string;
}

// =============================================================================
// INPUT TYPES & VARIANTS
// =============================================================================

/**
 * Supported input types
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

/**
 * Input size variants
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input states
 */
export type InputState = 'default' | 'error' | 'success' | 'warning' | 'disabled';

/**
 * Icon position in input
 */
export type InputIconPosition = 'start' | 'end';

// =============================================================================
// INPUT EVENTS
// =============================================================================

/**
 * Input value change event
 */
export interface InputChangeEvent {
  /** New input value */
  value: string;

  /** Input element reference */
  element: HTMLInputElement;

  /** Original DOM event */
  originalEvent: Event;

  /** Input validity state */
  valid: boolean;
}

/**
 * Input focus event
 */
export interface InputFocusEvent {
  /** Input element reference */
  element: HTMLInputElement;

  /** Focus direction */
  direction: 'in' | 'out';

  /** Original DOM event */
  originalEvent: FocusEvent;
}

/**
 * Input clear event
 */
export interface InputClearEvent {
  /** Input element reference */
  element: HTMLInputElement;

  /** Previous value before clear */
  previousValue: string;
}

/**
 * Input enter key event
 */
export interface InputEnterEvent {
  /** Current input value */
  value: string;

  /** Input element reference */
  element: HTMLInputElement;

  /** Original keyboard event */
  originalEvent: KeyboardEvent;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default input configuration
 */
export const DEFAULT_INPUT_CONFIG: InputConfig = {
  type: 'text',
  size: 'md',
  state: 'default',
  hasIcon: false,
  iconPosition: 'start',
  clearable: false,
  showCounter: false,
};

/**
 * Input size configurations with dimensions
 */
export const INPUT_SIZE_CONFIG = {
  sm: {
    height: '32px',
    fontSize: '14px',
    padding: '0 12px',
    iconSize: '16px',
  },
  md: {
    height: '40px',
    fontSize: '16px',
    padding: '0 16px',
    iconSize: '18px',
  },
  lg: {
    height: '48px',
    fontSize: '18px',
    padding: '0 20px',
    iconSize: '20px',
  },
} as const;

/**
 * Input type configurations
 */
export const INPUT_TYPE_CONFIG = {
  text: {
    autocomplete: 'off',
    inputmode: 'text',
  },
  email: {
    autocomplete: 'email',
    inputmode: 'email',
  },
  password: {
    autocomplete: 'current-password',
    inputmode: 'text',
  },
  number: {
    autocomplete: 'off',
    inputmode: 'numeric',
  },
  search: {
    autocomplete: 'off',
    inputmode: 'search',
  },
  tel: {
    autocomplete: 'tel',
    inputmode: 'tel',
  },
  url: {
    autocomplete: 'url',
    inputmode: 'url',
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create input configuration with defaults
 */
export function createInputConfig(partial: Partial<InputConfig> = {}): InputConfig {
  return {
    ...DEFAULT_INPUT_CONFIG,
    ...partial,
  };
}

/**
 * Validate input value
 */
export function validateInputValue(
  value: string,
  type: InputType,
  customRules: InputValidationRule[] = [],
): InputValidation {
  const validation: InputValidation = {
    valid: true,
  };

  // Built-in validation by type
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        validation.valid = false;
        validation.errorMessage = 'Please enter a valid email address';
      }
      break;

    case 'url':
      try {
        if (value) new URL(value);
      } catch {
        validation.valid = false;
        validation.errorMessage = 'Please enter a valid URL';
      }
      break;

    case 'tel':
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
        validation.valid = false;
        validation.errorMessage = 'Please enter a valid phone number';
      }
      break;
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
 * Get input state from validation
 */
export function getInputStateFromValidation(
  validation: InputValidation,
  hasValue: boolean,
): InputState {
  if (!validation.valid) return 'error';
  if (validation.successMessage) return 'success';
  return 'default';
}

/**
 * Format input value by type
 */
export function formatInputValue(value: string, type: InputType): string {
  switch (type) {
    case 'tel':
      // Basic phone number formatting (can be enhanced)
      return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    case 'number':
      return value.replace(/[^\d.-]/g, '');
    default:
      return value;
  }
}

/**
 * Check if input type supports clearing
 */
export function isInputClearable(type: InputType): boolean {
  return ['text', 'email', 'search', 'tel', 'url'].includes(type);
}

/**
 * Get input accessibility attributes
 */
export function getInputAriaAttributes(
  validation: InputValidation,
  describedBy: string[] = [],
): Record<string, string> {
  const attrs: Record<string, string> = {};

  if (!validation.valid) {
    attrs['aria-invalid'] = 'true';
  }

  if (describedBy.length > 0) {
    attrs['aria-describedby'] = describedBy.join(' ');
  }

  return attrs;
}
