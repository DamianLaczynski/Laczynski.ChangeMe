// =============================================================================
// Toast Component Models
// =============================================================================
// TypeScript interfaces and types for the Toast component

// =============================================================================
// CORE TOAST TYPES
// =============================================================================

/**
 * Available toast variants
 */
export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast position options
 */
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

/**
 * Toast animation types
 */
export type ToastAnimation = 'slide' | 'fade' | 'bounce';

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Toast component configuration
 */
export interface ToastConfig {
  /** Default variant */
  defaultVariant: ToastVariant;
  /** Default position */
  defaultPosition: ToastPosition;
  /** Default animation */
  defaultAnimation: ToastAnimation;
  /** Default duration in ms */
  defaultDuration: number;
  /** Whether to show close button */
  showCloseButton: boolean;
  /** Whether to pause on hover */
  pauseOnHover: boolean;
}

/**
 * Toast data interface
 */
export interface Toast {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  showCloseButton?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

// =============================================================================
// VARIANT DEFINITIONS
// =============================================================================

/**
 * Toast variant definition
 */
export interface ToastVariantDefinition {
  name: ToastVariant;
  className: string;
  label: string;
  description: string;
  icon: string;
  primaryColor: string;
}

/**
 * All available toast variants
 */
export const TOAST_VARIANTS: Record<ToastVariant, ToastVariantDefinition> = {
  success: {
    name: 'success',
    className: 'ds-toast--success',
    label: 'Success',
    description: 'Success notifications and confirmations',
    icon: '✅',
    primaryColor: 'var(--color-success)',
  },
  error: {
    name: 'error',
    className: 'ds-toast--error',
    label: 'Error',
    description: 'Error messages and failures',
    icon: '❌',
    primaryColor: 'var(--color-danger)',
  },
  warning: {
    name: 'warning',
    className: 'ds-toast--warning',
    label: 'Warning',
    description: 'Warning messages and cautions',
    icon: '⚠️',
    primaryColor: 'var(--color-warning)',
  },
  info: {
    name: 'info',
    className: 'ds-toast--info',
    label: 'Info',
    description: 'Informational messages',
    icon: 'ℹ️',
    primaryColor: 'var(--color-info)',
  },
};

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

export const DEFAULT_TOAST_CONFIG: ToastConfig = {
  defaultVariant: 'info',
  defaultPosition: 'top-right',
  defaultAnimation: 'slide',
  defaultDuration: 5000,
  showCloseButton: true,
  pauseOnHover: true,
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const isValidToastVariant = (variant: string): variant is ToastVariant => {
  return Object.keys(TOAST_VARIANTS).includes(variant);
};

export const getToastVariantDefinition = (variant: ToastVariant): ToastVariantDefinition => {
  return TOAST_VARIANTS[variant];
};

export const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
