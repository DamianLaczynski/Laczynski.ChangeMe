// =============================================================================
// Form Field Component - Public API
// =============================================================================
// Export all public APIs for the Form Field component

// Core component
export { FormFieldComponent } from './form-field.component';

// Showcase component
export { FormFieldShowcaseComponent } from './form-field-showcase.component';

// Models and interfaces
export type {
  // Core interfaces
  FormFieldConfig,
  FormFieldValidation,
  FormFieldState,
  FormFieldHint,
  FormFieldStateChangeEvent,
  FormFieldValidationEvent,

  // Types
  FormFieldVariant,
  FormFieldSize,
  FormFieldLayout,
  FormFieldLabelPosition,
  FormFieldValidationState,
  FormFieldHintType,
} from './form-field.model';

export {
  // Constants
  DEFAULT_FORM_FIELD_CONFIG,
  FORM_FIELD_SIZE_CONFIG,
  DEFAULT_VALIDATION_STATE,

  // Utility functions
  createFormFieldConfig,
  createFormFieldValidation,
  createFormFieldHint,
  getValidationState,
  shouldShowValidation,
  getPrimaryValidationMessage,
  hasValidationMessages,
  getFormFieldClasses,
  getFormFieldAriaAttributes,
  generateFormFieldId,

  // Validation functions
  validateRequired,
  validateLength,
  validateEmail,
  validateUrl,
  validateRange,
  validatePattern,
  combineValidationResults,
  createValidator,
  formatValidationMessages,
} from './form-field.model';
