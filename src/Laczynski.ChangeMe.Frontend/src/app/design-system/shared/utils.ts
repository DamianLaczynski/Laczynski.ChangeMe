// =============================================================================
// Design System Utility Functions
// =============================================================================
// Common utility functions used across design system components
// Provides reusable functionality for validation, formatting, and helpers

import { ComponentSize, ComponentVariant } from './types';

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Check if a value is not null or undefined
 */
export const isNotNullish = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Check if a string is not empty
 */
export const isNotEmpty = (value: string | null | undefined): value is string => {
  return isNotNullish(value) && value.trim().length > 0;
};

/**
 * Check if an array has items
 */
export const hasItems = <T>(array: T[] | null | undefined): array is T[] => {
  return isNotNullish(array) && array.length > 0;
};

// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert camelCase to kebab-case
 */
export const camelToKebab = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Convert kebab-case to camelCase
 */
export const kebabToCamel = (str: string): string => {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

/**
 * Truncate string with ellipsis
 */
export const truncateString = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Remove duplicates from array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Chunk array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Flatten nested arrays
 */
export const flatten = <T>(arrays: T[][]): T[] => {
  return arrays.reduce((acc, val) => acc.concat(val), []);
};

// =============================================================================
// OBJECT UTILITIES
// =============================================================================

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object' && obj.constructor === Object) {
    const copy: Record<string, any> = {};
    Object.keys(obj as Record<string, any>).forEach(key => {
      copy[key] = deepClone((obj as Record<string, any>)[key]);
    });
    return copy as T;
  }
  return obj;
};

/**
 * Check if two objects are deeply equal
 */
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => deepEqual(val, b[i]));
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => deepEqual(a[key], b[key]));
  }
  return false;
};

/**
 * Pick specific properties from object
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Omit specific properties from object
 */
export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

// =============================================================================
// FORMAT UTILITIES
// =============================================================================

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// =============================================================================
// TIMING UTILITIES
// =============================================================================

/**
 * Debounce function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function calls
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Create a promise that resolves after specified delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// =============================================================================
// DOM UTILITIES
// =============================================================================

/**
 * Check if element is visible in viewport
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Smooth scroll to element
 */
export const scrollToElement = (
  element: HTMLElement,
  behavior: ScrollBehavior = 'smooth',
): void => {
  element.scrollIntoView({ behavior, block: 'center' });
};

/**
 * Get element's computed style property
 */
export const getComputedStyleProperty = (element: HTMLElement, property: string): string => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

// =============================================================================
// ACCESSIBILITY UTILITIES
// =============================================================================

/**
 * Generate ARIA describedby ID from multiple sources
 */
export const generateAriaDescribedBy = (...ids: (string | undefined)[]): string | undefined => {
  const validIds = ids.filter(isNotEmpty);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

/**
 * Check if element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableElements = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableElements.some(selector => element.matches(selector));
};

/**
 * Get all focusable elements within container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return Array.from(container.querySelectorAll(focusableSelectors.join(', '))) as HTMLElement[];
};

// =============================================================================
// SIZE AND VARIANT UTILITIES
// =============================================================================

/**
 * Get size index for comparison
 */
export const getSizeIndex = (size: ComponentSize): number => {
  const sizeMap: Record<ComponentSize, number> = { sm: 0, md: 1, lg: 2 };
  return sizeMap[size] ?? 1;
};

/**
 * Compare two sizes
 */
export const compareSize = (a: ComponentSize, b: ComponentSize): number => {
  return getSizeIndex(a) - getSizeIndex(b);
};

/**
 * Get next larger size
 */
export const getNextSize = (size: ComponentSize): ComponentSize => {
  const sizes: ComponentSize[] = ['sm', 'md', 'lg'];
  const currentIndex = sizes.indexOf(size);
  return sizes[Math.min(currentIndex + 1, sizes.length - 1)];
};

/**
 * Get next smaller size
 */
export const getPreviousSize = (size: ComponentSize): ComponentSize => {
  const sizes: ComponentSize[] = ['sm', 'md', 'lg'];
  const currentIndex = sizes.indexOf(size);
  return sizes[Math.max(currentIndex - 1, 0)];
};

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Safe function execution with error handling
 */
export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  errorHandler?: (error: Error) => void,
): T => {
  try {
    return fn();
  } catch (error) {
    if (errorHandler && error instanceof Error) {
      errorHandler(error);
    }
    return fallback;
  }
};

/**
 * Create error logger with context
 */
export const createErrorLogger = (context: string) => {
  return (error: Error, additionalInfo?: any) => {
    console.error(`[${context}]`, error.message, { error, additionalInfo });
  };
};
