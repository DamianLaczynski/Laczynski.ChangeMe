import { Component, input, output, model } from '@angular/core';
import { Intent, Size, Variant } from '../utils';
import { ToastPosition } from './models/toast.model';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/icon-name.type';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [IconComponent],
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

  getIconName(): IconName {
    switch (this.intent()) {
      case 'success':
        return 'checkmark_circle';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error_circle';
      case 'info':
      default:
        return 'info';
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
