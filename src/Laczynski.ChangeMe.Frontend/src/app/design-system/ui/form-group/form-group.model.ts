// =============================================================================
// Form Group Component Models
// =============================================================================
// Type definitions and interfaces for the Form Group component
// Logical grouping of related form fields with title, description, and layout

// =============================================================================
// CORE FORM GROUP INTERFACES
// =============================================================================

/**
 * Form group configuration
 */
export interface FormGroupConfig {
  /** Visual variant */
  variant: FormGroupVariant;

  /** Size of the form group */
  size: FormGroupSize;

  /** Layout orientation */
  layout: FormGroupLayout;

  /** Whether to show borders around the group */
  showBorder: boolean;

  /** Whether group is collapsible */
  collapsible: boolean;

  /** Whether group is collapsed (if collapsible) */
  collapsed: boolean;

  /** Spacing between form fields */
  spacing: FormGroupSpacing;
}

/**
 * Form group state information
 */
export interface FormGroupState {
  /** Whether group is disabled */
  disabled: boolean;

  /** Whether group is collapsed */
  collapsed: boolean;

  /** Whether group has validation errors */
  hasErrors: boolean;

  /** Number of fields in the group */
  fieldCount: number;

  /** Number of required fields */
  requiredFieldCount: number;

  /** Number of completed fields */
  completedFieldCount: number;
}

/**
 * Form group progress information
 */
export interface FormGroupProgress {
  /** Total number of fields */
  total: number;

  /** Number of completed fields */
  completed: number;

  /** Completion percentage (0-100) */
  percentage: number;

  /** Whether all required fields are completed */
  allRequiredCompleted: boolean;
}

/**
 * Form group action configuration
 */
export interface FormGroupAction {
  /** Action label */
  label: string;

  /** Action type */
  type: FormGroupActionType;

  /** Action icon */
  icon?: string;

  /** Whether action is disabled */
  disabled?: boolean;

  /** Action handler */
  handler: () => void;
}

// =============================================================================
// FORM GROUP TYPES & VARIANTS
// =============================================================================

/**
 * Form group variants
 */
export type FormGroupVariant = 'default' | 'outlined' | 'filled' | 'flat';

/**
 * Form group size variants
 */
export type FormGroupSize = 'sm' | 'md' | 'lg';

/**
 * Form group layout options
 */
export type FormGroupLayout = 'vertical' | 'horizontal' | 'grid';

/**
 * Form group spacing options
 */
export type FormGroupSpacing = 'tight' | 'normal' | 'loose';

/**
 * Form group action types
 */
export type FormGroupActionType = 'primary' | 'secondary' | 'ghost' | 'danger';

// =============================================================================
// FORM GROUP EVENTS
// =============================================================================

/**
 * Form group state change event
 */
export interface FormGroupStateChangeEvent {
  /** Group identifier */
  groupId: string;

  /** New state */
  state: FormGroupState;

  /** Previous state */
  previousState: FormGroupState;

  /** Event type */
  type: 'toggle' | 'validation' | 'field-change';
}

/**
 * Form group toggle event
 */
export interface FormGroupToggleEvent {
  /** Group identifier */
  groupId: string;

  /** Whether group is collapsed */
  collapsed: boolean;

  /** Original event */
  originalEvent: Event;
}

/**
 * Form group action event
 */
export interface FormGroupActionEvent {
  /** Group identifier */
  groupId: string;

  /** Action that was triggered */
  action: FormGroupAction;

