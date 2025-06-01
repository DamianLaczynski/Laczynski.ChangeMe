// =============================================================================
// Form Group Component Exports
// =============================================================================

// Component exports
export { FormGroupComponent } from './form-group.component';
export { FormGroupShowcaseComponent } from './form-group-showcase.component';

// Type exports with 'export type' syntax for isolatedModules
export type {
  FormGroupConfig,
  FormGroupVariant,
  FormGroupSize,
  FormGroupLayout,
  FormGroupSpacing,
  FormGroupState,
  FormGroupProgress,
  FormGroupAction,
  FormGroupActionType,
  FormGroupStateChangeEvent,
  FormGroupToggleEvent,
  FormGroupActionEvent,
} from './form-group.model';

// Utility function exports
export {
  DEFAULT_FORM_GROUP_CONFIG,
  FORM_GROUP_SIZE_CONFIG,
  FORM_GROUP_SPACING_CONFIG,
  createFormGroupConfig,
  createFormGroupState,
  createFormGroupAction,
  calculateFormGroupProgress,
  getFormGroupClasses,
  getFormGroupAriaAttributes,
  getFormGroupTitleClasses,
  getFormGroupContentClasses,
  generateFormGroupId,
  validateFormGroupConfig,
  isFormGroupContentVisible,
  getFormGroupToggleIcon,
  getFormGroupStatusIcon,
  formatFormGroupProgress,
  shouldShowFormGroupProgress,
  getFormGroupValidationSummary,
} from './form-group.model';
