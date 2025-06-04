// =============================================================================
// Accordion Component Public API
// =============================================================================
// Barrel export file for clean component imports

// Component exports
export { AccordionComponent } from './accordion.component';
export { AccordionShowcaseComponent } from './accordion-showcase.component';

// Model exports
export type {
  AccordionItem,
  AccordionMode,
  AccordionItemState,
  AccordionItemExpandEvent,
  AccordionFocusEvent,
  AccordionConfig,
  AccordionAccessibilityConfig,
  AccordionVariantDefinition,
  AccordionSizeDefinition,
  AccordionState,
  AccordionMetrics,
} from './accordion.model';

export {
  ACCORDION_VARIANTS,
  ACCORDION_SIZES,
  DEFAULT_ACCORDION_CONFIG,
  DEFAULT_ACCORDION_A11Y_CONFIG,
  isValidAccordionMode,
  getAccordionVariantDefinition,
  getAccordionSizeDefinition,
  createAccordionConfig,
  createAccordionState,
  validateAccordionItem,
  generateAccordionItemId,
} from './accordion.model';
