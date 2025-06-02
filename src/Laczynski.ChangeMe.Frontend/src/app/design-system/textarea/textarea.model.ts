// =============================================================================
// Textarea Component Models
// =============================================================================
// TypeScript models and types for Textarea component

// =============================================================================
// BASE INTERFACES
// =============================================================================

/**
 * Textarea configuration interface
 */
export interface TextareaConfig {
  /** Textarea size */
  size: TextareaSize;

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

  /** Custom CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT TYPES
// =============================================================================

/** Available textarea sizes */
export type TextareaSize = 'sm' | 'md' | 'lg';

/** Available textarea variants */
export type TextareaVariant = 'default' | 'filled' | 'outlined';

/** Textarea resize options */
export type TextareaResize = 'none' | 'both' | 'horizontal' | 'vertical';

/** Textarea states */
export type TextareaState = 'default' | 'focus' | 'error' | 'disabled' | 'readonly';

// =============================================================================
// EVENT INTERFACES
// =============================================================================

/**
 * Textarea change event
 */
export interface TextareaChangeEvent {
  /** New text value */
  value: string;

  /** Character count */
  characterCount: number;

  /** Line count */
  lineCount: number;

  /** Original DOM event */
  originalEvent: Event;

  /** Event timestamp */
  timestamp: number;
}

/**
 * Textarea focus event
 */
export interface TextareaFocusEvent {
  /** Current text value */
  value: string;

  /** Focus type */
  type: 'focus' | 'blur';

  /** Original DOM event */
  originalEvent: FocusEvent;

  /** Event timestamp */
  timestamp: number;
}

/**
 * Textarea keyboard event
 */
export interface TextareaKeyboardEvent {
  /** Current text value */
  value: string;

  /** Key that was pressed */
  key: string;

  /** Key code */
  keyCode: number;

  /** Whether key combination was used */
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;

  /** Original DOM event */
  originalEvent: KeyboardEvent;

  /** Event timestamp */
  timestamp: number;
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

  /** Event timestamp */
  timestamp: number;
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create default textarea configuration
 */
export const createTextareaConfig = (overrides?: Partial<TextareaConfig>): TextareaConfig => ({
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
  ...overrides,
});

/**
 * Create textarea change event
 */
export const createTextareaChangeEvent = (
  value: string,
  originalEvent: Event,
): TextareaChangeEvent => ({
  value,
  characterCount: value.length,
  lineCount: value.split('\n').length,
  originalEvent,
  timestamp: Date.now(),
});

/**
 * Create textarea focus event
 */
export const createTextareaFocusEvent = (
  value: string,
  type: 'focus' | 'blur',
  originalEvent: FocusEvent,
): TextareaFocusEvent => ({
  value,
  type,
  originalEvent,
  timestamp: Date.now(),
});

/**
 * Create textarea keyboard event
 */
export const createTextareaKeyboardEvent = (
  value: string,
  originalEvent: KeyboardEvent,
): TextareaKeyboardEvent => ({
  value,
  key: originalEvent.key,
  keyCode: originalEvent.keyCode,
  ctrlKey: originalEvent.ctrlKey,
  shiftKey: originalEvent.shiftKey,
  altKey: originalEvent.altKey,
  originalEvent,
  timestamp: Date.now(),
});

/**
 * Create textarea resize event
 */
export const createTextareaResizeEvent = (
  width: number,
  height: number,
  type: 'manual' | 'auto',
): TextareaResizeEvent => ({
  width,
  height,
  type,
  timestamp: Date.now(),
});

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Check if textarea size is valid
 */
export const isValidTextareaSize = (size: string): size is TextareaSize => {
  return ['sm', 'md', 'lg'].includes(size);
};

/**
 * Check if textarea variant is valid
 */
export const isValidTextareaVariant = (variant: string): variant is TextareaVariant => {
  return ['default', 'filled', 'outlined'].includes(variant);
};

/**
 * Check if resize option is valid
 */
export const isValidTextareaResize = (resize: string): resize is TextareaResize => {
  return ['none', 'both', 'horizontal', 'vertical'].includes(resize);
};

/**
 * Get textarea size label for display
 */
export const getTextareaSizeLabel = (size: TextareaSize): string => {
  const labels: Record<TextareaSize, string> = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  };
  return labels[size];
};

/**
 * Get textarea variant label for display
 */
export const getTextareaVariantLabel = (variant: TextareaVariant): string => {
  const labels: Record<TextareaVariant, string> = {
    default: 'Default',
    filled: 'Filled',
    outlined: 'Outlined',
  };
  return labels[variant];
};

/**
 * Get resize option label for display
 */
export const getTextareaResizeLabel = (resize: TextareaResize): string => {
  const labels: Record<TextareaResize, string> = {
    none: 'None',
    both: 'Both',
    horizontal: 'Horizontal',
    vertical: 'Vertical',
  };
  return labels[resize];
};

/**
 * Count lines in text
 */
export const countLines = (text: string): number => {
  return text ? text.split('\n').length : 1;
};

/**
 * Count characters in text
 */
export const countCharacters = (text: string): number => {
  return text ? text.length : 0;
};

/**
 * Validate max length
 */
export const isWithinMaxLength = (text: string, maxLength?: number): boolean => {
  if (!maxLength) return true;
  return text.length <= maxLength;
};
