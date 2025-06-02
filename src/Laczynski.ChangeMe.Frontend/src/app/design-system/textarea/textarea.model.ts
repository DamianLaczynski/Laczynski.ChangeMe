// =============================================================================
// Textarea Component Models
// =============================================================================
// TypeScript models and types for Textarea component

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
// TEXTAREA-SPECIFIC TYPES
// =============================================================================

/**
 * Textarea variants extending base component variants
 */
export type TextareaVariant =
  | Extract<ComponentVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>
  | 'default';

/**
 * Textarea resize options
 */
export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

/**
 * Textarea states
 */
export type TextareaState = 'default' | 'focus' | 'error' | 'disabled' | 'readonly';

// =============================================================================
// BASE INTERFACES
// =============================================================================

/**
 * Textarea configuration interface
 */
export interface TextareaConfig {
  /** Textarea size */
  size: ComponentSize;

  /** Textarea variant/style */
  variant: TextareaVariant;

  /** Whether textarea is disabled */
  disabled: boolean;

  /** Whether textarea is readonly */
  readonly: boolean;

  /** Whether textarea is required in forms */
  required: boolean;

  /** Label text */
  label?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Helper text displayed below textarea */
  helperText?: string;

  /** Aria label for accessibility */
  ariaLabel?: string;

  /** Number of visible rows */
  rows?: number;

  /** Number of visible columns */
  cols?: number;

  /** Minimum number of rows */
  minRows?: number;

  /** Maximum number of rows */
  maxRows?: number;

  /** Maximum character length */
  maxLength?: number;

  /** Whether to show character counter */
  showCounter?: boolean;

  /** Whether textarea can be resized */
  resizable?: boolean;

  /** Resize direction */
  resize?: TextareaResize;

  /** Whether textarea should auto-resize */
  autoResize?: boolean;

  /** Animation duration in milliseconds */
  animationDuration: number;

  /** Custom CSS classes */
  className?: string;
}

/**
 * Textarea state extending form component state
 */
export interface TextareaComponentState extends FormComponentState {
  /** Current text value */
  currentValue: string;

  /** Character count */
  characterCount: number;

  /** Line count */
  lineCount: number;

  /** Whether near max length */
  isNearMaxLength: boolean;

  /** Current textarea visual state */
  textareaState: TextareaState;
}

// =============================================================================
// EVENT INTERFACES
// =============================================================================

/**
 * Textarea change event
 */
export interface TextareaChangeEvent extends ComponentChangeEvent<string, HTMLTextAreaElement> {
  /** Character count */
  characterCount: number;

  /** Line count */
  lineCount: number;
}

/**
 * Textarea focus event
 */
export interface TextareaFocusEvent extends ComponentFocusEvent<HTMLTextAreaElement> {
  /** Focus direction */
  direction: 'in' | 'out';
}

/**
 * Textarea keyboard event
 */
export interface TextareaKeyboardEvent {
  /** Current text value */
  value: string;

  /** Character count */
  characterCount: number;

  /** Line count */
  lineCount: number;

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
  element: HTMLTextAreaElement;
}

/**
 * Textarea resize event
 */
export interface TextareaResizeEvent {
  /** New width */
  width: number;

  /** New height */
  height: number;

  /** Resize type */
  type: 'manual' | 'auto';

  /** Original event */
  originalEvent?: Event;

