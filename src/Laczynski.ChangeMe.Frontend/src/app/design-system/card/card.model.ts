// =============================================================================
// Card Component Models
// =============================================================================
// Type definitions and interfaces for the modern Card component
// Supporting multiple variants, media, actions, and interactive states

import { TemplateRef, Signal } from '@angular/core';
import {
  ComponentSize,
  ComponentVariant,
  ComponentState,
  FormComponentState,
  ComponentChangeEvent,
  ComponentFocusEvent,
  AccessibilityConfig,
  ValidationResult,
  ValidationRule,
  generateComponentId,
  mergeClasses,
  createAccessibilityAttributes,
  getSizeConfiguration,
  isValidComponentSize,
  isValidComponentVariant,
  getNestedValue,
} from '../shared';

// =============================================================================
// CARD-SPECIFIC TYPES
// =============================================================================

/**
 * Card variants extending base component variants
 */
export type CardVariant =
  | Extract<ComponentVariant, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>
  | 'default'
  | 'outlined'
  | 'filled'
  | 'elevated'
  | 'ghost';

/**
 * Card elevation levels
 */
export type CardElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card background styles
 */
export type CardBackground = 'default' | 'muted' | 'accent' | 'gradient' | 'transparent';

// =============================================================================
// CORE CARD INTERFACES
// =============================================================================

/**
 * Card configuration for the design system
 */
export interface CardConfig {
  /** Visual variant */
  variant: CardVariant;

  /** Card size */
  size: ComponentSize;

  /** Card elevation level */
  elevation: CardElevation;

  /** Whether card is interactive/clickable */
  interactive: boolean;

  /** Whether card is selected */
  selected: boolean;

  /** Whether card is disabled */
  disabled: boolean;

  /** Whether to show border */
  bordered: boolean;

  /** Whether card has padding */
  padded: boolean;

  /** Background style */
  background: CardBackground;

  /** Loading state */
  loading: boolean;
}

/**
 * Card header configuration
 */
export interface CardHeader {
  /** Header title */
  title?: string;

  /** Header subtitle */
  subtitle?: string;

  /** Header avatar/icon */
  avatar?: CardAvatar;

  /** Header actions */
  actions?: CardAction[];

  /** Custom header template */
  template?: TemplateRef<any>;
}

/**
 * Card footer configuration
 */
export interface CardFooter {
  /** Footer actions */
  actions?: CardAction[];

  /** Footer text */
  text?: string;

  /** Footer alignment */
  align?: 'left' | 'center' | 'right' | 'between';

  /** Custom footer template */
  template?: TemplateRef<any>;
}

/**
 * Card media configuration
 */
export interface CardMedia {
  /** Media type */
  type: 'image' | 'video' | 'custom';

  /** Media source URL */
  src?: string;

  /** Media alt text */
  alt?: string;

  /** Media aspect ratio */
  aspectRatio?: string;

  /** Media position */
  position?: 'top' | 'bottom' | 'left' | 'right' | 'background';

  /** Custom media template */
  template?: TemplateRef<any>;
}

/**
 * Card avatar configuration
 */
export interface CardAvatar {
  /** Avatar type */
  type: 'image' | 'icon' | 'initials';

  /** Avatar source (for image) */
  src?: string;

  /** Avatar icon name (for icon) */
  icon?: string;

  /** Avatar initials (for initials) */
  initials?: string;

  /** Avatar size */
  size?: 'sm' | 'md' | 'lg';

  /** Avatar shape */
  shape?: 'circle' | 'square' | 'rounded';
}

/**
 * Card action configuration
 */
export interface CardAction {
  /** Action label */
  label: string;

  /** Action icon */
  icon?: string;

  /** Action variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';

  /** Action size */
  size?: 'sm' | 'md' | 'lg';

  /** Whether action is disabled */
  disabled?: boolean;

  /** Action handler */
  handler: (event: Event) => void;
}

/**
 * Card content sections
 */
export interface CardContent {
  /** Main content template */
  template?: TemplateRef<any>;

  /** Content text */
  text?: string;

  /** Content HTML */
  html?: string;
}

// =============================================================================
// CARD EVENTS
// =============================================================================

/**
 * Card click event
 */
export interface CardClickEvent {
  /** Original event */
  originalEvent: Event;

  /** Card element */
  cardElement: HTMLElement;
}

/**
 * Card action event
 */
export interface CardActionEvent {
  /** Action that was triggered */
  action: CardAction;

  /** Original event */
  originalEvent: Event;
}

/**
 * Card hover event
 */
export interface CardHoverEvent {
  /** Hover state */
  hovered: boolean;

  /** Original event */
  originalEvent: Event;
}

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Default card configuration
 */
export const DEFAULT_CARD_CONFIG: CardConfig = {
  variant: 'default',
  size: 'md',
  elevation: 'sm',
  interactive: false,
  selected: false,
  disabled: false,
  bordered: false,
  padded: true,
  background: 'default',
  loading: false,
};

/**
 * Card variant definitions
 */
export const CARD_VARIANTS: Record<CardVariant, { className: string; label: string }> = {
  default: {
    className: 'ds-card--default',
    label: 'Default',
  },
  primary: {
    className: 'ds-card--primary',
    label: 'Primary',
  },
  secondary: {
    className: 'ds-card--secondary',
    label: 'Secondary',
  },
  success: {
    className: 'ds-card--success',
    label: 'Success',
  },
  warning: {
    className: 'ds-card--warning',
    label: 'Warning',
  },
  danger: {
    className: 'ds-card--danger',
    label: 'Danger',
  },
  outlined: {
    className: 'ds-card--outlined',
    label: 'Outlined',
  },
  filled: {
    className: 'ds-card--filled',
    label: 'Filled',
  },
  elevated: {
    className: 'ds-card--elevated',
    label: 'Elevated',
  },
  ghost: {
    className: 'ds-card--ghost',
    label: 'Ghost',
  },
};

