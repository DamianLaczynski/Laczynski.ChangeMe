// =============================================================================
// Modal Component Public API
// =============================================================================
// Main export file for the Modal component

// Main component
export { ModalComponent } from './modal.component';

// Component models and types
export type {
  // Types
  ModalAnimation,
  ModalPosition,
  ModalCloseTrigger,

  // Interfaces
  ModalOpenEvent,
  ModalCloseEvent,
  ModalBackdropClickEvent,
  ModalConfig,
  ModalAccessibilityConfig,
  ModalSizeDefinition,
  ModalAnimationDefinition,
  ModalState,
} from './modal.model';

export {
  // Constants
  MODAL_SIZES,
  MODAL_ANIMATIONS,

  // Utility functions
  isValidModalAnimation,
  isValidModalPosition,
  getModalSizeDefinition,
  getModalAnimationDefinition,
  createModalConfig,
  createModalState,
} from './modal.model';

// Re-export from showcase
export { ModalShowcaseComponent } from './modal-showcase.component';