  /** Event timestamp */
  timestamp: number;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Textarea validation result
 */
export interface TextareaValidation extends ValidationResult {
  /** Custom validation rules */
  customRules?: TextareaValidationRule[];
}

/**
 * Custom validation rule for textarea
 */
export interface TextareaValidationRule extends ValidationRule<string> {
  /** Validation function specific to textarea */
  validator: (value: string) => boolean | Promise<boolean>;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default textarea configuration
 */
export const DEFAULT_TEXTAREA_CONFIG: TextareaConfig = {
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
  rows: 4,
  resizable: true,
  resize: 'vertical',
  autoResize: false,
  showCounter: false,
  animationDuration: 200,
};

/**
 * Textarea size configurations extending base size config
 */
export const TEXTAREA_SIZE_CONFIG = {
  sm: {
    ...getSizeConfiguration('sm'),
    minHeight: '80px',
    fontSize: '14px',
    lineHeight: '20px',
  },
  md: {
    ...getSizeConfiguration('md'),
    minHeight: '96px',
    fontSize: '16px',
    lineHeight: '24px',
  },
  lg: {
    ...getSizeConfiguration('lg'),
    minHeight: '112px',
    fontSize: '18px',
    lineHeight: '28px',
  },
} as const;

/**
 * Textarea variant definitions
 */
export const TEXTAREA_VARIANTS: Record<TextareaVariant, { className: string; label: string }> = {
  default: {
    className: 'ds-textarea--default',
    label: 'Default',
  },
  primary: {
    className: 'ds-textarea--primary',
    label: 'Primary',
  },
  secondary: {
    className: 'ds-textarea--secondary',
    label: 'Secondary',
  },
  success: {
    className: 'ds-textarea--success',
    label: 'Success',
  },
  warning: {
    className: 'ds-textarea--warning',
    label: 'Warning',
  },
  danger: {
    className: 'ds-textarea--danger',
    label: 'Danger',
  },
};

/**
 * Textarea resize options
 */
export const TEXTAREA_RESIZE_OPTIONS: Record<TextareaResize, { className: string; label: string }> =
  {
    none: {
      className: 'ds-textarea--resize-none',
      label: 'No Resize',
    },
    both: {
      className: 'ds-textarea--resize-both',
      label: 'Both Directions',
    },
    horizontal: {
      className: 'ds-textarea--resize-horizontal',
      label: 'Horizontal Only',
    },
    vertical: {
      className: 'ds-textarea--resize-vertical',
      label: 'Vertical Only',
    },
  };

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create textarea configuration with defaults
 */
export function createTextareaConfig(overrides?: Partial<TextareaConfig>): TextareaConfig {
  return {
    ...DEFAULT_TEXTAREA_CONFIG,
    ...overrides,
  };
}

/**
 * Create textarea component state
 */
export function createTextareaState(
  partial: Partial<TextareaComponentState> = {},
): TextareaComponentState {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    isInvalid: false,
    isRequired: false,
    isReadonly: false,
    currentValue: '',
    characterCount: 0,
    lineCount: 1,
    isNearMaxLength: false,
    variant: 'primary',
    size: 'md',
    textareaState: 'default',
    ...partial,
  };
}

/**
 * Create textarea change event
 */
export function createTextareaChangeEvent(
  value: string,
  originalEvent: Event,
  element: HTMLTextAreaElement,
): TextareaChangeEvent {
  return {
    event: originalEvent,
    element,
    timestamp: Date.now(),
    value,
    previousValue: undefined, // Will be set by component
    characterCount: countCharacters(value),
    lineCount: countLines(value),
  };
}

/**
 * Create textarea focus event
 */
export function createTextareaFocusEvent(
  direction: 'in' | 'out',
  originalEvent: FocusEvent,
  element: HTMLTextAreaElement,
): TextareaFocusEvent {
  return {
    event: originalEvent,
    element,
    timestamp: Date.now(),
    direction,
  };
}

/**
 * Create textarea keyboard event
 */
export function createTextareaKeyboardEvent(
  value: string,
  originalEvent: KeyboardEvent,
  element: HTMLTextAreaElement,
): TextareaKeyboardEvent {
  return {
    value,
    characterCount: countCharacters(value),
    lineCount: countLines(value),
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

/**
 * Create textarea resize event
 */
export function createTextareaResizeEvent(
  width: number,
  height: number,
  type: 'manual' | 'auto',
  originalEvent?: Event,
): TextareaResizeEvent {
  return {
    width,
    height,
    type,
    originalEvent,
    timestamp: Date.now(),
  };
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate textarea value
 */
export function validateTextareaValue(
  value: string,
  required: boolean = false,
  maxLength?: number,
  customRules: TextareaValidationRule[] = [],
): TextareaValidation {
  let valid = true;
  let errorMessage = '';

  // Required validation
  if (required && !value.trim()) {
    valid = false;
    errorMessage = 'This field is required';
  }

  // Max length validation
  if (valid && maxLength !== undefined && value.length > maxLength) {
    valid = false;
    errorMessage = `Text must be ${maxLength} characters or less`;
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
export function isValidTextareaSize(size: string): size is ComponentSize {
  return isValidComponentSize(size);
}

/**
 * Check if variant is valid
 */
export function isValidTextareaVariant(variant: string): variant is TextareaVariant {
  return Object.keys(TEXTAREA_VARIANTS).includes(variant);
}

/**
 * Check if resize option is valid
 */
export function isValidTextareaResize(resize: string): resize is TextareaResize {
  return Object.keys(TEXTAREA_RESIZE_OPTIONS).includes(resize);
}

/**
 * Get textarea size label
 */
export function getTextareaSizeLabel(size: ComponentSize): string {
  const sizeLabels = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  };
  return sizeLabels[size];
}

/**
 * Get textarea variant label
 */
export function getTextareaVariantLabel(variant: TextareaVariant): string {
  return TEXTAREA_VARIANTS[variant].label;
}

/**
 * Get textarea resize label
 */
export function getTextareaResizeLabel(resize: TextareaResize): string {
  return TEXTAREA_RESIZE_OPTIONS[resize].label;
}

/**
 * Count lines in text
 */
export function countLines(text: string): number {
  if (!text) return 1;
  return (text.match(/\n/g) || []).length + 1;
}

/**
 * Count characters in text
 */
export function countCharacters(text: string): number {
  return text ? text.length : 0;
}

/**
 * Check if text is within max length
 */
export function isWithinMaxLength(text: string, maxLength?: number): boolean {
  if (!maxLength) return true;
  return countCharacters(text) <= maxLength;
}

/**
 * Check if near max length (80% threshold)
 */
export function isNearMaxLength(
  text: string,
  maxLength?: number,
  threshold: number = 0.8,
): boolean {
  if (!maxLength) return false;
  const currentLength = countCharacters(text);
  return currentLength >= maxLength * threshold;
}

/**
 * Get textarea state from validation and other props
 */
export function getTextareaState(
  disabled: boolean,
  readonly: boolean,
  focused: boolean,
  validation: TextareaValidation,
): TextareaState {
  if (disabled) return 'disabled';
  if (readonly) return 'readonly';
  if (!validation.valid) return 'error';
  if (focused) return 'focus';
  return 'default';
}

/**
 * Get textarea ARIA attributes
 */
export function getTextareaAriaAttributes(
  validation: TextareaValidation,
  describedBy: string[] = [],
  maxLength?: number,
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

  // Add textarea-specific attributes
  if (maxLength !== undefined) {
    attributes['maxlength'] = maxLength.toString();
  }

  return attributes;
}

/**
 * Get textarea CSS classes
 */
export function getTextareaClasses(
  config: TextareaConfig,
  state: TextareaComponentState,
): string[] {
  const sizeConfig = getSizeConfiguration(config.size);
  const variantConfig = TEXTAREA_VARIANTS[config.variant];
  const resizeConfig = TEXTAREA_RESIZE_OPTIONS[config.resize || 'vertical'];

  const classes = [
    'ds-textarea',
    sizeConfig.className,
    variantConfig.className,
    resizeConfig.className,
  ];

  if (state.isDisabled) classes.push('ds-textarea--disabled');
  if (state.isReadonly) classes.push('ds-textarea--readonly');
  if (state.isFocused) classes.push('ds-textarea--focused');
  if (state.isHovered) classes.push('ds-textarea--hovered');
  if (state.isInvalid) classes.push('ds-textarea--invalid');
  if (state.isNearMaxLength) classes.push('ds-textarea--near-max');
  if (config.autoResize) classes.push('ds-textarea--auto-resize');
  if (config.showCounter) classes.push('ds-textarea--with-counter');

  return classes;
}

/**
 * Generate unique textarea ID
 */
export function generateTextareaId(): string {
  return generateComponentId('ds-textarea');
}
