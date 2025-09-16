import { Component, input, output, model } from '@angular/core';
import { Intent, Size, Variant } from '../utils';
import { ToastPosition } from './models/toast.model';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
})
export class ToastComponent {
  title = input<string>('');
  message = input<string>('');
  intent = input<Intent>('info');
  size = input<Size>('medium');
  variant = input<Variant>('solid');
  duration = input<number>(5000);
  dismissible = input<boolean>(true);
  showIcon = input<boolean>(true);
  showProgress = input<boolean>(true);
  position = input<ToastPosition>('top-right');
  visible = model<boolean>(true);

  dismiss = output<void>();
  actionClick = output<void>();

  toastClasses(): string {
    const classes = ['toast'];

    classes.push(`toast--${this.intent()}`);
    classes.push(`toast--${this.size()}`);
    classes.push(`toast--${this.variant()}`);

    if (!this.visible()) {
      classes.push('toast--hidden');
    }

    return classes.join(' ');
  }

  iconClasses(): string {
    const classes = ['toast__icon'];

    classes.push(`toast__icon--${this.intent()}`);

    return classes.join(' ');
  }

  progressClasses(): string {
    const classes = ['toast__progress'];

    classes.push(`toast__progress--${this.intent()}`);

    return classes.join(' ');
  }

  getIconName(): string {
    switch (this.intent()) {
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
