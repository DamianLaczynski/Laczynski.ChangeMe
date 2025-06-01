// =============================================================================
// Modal Component Models
// =============================================================================
// TypeScript interfaces and types for the Modal component
// Provides type safety and documentation for component usage

// =============================================================================
// CORE MODAL TYPES
// =============================================================================

/**
 * Available modal sizes
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Available modal variants
 */
export type ModalVariant = 'default' | 'danger' | 'success' | 'warning' | 'info';

/**
 * Modal animation types
 */
export type ModalAnimation = 'fade' | 'slide' | 'scale' | 'none';

/**
 * Modal close trigger sources
 */
export type ModalCloseTrigger =
  | 'button'
  | 'overlay'
  | 'escape'
  | 'programmatic'
  | 'action'
  | 'close-button';

// =============================================================================
// EVENT INTERFACES
// =============================================================================

/**
 * Modal open event payload
 */
export interface ModalOpenEvent {
  /** Timestamp when modal opened */
  timestamp: number;
  /** Data passed when opening the modal */
  data?: any;
}

/**
 * Modal close event payload
 */
export interface ModalCloseEvent {
  /** What triggered the close */
  trigger: ModalCloseTrigger;
  /** Timestamp when modal closed */
  timestamp: number;
  /** Return data from modal */
  data?: any;
  /** Whether close was cancelled */
  cancelled?: boolean;
}

/**
 * Modal action event payload
 */
export interface ModalActionEvent {
  /** Action identifier */
  action: string;
  /** Action data payload */
  data?: any;
  /** Original DOM event */
  originalEvent: Event;
}

/**
 * Modal before close event payload
 */
export interface ModalBeforeCloseEvent {
  /** What is triggering the close */
  trigger: ModalCloseTrigger;
  /** Function to prevent closing */
  preventDefault: () => void;
  /** Whether default was prevented */
  defaultPrevented: boolean;
}

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Modal component configuration interface
 */
export interface ModalConfig {
  /** Default modal size */
  defaultSize: ModalSize;
  /** Default modal variant */
  defaultVariant: ModalVariant;
  /** Default animation type */
  defaultAnimation: ModalAnimation;
  /** Whether to close on overlay click by default */
  defaultCloseOnOverlay: boolean;
  /** Whether to close on escape key by default */
  defaultCloseOnEscape: boolean;
  /** Whether to show close button by default */
  defaultShowCloseButton: boolean;
  /** Default z-index for modals */
  defaultZIndex: number;
  /** Whether to disable page scroll when modal is open */
  disablePageScroll: boolean;
}

/**
 * Modal accessibility configuration
 */
export interface ModalAccessibilityConfig {
  /** Default ARIA label */
  defaultAriaLabel: string;
  /** Whether to auto-focus first focusable element */
  autoFocus: boolean;
  /** Whether to restore focus after close */
  restoreFocus: boolean;
  /** Whether to trap focus within modal */
  trapFocus: boolean;
  /** Role attribute for modal */
  role: string;
}

/**
 * Modal action button configuration
 */
export interface ModalAction {
  /** Action identifier */
  id: string;
  /** Button text */
  label: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether action closes modal */
  closesModal?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is loading */
  loading?: boolean;
  /** Action data payload */
  data?: any;
  /** Click handler */
  handler?: (event: ModalActionEvent) => void | Promise<void>;
}

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

/**
 * Modal variant style definition
 */
export interface ModalVariantDefinition {
  /** Variant name */
  name: ModalVariant;
  /** CSS class name */
  className: string;
  /** Display label for the variant */
  label: string;
  /** Description of when to use this variant */
  description: string;
  /** Icon associated with variant */
  icon?: string;
  /** Primary color for the variant */
  primaryColor: string;
  /** Background color */
  backgroundColor: string;
}

/**
 * All available modal variants with their definitions
 */
export const MODAL_VARIANTS: Record<ModalVariant, ModalVariantDefinition> = {
  default: {
    name: 'default',
    className: 'ds-modal--default',
    label: 'Default',
    description: 'Standard modal for general content',
    primaryColor: 'var(--color-primary)',
    backgroundColor: 'var(--color-surface)',
  },
  danger: {
    name: 'danger',
    className: 'ds-modal--danger',
    label: 'Danger',
    description: 'Critical actions like delete confirmations',
    icon: '⚠️',
    primaryColor: 'var(--color-danger)',
    backgroundColor: 'var(--color-surface)',
  },
  success: {
    name: 'success',
    className: 'ds-modal--success',
    label: 'Success',
    description: 'Success confirmations and positive feedback',
    icon: '✅',
    primaryColor: 'var(--color-success)',
    backgroundColor: 'var(--color-surface)',
  },
  warning: {
    name: 'warning',
    className: 'ds-modal--warning',
    label: 'Warning',
    description: 'Warning messages and caution dialogs',
    icon: '⚠️',
    primaryColor: 'var(--color-warning)',
    backgroundColor: 'var(--color-surface)',
  },
  info: {
    name: 'info',
    className: 'ds-modal--info',
    label: 'Info',
    description: 'Informational dialogs and help content',
    icon: 'ℹ️',
    primaryColor: 'var(--color-info)',
    backgroundColor: 'var(--color-surface)',
  },
};

