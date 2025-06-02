// =============================================================================
// Button Component Public API
// =============================================================================
// Barrel export file for clean component imports

// Component exports
export { ButtonComponent } from './button.component';
export { ButtonShowcaseComponent } from './button-showcase.component';

// Model exports
export type {
  ButtonType,
  ButtonClickEvent,
  ButtonFocusEvent,
  ButtonBlurEvent,
  ButtonConfig,
  ButtonAccessibilityConfig,
  ButtonVariantDefinition,
  ButtonSizeDefinition,
  ButtonState,
  ButtonMetrics,
} from './button.model';

export {
  BUTTON_VARIANTS,
  BUTTON_SIZES,
  DEFAULT_BUTTON_CONFIG,
  DEFAULT_BUTTON_A11Y_CONFIG,
  isValidButtonVariant,
  isValidButtonSize,
  getButtonVariantDefinition,
  getButtonSizeDefinition,
  createButtonConfig,
  createButtonState,
} from './button.model';
