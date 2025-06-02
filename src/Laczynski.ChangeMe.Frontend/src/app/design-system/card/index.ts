// =============================================================================
// Card Component Module Exports
// =============================================================================
// Public API for the Card component and related types

// Main component
export { CardComponent } from './card.component';

// Showcase component
export { CardShowcaseComponent } from './card-showcase.component';

// Type exports
export type {
  // Core interfaces
  CardConfig,
  CardHeader,
  CardFooter,
  CardMedia,
  CardContent,
  CardAvatar,
  CardAction,

  // Type variants
  CardVariant,
  CardElevation,
  CardBackground,

  // Event types
  CardClickEvent,
  CardActionEvent,
  CardHoverEvent,
} from './card.model';

// Value exports
export {
  // Constants
  DEFAULT_CARD_CONFIG,
  CARD_SIZE_CONFIG,
  CARD_ELEVATION_CONFIG,
  CARD_VARIANTS,

  // Utility functions
  createCardConfig,
  createCardHeader,
  createCardFooter,
  createCardAction,
  getCardClasses,
  getAvatarClasses,
  getActionClasses,
  generateCardId,
  calculateCardColumns,
  isValidCardVariant,
  getCardVariantLabel,
  getCardSizeLabel,
  getCardAriaAttributes,
  createCardClickEvent,
  createCardActionEvent,
  createCardHoverEvent,
} from './card.model';
