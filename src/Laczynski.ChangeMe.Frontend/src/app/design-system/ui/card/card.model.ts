// =============================================================================
// Card Component Models
// =============================================================================
// Type definitions and interfaces for the modern Card component
// Supporting multiple variants, media, actions, and interactive states

import { TemplateRef, Signal } from '@angular/core';

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
  size: CardSize;

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
// CARD TYPES & VARIANTS
// =============================================================================

/**
 * Card visual variants
 */
export type CardVariant = 'default' | 'outlined' | 'filled' | 'elevated' | 'ghost';

/**
 * Card size variants
 */
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card elevation levels
 */
export type CardElevation = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card background styles
 */
export type CardBackground = 'default' | 'muted' | 'accent' | 'gradient' | 'transparent';

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
 * Card size configurations
 */
export const CARD_SIZE_CONFIG = {
  sm: {
    padding: 'var(--spacing-sm)',
    fontSize: 'var(--font-size-sm)',
    headerHeight: '32px',
    borderRadius: 'var(--border-radius-sm)',
  },
  md: {
    padding: 'var(--spacing-md)',
    fontSize: 'var(--font-size-base)',
    headerHeight: '40px',
    borderRadius: 'var(--border-radius-md)',
  },
  lg: {
    padding: 'var(--spacing-lg)',
    fontSize: 'var(--font-size-lg)',
    headerHeight: '48px',
    borderRadius: 'var(--border-radius-lg)',
  },
  xl: {
    padding: 'var(--spacing-xl)',
    fontSize: 'var(--font-size-xl)',
    headerHeight: '56px',
    borderRadius: 'var(--border-radius-xl)',
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
  const classes = ['ds-card'];

  // Variant classes
  classes.push(`ds-card--${config.variant}`);
  classes.push(`ds-card--${config.size}`);
  classes.push(`ds-card--elevation-${config.elevation}`);
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
export function generateCardId(prefix: string = 'card'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
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
