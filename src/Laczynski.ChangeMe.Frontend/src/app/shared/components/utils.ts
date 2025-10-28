// Fluent 2 Design System Types
export type ButtonStyle = 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
export type ButtonState = 'rest' | 'hover' | 'pressed' | 'selected' | 'disabled';
export type Size = 'small' | 'medium' | 'large';
export type StateType = 'info' | 'error' | 'warning' | 'success';
export type CheckboxStyle = 'standard' | 'circular';
export type RadioLayout = 'after' | 'below';
export type RadioGroupDirection = 'horizontal' | 'vertical';
export type TooltipStyle = 'default' | 'brand' | 'inverted';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type SwitchLabelPosition = 'before' | 'after' | 'above' | 'none';
export type TagStyle = 'filled' | 'brand' | 'outline';
export type TagSize = 'extra-small' | 'small' | 'medium';
export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerAlignment = 'start' | 'center' | 'end';
export type BadgeColor =
  | 'brand'
  | 'danger'
  | 'success'
  | 'important'
  | 'informative'
  | 'subtle'
  | 'warning';
export type BadgeSize = 'small' | 'medium' | 'large' | 'extra-large';
export type BadgeAppearance = 'filled' | 'tint' | 'outline' | 'subtle';
export type CardStyle = 'filled' | 'outline' | 'subtle';
export type CardState = 'rest' | 'hover' | 'pressed' | 'selected' | 'disabled';
export type SplitterOrientation = 'horizontal' | 'vertical';
export type SpinnerSize =
  | 'extra-tiny'
  | 'tiny'
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | 'huge';
export type SpinnerLabelPosition = 'after' | 'before' | 'above' | 'below' | 'none';
export interface QuickAction {
  label: string;
  variant?: ButtonStyle;
  icon?: string;
  size?: Size;
  disabled?: boolean;
  action: () => void;
}

// Legacy support - keeping for backward compatibility
export type Intent = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type Variant = 'solid' | 'outline' | 'ghost';