// =============================================================================
// SIZE DEFINITIONS
// =============================================================================

/**
 * Modal size definition
 */
export interface ModalSizeDefinition {
  /** Size name */
  name: ModalSize;
  /** CSS class name */
  className: string;
  /** Display label */
  label: string;
  /** Maximum width */
  maxWidth: string;
  /** Maximum height */
  maxHeight: string;
  /** Recommended content type */
  recommendedFor: string;
}

/**
 * All available modal sizes with their definitions
 */
export const MODAL_SIZES: Record<ModalSize, ModalSizeDefinition> = {
  sm: {
    name: 'sm',
    className: 'ds-modal--sm',
    label: 'Small',
    maxWidth: '400px',
    maxHeight: '300px',
    recommendedFor: 'Simple confirmations and alerts',
  },
  md: {
    name: 'md',
    className: 'ds-modal--md',
    label: 'Medium',
    maxWidth: '600px',
    maxHeight: '500px',
    recommendedFor: 'Forms and detailed content',
  },
  lg: {
    name: 'lg',
    className: 'ds-modal--lg',
    label: 'Large',
    maxWidth: '800px',
    maxHeight: '700px',
    recommendedFor: 'Complex forms and data tables',
  },
  xl: {
    name: 'xl',
    className: 'ds-modal--xl',
    label: 'Extra Large',
    maxWidth: '1200px',
    maxHeight: '900px',
    recommendedFor: 'Rich content and media viewers',
  },
  full: {
    name: 'full',
    className: 'ds-modal--full',
    label: 'Full Screen',
    maxWidth: '100vw',
    maxHeight: '100vh',
    recommendedFor: 'Immersive experiences and complex workflows',
  },
};

// =============================================================================
// STATE INTERFACES
// =============================================================================

/**
 * Modal state interface
 */
export interface ModalState {
  /** Whether modal is currently open */
  isOpen: boolean;
  /** Whether modal is in opening animation */
  isOpening: boolean;
  /** Whether modal is in closing animation */
  isClosing: boolean;
  /** Current variant */
  variant: ModalVariant;
  /** Current size */
  size: ModalSize;
  /** Unique modal ID */
  id: string;
  /** Modal data */
  data?: any;
}

/**
 * Modal metrics for analytics
 */
export interface ModalMetrics {
  /** Number of times modal was opened */
  openCount: number;
  /** Number of times modal was closed */
  closeCount: number;
  /** Average time modal stayed open */
  averageOpenTime: number;
  /** Last open timestamp */
  lastOpenTime: number;
  /** Last close timestamp */
  lastCloseTime: number;
  /** Most common close trigger */
  commonCloseTrigger: ModalCloseTrigger;
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

/**
 * Default modal configuration
 */
export const DEFAULT_MODAL_CONFIG: ModalConfig = {
  defaultSize: 'md',
  defaultVariant: 'default',
  defaultAnimation: 'fade',
  defaultCloseOnOverlay: true,
  defaultCloseOnEscape: true,
  defaultShowCloseButton: true,
  defaultZIndex: 1000,
  disablePageScroll: true,
};

/**
 * Default accessibility configuration
 */
export const DEFAULT_ACCESSIBILITY_CONFIG: ModalAccessibilityConfig = {
  defaultAriaLabel: 'Dialog',
  autoFocus: true,
  restoreFocus: true,
  trapFocus: true,
  role: 'dialog',
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if a string is a valid modal variant
 */
export const isValidModalVariant = (variant: string): variant is ModalVariant => {
  return Object.keys(MODAL_VARIANTS).includes(variant);
};

/**
 * Check if a string is a valid modal size
 */
export const isValidModalSize = (size: string): size is ModalSize => {
  return Object.keys(MODAL_SIZES).includes(size);
};

/**
 * Get modal variant definition
 */
export const getModalVariantDefinition = (variant: ModalVariant): ModalVariantDefinition => {
  return MODAL_VARIANTS[variant];
};

/**
 * Get modal size definition
 */
export const getModalSizeDefinition = (size: ModalSize): ModalSizeDefinition => {
  return MODAL_SIZES[size];
};

/**
 * Generate unique modal ID
 */
export const generateModalId = (): string => {
  return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
