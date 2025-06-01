// =============================================================================
// Form Field Component Models
// =============================================================================
// Type definitions and interfaces for the Form Field component
// Wrapper component for form controls with labeling, validation, and layout

// =============================================================================
// CORE FORM FIELD INTERFACES
// =============================================================================

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  /** Form field variant */
  variant: FormFieldVariant;

  /** Form field size */
  size: FormFieldSize;

  /** Layout orientation */
  layout: FormFieldLayout;

  /** Whether to show validation messages */
  showValidation: boolean;

  /** Whether to show required indicator */
  showRequired: boolean;

  /** Position of the label */
  labelPosition: FormFieldLabelPosition;
}

/**
 * Form field validation state
 */
export interface FormFieldValidation {
  /** Whether field is valid */
  valid: boolean;

  /** Validation error messages */
  errors: string[];

  /** Warning messages */
  warnings: string[];

  /** Success message */
  successMessage?: string;

  /** Whether field has been touched */
  touched: boolean;

  /** Whether field is dirty (value changed) */
  dirty: boolean;
}

/**
 * Form field state information
 */
export interface FormFieldState {
  /** Whether field is disabled */
  disabled: boolean;

  /** Whether field is readonly */
  readonly: boolean;

  /** Whether field is loading */
  loading: boolean;

  /** Whether field is focused */
  focused: boolean;

  /** Current validation state */
  validation: FormFieldValidation;
}

/**
 * Form field hint configuration
 */
export interface FormFieldHint {
  /** Hint text */
  text: string;

  /** Hint type */
  type: FormFieldHintType;

  /** Whether hint is always visible */
  persistent: boolean;

  /** Custom icon for hint */
  icon?: string;
}

// =============================================================================
// FORM FIELD TYPES & VARIANTS
// =============================================================================

/**
 * Form field variants
 */
export type FormFieldVariant = 'default' | 'outlined' | 'filled';

/**
 * Form field size variants
 */
export type FormFieldSize = 'sm' | 'md' | 'lg';

/**
 * Form field layout options
 */
export type FormFieldLayout = 'vertical' | 'horizontal' | 'inline';

/**
 * Form field label positions
 */
export type FormFieldLabelPosition = 'top' | 'left' | 'inside' | 'floating';

/**
 * Form field validation states
 */
export type FormFieldValidationState = 'valid' | 'invalid' | 'warning' | 'pending';

/**
 * Form field hint types
 */
export type FormFieldHintType = 'info' | 'success' | 'warning' | 'error';

// =============================================================================
// FORM FIELD EVENTS
// =============================================================================

/**
 * Form field state change event
 */
export interface FormFieldStateChangeEvent {
  /** Field identifier */
  fieldId: string;

  /** New state */
  state: FormFieldState;

  /** Previous state */
  previousState: FormFieldState;

  /** Event type */
  type: 'validation' | 'focus' | 'blur' | 'disabled' | 'readonly';
}

/**
 * Form field validation event
 */
export interface FormFieldValidationEvent {
  /** Field identifier */
  fieldId: string;

  /** Validation result */
  validation: FormFieldValidation;

  /** Field value */
  value: any;

