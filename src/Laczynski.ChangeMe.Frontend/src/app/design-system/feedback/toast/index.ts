// =============================================================================
// Toast Component Public API
// =============================================================================

export { ToastComponent } from './toast.component';
export { ToastShowcaseComponent } from './toast-showcase.component';

export type {
  ToastVariant,
  ToastPosition,
  ToastAnimation,
  ToastConfig,
  Toast,
  ToastVariantDefinition,
} from './toast.model';

export {
  TOAST_VARIANTS,
  DEFAULT_TOAST_CONFIG,
  isValidToastVariant,
  getToastVariantDefinition,
  generateToastId,
} from './toast.model';
