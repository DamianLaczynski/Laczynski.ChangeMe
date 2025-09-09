import { Component, input, output, model } from '@angular/core';
import { Intent, Size, Variant } from '../utils';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
})
export class ToastComponent {
  // Content inputs
  title = input<string>('');
  message = input<string>('');
  type = input<Intent>('info');

  // Styling inputs
  intent = input<Intent>('primary');
  size = input<Size>('md');
  variant = input<Variant>('solid');

  // Behavior inputs
  duration = input<number>(5000); // Auto-dismiss duration in ms
  dismissible = input<boolean>(true);
  showIcon = input<boolean>(true);
  showProgress = input<boolean>(true);

  // Position
  position = input<ToastPosition>('top-right');

  // State
  visible = model<boolean>(true);

  // Outputs
  dismiss = output<void>();
  actionClick = output<void>();

  toastClasses(): string {
    const classes = ['toast'];

    classes.push(`toast--${this.type()}`);
    classes.push(`toast--${this.intent()}`);
    classes.push(`toast--${this.size()}`);
    classes.push(`toast--${this.variant()}`);
    classes.push(`toast--${this.position()}`);

    if (!this.visible()) {
      classes.push('toast--hidden');
    }

    return classes.join(' ');
  }

  iconClasses(): string {
    const classes = ['toast__icon'];

    classes.push(`toast__icon--${this.type()}`);

    return classes.join(' ');
  }

  progressClasses(): string {
    const classes = ['toast__progress'];

    classes.push(`toast__progress--${this.intent()}`);

    return classes.join(' ');
  }

  getIconName(): string {
    switch (this.type()) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'danger':
        return 'x-circle';
      case 'info':
      default:
        return 'info-circle';
    }
  }

  onDismiss(): void {
    this.visible.set(false);
    this.dismiss.emit();
  }

  onActionClick(): void {
    this.actionClick.emit();
  }
}
