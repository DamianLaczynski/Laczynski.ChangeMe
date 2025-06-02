// =============================================================================
// Design System Shared Types
// =============================================================================
// Common types and interfaces used across design system components
// Ensures consistency and reusability of type definitions

// =============================================================================
// SIZE TYPES
// =============================================================================

/**
 * Standard component sizes used across the design system
 * Used by buttons, inputs, cards, lists, and other components
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Extended component sizes that includes extra large
 * Used by components that need more size variants (e.g., cards, modals)
 */
export type ExtendedComponentSize = ComponentSize | 'xl';

/**
 * Size configuration interface for components
 */
export interface SizeConfiguration {
  /** Size identifier */
  name: ComponentSize | ExtendedComponentSize;
  /** CSS class name */
  className: string;
  /** Display label */
  label: string;
  /** Height in pixels */
  height?: number;
  /** Font size */
  fontSize?: string;
  /** Padding */
  padding?: string;
}

/**
 * Standard size configurations for consistent sizing across components
 */
export const STANDARD_SIZE_CONFIG: Record<ComponentSize, SizeConfiguration> = {
  sm: {
    name: 'sm',
    className: 'ds-size--sm',
    label: 'Small',
    height: 32,
    fontSize: 'var(--font-size-sm)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
  },
  md: {
    name: 'md',
    className: 'ds-size--md',
    label: 'Medium',
    height: 40,
    fontSize: 'var(--font-size-base)',
    padding: 'var(--spacing-md) var(--spacing-lg)',
  },
  lg: {
    name: 'lg',
    className: 'ds-size--lg',
    label: 'Large',
    height: 48,
    fontSize: 'var(--font-size-lg)',
    padding: 'var(--spacing-lg) var(--spacing-xl)',
  },
};

/**
 * Extended size configurations including extra large
 */
export const EXTENDED_SIZE_CONFIG: Record<ExtendedComponentSize, SizeConfiguration> = {
  ...STANDARD_SIZE_CONFIG,
  xl: {
    name: 'xl',
    className: 'ds-size--xl',
    label: 'Extra Large',
    height: 56,
    fontSize: 'var(--font-size-xl)',
    padding: 'var(--spacing-xl) var(--spacing-2xl)',
  },
};

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a string is a valid component size
 */
export const isValidComponentSize = (size: string): size is ComponentSize => {
  return ['sm', 'md', 'lg'].includes(size);
};

/**
 * Check if a string is a valid extended component size
 */
export const isValidExtendedComponentSize = (size: string): size is ExtendedComponentSize => {
  return ['sm', 'md', 'lg', 'xl'].includes(size);
};

/**
 * Get size configuration by name
 */
export const getSizeConfiguration = (size: ComponentSize): SizeConfiguration => {
  return STANDARD_SIZE_CONFIG[size];
};

/**
 * Get extended size configuration by name
 */
export const getExtendedSizeConfiguration = (size: ExtendedComponentSize): SizeConfiguration => {
  return EXTENDED_SIZE_CONFIG[size];
};