/**
 * Card size configurations extending base size config
 */
export const CARD_SIZE_CONFIG = {
  sm: {
    ...getSizeConfiguration('sm'),
    padding: 'var(--spacing-sm)',
    fontSize: 'var(--font-size-sm)',
    headerHeight: '32px',
    borderRadius: 'var(--border-radius-sm)',
  },
  md: {
    ...getSizeConfiguration('md'),
    padding: 'var(--spacing-md)',
    fontSize: 'var(--font-size-base)',
    headerHeight: '40px',
    borderRadius: 'var(--border-radius-md)',
  },
  lg: {
    ...getSizeConfiguration('lg'),
    padding: 'var(--spacing-lg)',
    fontSize: 'var(--font-size-lg)',
    headerHeight: '48px',
    borderRadius: 'var(--border-radius-lg)',
  },
} as const;

/**
 * Card elevation configurations
 */
export const CARD_ELEVATION_CONFIG = {
  none: 'none',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create card configuration with defaults
 */
export function createCardConfig(partial: Partial<CardConfig> = {}): CardConfig {
  return {
    ...DEFAULT_CARD_CONFIG,
    ...partial,
  };
}

/**
 * Create card header
 */
export function createCardHeader(partial: Partial<CardHeader> = {}): CardHeader {
  return {
    ...partial,
  };
}

/**
 * Create card footer
 */
export function createCardFooter(partial: Partial<CardFooter> = {}): CardFooter {
  return {
    align: 'right',
    ...partial,
  };
}

/**
 * Create card action
 */
export function createCardAction(
  label: string,
  handler: (event: Event) => void,
  options: Partial<CardAction> = {},
): CardAction {
  return {
    label,
    handler,
    variant: 'secondary',
    size: 'md',
    disabled: false,
    ...options,
  };
}

/**
 * Get card CSS classes
 */
export function getCardClasses(config: CardConfig): string[] {
  const sizeConfig = getSizeConfiguration(config.size);
  const variantConfig = CARD_VARIANTS[config.variant];

  const classes = ['ds-card', sizeConfig.className, variantConfig.className];

  // Elevation classes
  classes.push(`ds-card--elevation-${config.elevation}`);

  // Background classes
  classes.push(`ds-card--bg-${config.background}`);

  // State classes
  if (config.interactive) classes.push('ds-card--interactive');
  if (config.selected) classes.push('ds-card--selected');
  if (config.disabled) classes.push('ds-card--disabled');
  if (config.bordered) classes.push('ds-card--bordered');
  if (!config.padded) classes.push('ds-card--no-padding');
  if (config.loading) classes.push('ds-card--loading');

  return classes;
}

/**
 * Get avatar CSS classes
 */
export function getAvatarClasses(avatar: CardAvatar): string[] {
  const classes = ['ds-card__avatar'];

  classes.push(`ds-card__avatar--${avatar.type}`);
  classes.push(`ds-card__avatar--${avatar.size || 'md'}`);
  classes.push(`ds-card__avatar--${avatar.shape || 'circle'}`);

  return classes;
}

/**
 * Generate unique card ID
 */
export function generateCardId(): string {
  return generateComponentId('ds-card');
}

/**
 * Calculate responsive card columns
 */
export function calculateCardColumns(
  containerWidth: number,
  cardMinWidth: number,
  gap: number,
): number {
  const availableWidth = containerWidth - gap;
  const cardWithGap = cardMinWidth + gap;
  return Math.max(1, Math.floor(availableWidth / cardWithGap));
}

/**
 * Get action CSS classes
 */
export function getActionClasses(action: CardAction): string[] {
  const classes = ['ds-card__action'];

  classes.push(`ds-card__action--${action.variant || 'secondary'}`);
  classes.push(`ds-card__action--${action.size || 'md'}`);

  if (action.disabled) classes.push('ds-card__action--disabled');

  return classes;
}

/**
 * Check if a string is a valid card variant
 */
export function isValidCardVariant(variant: string): variant is CardVariant {
  return Object.keys(CARD_VARIANTS).includes(variant);
}

/**
 * Get card variant label
 */
export function getCardVariantLabel(variant: CardVariant): string {
  return CARD_VARIANTS[variant].label;
}

/**
 * Get card size label
 */
export function getCardSizeLabel(size: ComponentSize): string {
  const sizeLabels = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
  };
  return sizeLabels[size];
}

/**
 * Get card ARIA attributes
 */
export function getCardAriaAttributes(
  config: CardConfig,
  hasActions: boolean = false,
): Record<string, string> {
  const attributes: Record<string, string> = {};

  if (config.interactive) {
    attributes['role'] = 'button';
    attributes['tabindex'] = config.disabled ? '-1' : '0';
  }

  if (config.selected) {
    attributes['aria-selected'] = 'true';
  }

  if (config.disabled) {
    attributes['aria-disabled'] = 'true';
  }

  if (hasActions) {
    attributes['aria-label'] = 'Card with actions';
  }

  return attributes;
}

/**
 * Create card click event
 */
export function createCardClickEvent(
  originalEvent: Event,
  cardElement: HTMLElement,
): CardClickEvent {
  return {
    originalEvent,
    cardElement,
  };
}

/**
 * Create card action event
 */
export function createCardActionEvent(action: CardAction, originalEvent: Event): CardActionEvent {
  return {
    action,
    originalEvent,
  };
}

/**
 * Create card hover event
 */
export function createCardHoverEvent(hovered: boolean, originalEvent: Event): CardHoverEvent {
  return {
    hovered,
    originalEvent,
  };
}
