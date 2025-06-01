// =============================================================================
// Alert Component Models
// =============================================================================

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

export interface AlertVariantDefinition {
  name: AlertVariant;
  className: string;
  label: string;
  description: string;
  icon: string;
  primaryColor: string;
}

export const ALERT_VARIANTS: Record<AlertVariant, AlertVariantDefinition> = {
  success: {
    name: 'success',
    className: 'ds-alert--success',
    label: 'Success',
    description: 'Success messages and confirmations',
    icon: '✅',
    primaryColor: 'var(--color-success)',
  },
  error: {
    name: 'error',
    className: 'ds-alert--error',
    label: 'Error',
    description: 'Error messages and failures',
    icon: '❌',
    primaryColor: 'var(--color-danger)',
  },
  warning: {
    name: 'warning',
    className: 'ds-alert--warning',
    label: 'Warning',
    description: 'Warning messages and cautions',
    icon: '⚠️',
    primaryColor: 'var(--color-warning)',
  },
  info: {
    name: 'info',
    className: 'ds-alert--info',
    label: 'Info',
    description: 'Informational messages',
    icon: 'ℹ️',
    primaryColor: 'var(--color-info)',
  },
};

export const getAlertVariantDefinition = (variant: AlertVariant): AlertVariantDefinition => {
  return ALERT_VARIANTS[variant];
};
