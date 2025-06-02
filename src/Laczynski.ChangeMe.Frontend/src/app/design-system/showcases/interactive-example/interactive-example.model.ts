// =============================================================================
// Interactive Example Component Models
// =============================================================================
// Type definitions for the Interactive Example component
// Used in showcase components for consistent interactive controls

// =============================================================================
// CONTROL TYPES
// =============================================================================

export type InteractiveControlType =
  | 'select'
  | 'text'
  | 'number'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'color'
  | 'range';

// =============================================================================
// CONTROL CONFIGURATIONS
// =============================================================================

/**
 * Base configuration for all control types
 */
export interface InteractiveControlBase {
  /** Unique identifier for the control */
  id: string;

  /** Control type */
  type: InteractiveControlType;

  /** Display label for the control */
  label: string;

  /** Property name in the configuration object */
  property: string;

  /** Whether the control is disabled */
  disabled?: boolean;

  /** Help text for the control */
  helpText?: string;

  /** CSS class for styling */
  className?: string;
}

/**
 * Select control configuration
 */
export interface InteractiveSelectControl extends InteractiveControlBase {
  type: 'select';
  options: Array<{
    value: any;
    label: string;
    disabled?: boolean;
  }>;
}

/**
 * Text input control configuration
 */
export interface InteractiveTextControl extends InteractiveControlBase {
  type: 'text';
  placeholder?: string;
  maxLength?: number;
}

/**
 * Number input control configuration
 */
export interface InteractiveNumberControl extends InteractiveControlBase {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

/**
 * Checkbox control configuration
 */
export interface InteractiveCheckboxControl extends InteractiveControlBase {
  type: 'checkbox';
}

/**
 * Radio control configuration
 */
export interface InteractiveRadioControl extends InteractiveControlBase {
  type: 'radio';
  options: Array<{
    value: any;
    label: string;
    disabled?: boolean;
  }>;
}

/**
 * Textarea control configuration
 */
export interface InteractiveTextareaControl extends InteractiveControlBase {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

/**
 * Color picker control configuration
 */
export interface InteractiveColorControl extends InteractiveControlBase {
  type: 'color';
}

/**
 * Range slider control configuration
 */
export interface InteractiveRangeControl extends InteractiveControlBase {
  type: 'range';
  min: number;
  max: number;
  step?: number;
}

/**
 * Union type for all control configurations
 */
export type InteractiveControl =
  | InteractiveSelectControl
  | InteractiveTextControl
  | InteractiveNumberControl
  | InteractiveCheckboxControl
  | InteractiveRadioControl
  | InteractiveTextareaControl
  | InteractiveColorControl
  | InteractiveRangeControl;

// =============================================================================
// INTERACTIVE EXAMPLE CONFIGURATION
// =============================================================================

/**
 * Configuration for the interactive example component
 */
export interface InteractiveExampleConfig {
  /** Title for the interactive example section */
  title?: string;

  /** Description text for the section */
  description?: string;

  /** Array of control configurations */
  controls: InteractiveControl[];

  /** Whether to show the configuration output */
  showOutput?: boolean;

  /** Custom CSS classes for the component */
  className?: string;
}

/**
 * Event emitted when configuration changes
 */
export interface InteractiveConfigChangeEvent<T = any> {
  /** The updated configuration object */
  config: T;

  /** The specific property that changed */
  property: string;

  /** The new value for the property */
  value: any;

  /** The previous value for the property */
  previousValue: any;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Create a select control configuration
 */
export function createSelectControl(
  id: string,
  label: string,
  property: string,
  options: Array<{ value: any; label: string; disabled?: boolean }>,
  config?: Partial<
    Omit<InteractiveSelectControl, 'id' | 'type' | 'label' | 'property' | 'options'>
  >,
): InteractiveSelectControl {
  return {
    id,
    type: 'select',
    label,
    property,
    options,
    ...config,
  };
}

/**
 * Create a text control configuration
 */
export function createTextControl(
  id: string,
  label: string,
  property: string,
  config?: Partial<Omit<InteractiveTextControl, 'id' | 'type' | 'label' | 'property'>>,
): InteractiveTextControl {
  return {
    id,
    type: 'text',
    label,
    property,
    ...config,
  };
}

/**
 * Create a checkbox control configuration
 */
export function createCheckboxControl(
  id: string,
  label: string,
  property: string,
  config?: Partial<Omit<InteractiveCheckboxControl, 'id' | 'type' | 'label' | 'property'>>,
): InteractiveCheckboxControl {
  return {
    id,
    type: 'checkbox',
    label,
    property,
    ...config,
  };
}

/**
 * Create a number control configuration
 */
export function createNumberControl(
  id: string,
  label: string,
  property: string,
  config?: Partial<Omit<InteractiveNumberControl, 'id' | 'type' | 'label' | 'property'>>,
): InteractiveNumberControl {
  return {
    id,
    type: 'number',
    label,
    property,
    ...config,
  };
}

/**
 * Helper function to create common variant control
 */
export function createVariantControl<T extends string>(
  variants: Array<{ value: T; label: string }>,
  property: string = 'variant',
): InteractiveSelectControl {
  return createSelectControl('variant-control', 'Variant', property, variants);
}

/**
 * Helper function to create common size control
 */
export function createSizeControl<T extends string>(
  sizes: Array<{ value: T; label: string }>,
  property: string = 'size',
): InteractiveSelectControl {
  return createSelectControl('size-control', 'Size', property, sizes);
}

/**
 * Helper function to create common disabled control
 */
export function createDisabledControl(property: string = 'disabled'): InteractiveCheckboxControl {
  return createCheckboxControl('disabled-control', 'Disabled', property);
}

/**
 * Helper function to create common required control
 */
export function createRequiredControl(property: string = 'required'): InteractiveCheckboxControl {
  return createCheckboxControl('required-control', 'Required', property);
}
