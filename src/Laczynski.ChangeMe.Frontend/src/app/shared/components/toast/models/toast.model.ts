import { Intent } from '../../utils';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastMessage {
  title: string;
  message: string;
  duration?: number;
  sticky?: boolean;
  id?: string;
  intent?: Intent;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'ghost';
  showIcon?: boolean;
  dismissible?: boolean;
  showProgress?: boolean;
}
