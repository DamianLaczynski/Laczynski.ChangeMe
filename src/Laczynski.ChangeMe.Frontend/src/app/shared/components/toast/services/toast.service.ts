import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastPosition } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  /**
   * Show a success toast
   */
  success(title: string, message?: string, options?: Partial<ToastMessage>): string {
    return this.add({
      intent: 'success',
      title,
      message: message || '',
      duration: options?.duration || 5000,
      sticky: options?.sticky || false,
      ...options,
    });
  }

  /**
   * Show an info toast
   */
  info(title: string, message?: string, options?: Partial<ToastMessage>): string {
    return this.add({
      intent: 'info',
      title,
      message: message || '',
      duration: options?.duration || 5000,
      sticky: options?.sticky || false,
      ...options,
    });
  }

  /**
   * Show a warning toast
   */
  warn(title: string, message?: string, options?: Partial<ToastMessage>): string {
    return this.add({
      intent: 'warning',
      title,
      message: message || '',
      duration: options?.duration || 5000,
      sticky: options?.sticky || false,
      ...options,
    });
  }

  /**
   * Show an error toast
   */
  error(title: string, message?: string, options?: Partial<ToastMessage>): string {
    return this.add({
      intent: 'danger',
      title,
      message: message || '',
      duration: options?.duration || 5000,
      sticky: options?.sticky || false,
      ...options,
    });
  }

  /**
   * Add a custom toast
   */
  add(toast: ToastMessage): string {
    const toastWithId = {
      ...toast,
      id: toast.id || this.generateId(),
    };

    this.toasts.set([...this.toasts(), toastWithId]);
    // Auto-remove toast after specified life time
    if (toast.duration && !toast.sticky) {
      setTimeout(() => {
        this.remove(toastWithId.id!);
      }, toast.duration);
    }

    return toastWithId.id!;
  }

  /**
   * Remove a specific toast by ID
   */
  remove(id: string): void {
    this.toasts.set(this.toasts().filter(t => t.id !== id));
  }

  /**
   * Remove a specific toast by object
   */
  removeToast(toast: ToastMessage): void {
    if (toast.id) {
      this.remove(toast.id);
    }
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toasts.set([]);
  }

  /**
   * Get current toasts
   */
  getToasts(): ToastMessage[] {
    return this.toasts();
  }

  /**
   * Generate unique ID for toasts
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