  /** Original validation event */
  originalEvent?: Event;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default form field configuration
 */
export const DEFAULT_FORM_FIELD_CONFIG: FormFieldConfig = {
  variant: 'default',
  size: 'md',
  layout: 'vertical',
  showValidation: true,
  showRequired: true,
  labelPosition: 'top',
};

/**
 * Form field size configurations
 */
export const FORM_FIELD_SIZE_CONFIG = {
  sm: {
    labelSize: '14px',
    spacing: '8px',
    hintSize: '12px',
  },
  md: {
    labelSize: '16px',
    spacing: '12px',
    hintSize: '14px',
  },
  lg: {
    labelSize: '18px',
    spacing: '16px',
    hintSize: '16px',
  },
} as const;

/**
 * Default validation state
 */
export const DEFAULT_VALIDATION_STATE: FormFieldValidation = {
  valid: true,
  errors: [],
  warnings: [],
  touched: false,
  dirty: false,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create form field configuration with defaults
 */
export function createFormFieldConfig(partial: Partial<FormFieldConfig> = {}): FormFieldConfig {
  return {
    ...DEFAULT_FORM_FIELD_CONFIG,
    ...partial,
  };
}

/**
 * Create form field validation state
 */
export function createFormFieldValidation(
  partial: Partial<FormFieldValidation> = {},
): FormFieldValidation {
  return {
    ...DEFAULT_VALIDATION_STATE,
    ...partial,
  };
}

/**
 * Create form field hint
 */
export function createFormFieldHint(
  text: string,
  type: FormFieldHintType = 'info',
  options: Partial<FormFieldHint> = {},
): FormFieldHint {
  return {
    text,
    type,
    persistent: false,
    ...options,
  };
}

/**
 * Get validation state from errors and warnings
 */
export function getValidationState(validation: FormFieldValidation): FormFieldValidationState {
  if (validation.errors.length > 0) return 'invalid';
  if (validation.warnings.length > 0) return 'warning';
  if (validation.valid && validation.touched) return 'valid';
  return 'pending';
}

/**
 * Check if form field should show validation
 */
export function shouldShowValidation(
  validation: FormFieldValidation,
  showValidation: boolean,
): boolean {
  return showValidation && (validation.touched || validation.dirty);
}

/**
 * Get primary validation message
 */
export function getPrimaryValidationMessage(validation: FormFieldValidation): string | null {
  if (validation.errors.length > 0) return validation.errors[0];
  if (validation.warnings.length > 0) return validation.warnings[0];
  if (validation.successMessage) return validation.successMessage;
  return null;
}

/**
 * Check if form field has any validation messages
 */
export function hasValidationMessages(validation: FormFieldValidation): boolean {
  return (
    validation.errors.length > 0 || validation.warnings.length > 0 || !!validation.successMessage
  );
}

/**
 * Get form field CSS classes
 */
export function getFormFieldClasses(config: FormFieldConfig, state: FormFieldState): string[] {
  const classes = ['ds-form-field'];

  // Variant classes
  classes.push(`ds-form-field--${config.variant}`);
  classes.push(`ds-form-field--${config.size}`);
  classes.push(`ds-form-field--${config.layout}`);
  classes.push(`ds-form-field--label-${config.labelPosition}`);

  // State classes
  if (state.disabled) classes.push('ds-form-field--disabled');
  if (state.readonly) classes.push('ds-form-field--readonly');
  if (state.loading) classes.push('ds-form-field--loading');
  if (state.focused) classes.push('ds-form-field--focused');

  // Validation classes
  const validationState = getValidationState(state.validation);
  classes.push(`ds-form-field--${validationState}`);

  return classes;
}

/**
 * Get accessibility attributes for form field
 */
export function getFormFieldAriaAttributes(
  fieldId: string,
  validation: FormFieldValidation,
  required: boolean = false,
  describedBy: string[] = [],
): Record<string, string> {
  const attrs: Record<string, string> = {};

  if (required) {
    attrs['aria-required'] = 'true';
  }

  if (!validation.valid) {
    attrs['aria-invalid'] = 'true';
  }

  if (describedBy.length > 0) {
    attrs['aria-describedby'] = describedBy.join(' ');
  }

  return attrs;
}

/**
 * Generate unique form field ID
 */
export function generateFormFieldId(prefix: string = 'form-field'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate required field
 */
export function validateRequired(value: any, required: boolean): string[] {
  const errors: string[] = [];

  if (required && (value === null || value === undefined || value === '')) {
    errors.push('This field is required');
  }

  return errors;
}

/**
 * Validate field length
 */
export function validateLength(value: string, minLength?: number, maxLength?: number): string[] {
  const errors: string[] = [];

  if (typeof value === 'string') {
    if (minLength !== undefined && value.length < minLength) {
      errors.push(`Minimum ${minLength} characters required`);
    }

    if (maxLength !== undefined && value.length > maxLength) {
      errors.push(`Maximum ${maxLength} characters allowed`);
    }
  }

  return errors;
}

/**
 * Validate email format
 */
export function validateEmail(value: string): string[] {
  const errors: string[] = [];

  if (value && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push('Please enter a valid email address');
    }
  }

  return errors;
}

/**
 * Validate URL format
 */
export function validateUrl(value: string): string[] {
  const errors: string[] = [];

  if (value && typeof value === 'string') {
    try {
      new URL(value);
    } catch {
      errors.push('Please enter a valid URL');
    }
  }

  return errors;
}

/**
 * Validate numeric range
 */
export function validateRange(value: number, min?: number, max?: number): string[] {
  const errors: string[] = [];

  if (typeof value === 'number') {
    if (min !== undefined && value < min) {
      errors.push(`Value must be at least ${min}`);
    }

    if (max !== undefined && value > max) {
      errors.push(`Value must be at most ${max}`);
    }
  }

  return errors;
}

/**
 * Validate pattern match
 */
export function validatePattern(value: string, pattern: RegExp, message: string): string[] {
  const errors: string[] = [];

  if (value && typeof value === 'string' && !pattern.test(value)) {
    errors.push(message);
  }

  return errors;
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(...validationResults: string[][]): FormFieldValidation {
  const allErrors = validationResults.flat();

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: [],
    touched: false,
    dirty: false,
  };
}

/**
 * Create validation function from rules
 */
export function createValidator(
  rules: Array<(value: any) => string[]>,
): (value: any) => FormFieldValidation {
  return (value: any) => {
    const results = rules.map(rule => rule(value));
    return combineValidationResults(...results);
  };
}

/**
 * Format validation messages for display
 */
export function formatValidationMessages(
  validation: FormFieldValidation,
  maxMessages: number = 3,
): string {
  const messages = [...validation.errors, ...validation.warnings];

  if (messages.length === 0) {
    return validation.successMessage || '';
  }

  if (messages.length <= maxMessages) {
    return messages.join('. ');
  }

  const displayed = messages.slice(0, maxMessages);
  const remaining = messages.length - maxMessages;

  return `${displayed.join('. ')}. And ${remaining} more issue${remaining > 1 ? 's' : ''}.`;
}
