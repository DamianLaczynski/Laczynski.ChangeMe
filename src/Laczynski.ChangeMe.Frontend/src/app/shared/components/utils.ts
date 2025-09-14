// Fluent 2 Design System Types
export type ButtonStyle = 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
export type ButtonState = 'rest' | 'hover' | 'pressed' | 'selected' | 'disabled';
export type FluentSize = 'small' | 'medium' | 'large';

export type FieldStyle = 'filled darker' | 'filled lighter' | 'outline' | 'underline';
export type FieldState =
  | 'rest'
  | 'hover'
  | 'pressed'
  | 'focus'
  | 'error'
  | 'warning'
  | 'disabled'
  | 'readonly';

// Legacy support - keeping for backward compatibility
export type Intent = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
export type Variant = 'solid' | 'outline' | 'ghost';
export type Size = 'sm' | 'md' | 'lg' | 'xl';
