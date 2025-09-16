import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { ToastMessage, ToastPosition } from './models/toast.model';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div [class]="containerClasses()">
      @for (toast of toasts(); track toast.id) {
        <app-toast
          [title]="toast.title"
          [message]="toast.message"
          [intent]="toast.intent || 'info'"
          [size]="toast.size || 'medium'"
          [variant]="toast.variant || 'solid'"
          [showIcon]="toast.showIcon !== false"
          [dismissible]="toast.dismissible !== false"
          [showProgress]="toast.showProgress !== false"
          [duration]="toast.duration || 5000"
          (dismiss)="onToastDismiss(toast)"
        />
      }
    </div>
  `,
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  toasts = this.toastService.toasts;
  // Inputs
  position = input<ToastPosition>('top-right');

  containerClasses(): string {
    return `toast-container toast-container--${this.position()}`;
  }

  onToastDismiss(toast: ToastMessage): void {
    this.toastService.remove(toast.id!);
  }
}
