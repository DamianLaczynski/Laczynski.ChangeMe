// =============================================================================
// Modal Component Models
// =============================================================================
// TypeScript interfaces and types for the Modal component
// Provides type safety and documentation for component usage

import { ComponentSize, ComponentState, ComponentClickEvent, ComponentFocusEvent } from '../shared';

// =============================================================================
// MODAL-SPECIFIC TYPES
// =============================================================================

/**
 * Modal animation types
 */
export type ModalAnimation = 'fade' | 'slide' | 'zoom' | 'none';

/**
 * Modal position on screen
 */
export type ModalPosition = 'center' | 'top' | 'bottom' | 'start' | 'end';

/**
 * Modal close trigger sources
 */
export type ModalCloseTrigger = 'overlay' | 'escape' | 'button' | 'api';

// =============================================================================
// MODAL EVENT INTERFACES
// =============================================================================

/**
 * Modal open event payload
 */
export interface ModalOpenEvent {
  /** Modal ID */
  modalId: string;
  /** Timestamp when modal opened */
  timestamp: number;
  /** Animation used */
  animation: ModalAnimation;
}

/**
 * Modal close event payload
 */
export interface ModalCloseEvent {
  /** Modal ID */
  modalId: string;
  /** Timestamp when modal closed */
  timestamp: number;
  /** What triggered the close */
  trigger: ModalCloseTrigger;
  /** Any data passed during close */
  data?: any;
}

/**
 * Modal backdrop click event
 */
export interface ModalBackdropClickEvent extends ComponentClickEvent<HTMLDivElement> {
  /** Whether click should close modal */
  shouldClose: boolean;
}

// =============================================================================
// COMPONENT CONFIGURATION
// =============================================================================

/**
 * Modal component configuration interface
 */
export interface ModalConfig {
  /** Default modal size */
  defaultSize: ComponentSize;
  /** Default animation */
  defaultAnimation: ModalAnimation;
  /** Default position */
  defaultPosition: ModalPosition;
  /** Whether to close on backdrop click */
  closeOnBackdrop: boolean;
  /** Whether to close on escape key */
  closeOnEscape: boolean;
  /** Whether to trap focus */
  trapFocus: boolean;
  /** Whether to restore focus on close */
  restoreFocus: boolean;
  /** Default z-index */
  defaultZIndex: number;
}

/**
 * Modal accessibility configuration
 */
export interface ModalAccessibilityConfig {
  /** Default ARIA label */
  defaultAriaLabel: string;
  /** Whether to automatically set ARIA attributes */
  autoAriaAttributes: boolean;
  /** Whether to hide background content from screen readers */
  hideBackgroundContent: boolean;
  /** Role attribute value */
  role: string;
}

// =============================================================================
// SIZE DEFINITIONS
// =============================================================================

/**
 * Modal size definition
 */
export interface ModalSizeDefinition {
  /** Size name */
  name: ComponentSize;
  /** CSS class name */
  className: string;
  /** Display label */
  label: string;
  /** Maximum width */
  maxWidth: string;
  /** Maximum height */
  maxHeight: string;
  /** Padding */
  padding: string;
}

/**
 * All available modal sizes with their definitions
 */
export const MODAL_SIZES: Record<ComponentSize, ModalSizeDefinition> = {
  sm: {
    name: 'sm',
    className: 'ds-modal--sm',
    label: 'Small',
    maxWidth: '400px',
    maxHeight: '300px',
    padding: 'var(--spacing-lg)',
  },
  md: {
    name: 'md',
    className: 'ds-modal--md',
    label: 'Medium',
    maxWidth: '600px',
    maxHeight: '500px',
    padding: 'var(--spacing-xl)',
  },
  lg: {
    name: 'lg',
    className: 'ds-modal--lg',
    label: 'Large',
    maxWidth: '800px',
    maxHeight: '700px',
    padding: 'var(--spacing-xxl)',
  },
};

// =============================================================================
// ANIMATION DEFINITIONS
// =============================================================================

/**
 * Modal animation definition
 */
export interface ModalAnimationDefinition {
  /** Animation name */
  name: ModalAnimation;
  /** CSS class name */
  className: string;
  /** Display label */
  label: string;
  /** Animation duration in ms */
  duration: number;
  /** Animation easing function */
  easing: string;
}

/**
 * All available modal animations
 */
export const MODAL_ANIMATIONS: Record<ModalAnimation, ModalAnimationDefinition> = {
  fade: {
    name: 'fade',
    className: 'ds-modal--fade',
    label: 'Fade',
    duration: 200,
    easing: 'ease-out',
  },
  slide: {
    name: 'slide',
    className: 'ds-modal--slide',
    label: 'Slide',
    duration: 300,
    easing: 'ease-out',
  },
  zoom: {
    name: 'zoom',
    className: 'ds-modal--zoom',
    label: 'Zoom',
    duration: 250,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  none: {
    name: 'none',
    className: 'ds-modal--no-animation',
    label: 'None',
    duration: 0,
    easing: 'none',
  },
};

// =============================================================================
// COMPONENT STATES
// =============================================================================

/**
 * Modal component state
 */
export interface ModalState extends ComponentState {
  /** Whether modal is open */
  isOpen: boolean;
  /** Whether modal is opening (animating) */
  isOpening: boolean;
  /** Whether modal is closing (animating) */
  isClosing: boolean;
  /** Current animation being played */
  currentAnimation: ModalAnimation | null;
  /** Focus trap active */
  focusTrapActive: boolean;
  /** Element that had focus before modal opened */
  previousFocusElement: HTMLElement | null;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if animation is valid
 */
export const isValidModalAnimation = (animation: string): animation is ModalAnimation => {
  return Object.keys(MODAL_ANIMATIONS).includes(animation);
};

/**
 * Check if position is valid
 */
export const isValidModalPosition = (position: string): position is ModalPosition => {
  return ['center', 'top', 'bottom', 'start', 'end'].includes(position);
};

/**
 * Get modal size definition
 */
export const getModalSizeDefinition = (size: ComponentSize): ModalSizeDefinition => {
  return MODAL_SIZES[size];
};

/**
 * Get modal animation definition
 */
export const getModalAnimationDefinition = (
  animation: ModalAnimation,
): ModalAnimationDefinition => {
  return MODAL_ANIMATIONS[animation];
};

/**
 * Create default modal configuration
 */
export const createModalConfig = (partial: Partial<ModalConfig> = {}): ModalConfig => {
  return {
    defaultSize: 'md',
    defaultAnimation: 'fade',
    defaultPosition: 'center',
    closeOnBackdrop: true,
    closeOnEscape: true,
    trapFocus: true,
    restoreFocus: true,
    defaultZIndex: 1050,
    ...partial,
  };
};

/**
 * Create default modal state
 */
export const createModalState = (partial: Partial<ModalState> = {}): ModalState => {
  return {
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    variant: 'primary',
    size: 'md',
    isOpen: false,
    isOpening: false,
    isClosing: false,
    currentAnimation: null,
    focusTrapActive: false,
    previousFocusElement: null,
    ...partial,
  };
};