  /** Original event */
  originalEvent: Event;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default form group configuration
 */
export const DEFAULT_FORM_GROUP_CONFIG: FormGroupConfig = {
  variant: 'default',
  size: 'md',
  layout: 'vertical',
  showBorder: true,
  collapsible: false,
  collapsed: false,
  spacing: 'normal',
};

/**
 * Form group size configurations
 */
export const FORM_GROUP_SIZE_CONFIG = {
  sm: {
    titleSize: '18px',
    padding: '12px',
    spacing: '8px',
    borderRadius: '4px',
  },
  md: {
    titleSize: '20px',
    padding: '16px',
    spacing: '12px',
    borderRadius: '6px',
  },
  lg: {
    titleSize: '24px',
    padding: '20px',
    spacing: '16px',
    borderRadius: '8px',
  },
} as const;

/**
 * Form group spacing configurations
 */
export const FORM_GROUP_SPACING_CONFIG = {
  tight: '8px',
  normal: '16px',
  loose: '24px',
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create form group configuration with defaults
 */
export function createFormGroupConfig(partial: Partial<FormGroupConfig> = {}): FormGroupConfig {
  return {
    ...DEFAULT_FORM_GROUP_CONFIG,
    ...partial,
  };
}

/**
 * Create form group state
 */
export function createFormGroupState(partial: Partial<FormGroupState> = {}): FormGroupState {
  return {
    disabled: false,
    collapsed: false,
    hasErrors: false,
    fieldCount: 0,
    requiredFieldCount: 0,
    completedFieldCount: 0,
    ...partial,
  };
}

/**
 * Create form group action
 */
export function createFormGroupAction(
  label: string,
  handler: () => void,
  options: Partial<FormGroupAction> = {},
): FormGroupAction {
  return {
    label,
    handler,
    type: 'secondary',
    ...options,
  };
}

/**
 * Calculate form group progress
 */
export function calculateFormGroupProgress(
  fieldCount: number,
  completedFieldCount: number,
  requiredFieldCount: number,
  completedRequiredFields: number,
): FormGroupProgress {
  return {
    total: fieldCount,
    completed: completedFieldCount,
    percentage: fieldCount > 0 ? Math.round((completedFieldCount / fieldCount) * 100) : 0,
    allRequiredCompleted: requiredFieldCount === completedRequiredFields,
  };
}

/**
 * Get form group CSS classes
 */
export function getFormGroupClasses(config: FormGroupConfig, state: FormGroupState): string[] {
  const classes = ['ds-form-group'];

  // Variant classes
  classes.push(`ds-form-group--${config.variant}`);
  classes.push(`ds-form-group--${config.size}`);
  classes.push(`ds-form-group--${config.layout}`);
  classes.push(`ds-form-group--spacing-${config.spacing}`);

  // Feature classes
  if (config.showBorder) classes.push('ds-form-group--bordered');
  if (config.collapsible) classes.push('ds-form-group--collapsible');

  // State classes
  if (state.disabled) classes.push('ds-form-group--disabled');
  if (state.collapsed) classes.push('ds-form-group--collapsed');
  if (state.hasErrors) classes.push('ds-form-group--has-errors');

  return classes;
}

/**
 * Get accessibility attributes for form group
 */
export function getFormGroupAriaAttributes(
  groupId: string,
  collapsible: boolean,
  collapsed: boolean,
  hasErrors: boolean,
): Record<string, string> {
  const attrs: Record<string, string> = {
    role: 'group',
  };

  if (collapsible) {
    attrs['aria-expanded'] = (!collapsed).toString();
  }

  if (hasErrors) {
    attrs['aria-invalid'] = 'true';
  }

  return attrs;
}

/**
 * Generate unique form group ID
 */
export function generateFormGroupId(prefix: string = 'form-group'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate form group configuration
 */
export function validateFormGroupConfig(config: FormGroupConfig): string[] {
  const errors: string[] = [];

  if (config.collapsible && config.layout === 'horizontal') {
    errors.push('Horizontal layout is not recommended for collapsible groups');
  }

  return errors;
}

/**
 * Get form group content visibility
 */
export function isFormGroupContentVisible(collapsible: boolean, collapsed: boolean): boolean {
  return !collapsible || !collapsed;
}

/**
 * Get form group title classes
 */
export function getFormGroupTitleClasses(
  collapsible: boolean,
  collapsed: boolean,
  hasErrors: boolean,
): string[] {
  const classes = ['ds-form-group__title'];

  if (collapsible) classes.push('ds-form-group__title--collapsible');
  if (hasErrors) classes.push('ds-form-group__title--has-errors');

  return classes;
}

/**
 * Get form group content classes
 */
export function getFormGroupContentClasses(layout: FormGroupLayout): string[] {
  const classes = ['ds-form-group__content'];

  classes.push(`ds-form-group__content--${layout}`);

  return classes;
}

/**
 * Format form group progress text
 */
export function formatFormGroupProgress(progress: FormGroupProgress): string {
  return `${progress.completed} of ${progress.total} fields completed (${progress.percentage}%)`;
}

/**
 * Check if form group should show progress
 */
export function shouldShowFormGroupProgress(fieldCount: number, showProgress: boolean): boolean {
  return showProgress && fieldCount > 0;
}

/**
 * Get form group toggle icon
 */
export function getFormGroupToggleIcon(collapsed: boolean): string {
  return collapsed ? '▶' : '▼';
}

/**
 * Get form group status icon
 */
export function getFormGroupStatusIcon(state: FormGroupState): string | null {
  if (state.hasErrors) return '⚠️';
  if (state.completedFieldCount === state.fieldCount && state.fieldCount > 0) return '✓';
  return null;
}

/**
 * Calculate form group validation summary
 */
export function getFormGroupValidationSummary(
  fieldErrors: number,
  fieldWarnings: number,
): { hasIssues: boolean; message: string | null } {
  const totalIssues = fieldErrors + fieldWarnings;

  if (totalIssues === 0) {
    return { hasIssues: false, message: null };
  }

  const parts: string[] = [];
  if (fieldErrors > 0) {
    parts.push(`${fieldErrors} error${fieldErrors > 1 ? 's' : ''}`);
  }
  if (fieldWarnings > 0) {
    parts.push(`${fieldWarnings} warning${fieldWarnings > 1 ? 's' : ''}`);
  }

  return {
    hasIssues: true,
    message: `This section has ${parts.join(' and ')}`,
  };
}
