// =============================================================================
// Modal Component Public API
// =============================================================================
// Barrel export file for clean component imports

// Component exports
export { ModalComponent } from './modal.component';
export { ModalService, ModalRef } from './modal.service';
export { ModalShowcaseComponent } from './modal-showcase.component';

// Model exports
export type {
  ModalSize,
  ModalVariant,
  ModalAnimation,
  ModalCloseTrigger,
  ModalOpenEvent,
  ModalCloseEvent,
  ModalActionEvent,
  ModalBeforeCloseEvent,
  ModalConfig,
  ModalAccessibilityConfig,
  ModalAction,
  ModalVariantDefinition,
  ModalSizeDefinition,
  ModalState,
  ModalMetrics,
} from './modal.model';

export {
  MODAL_VARIANTS,
  MODAL_SIZES,
  DEFAULT_MODAL_CONFIG,
  DEFAULT_ACCESSIBILITY_CONFIG,
  isValidModalVariant,
  isValidModalSize,
  getModalVariantDefinition,
  getModalSizeDefinition,
  generateModalId,
} from './modal.model';
