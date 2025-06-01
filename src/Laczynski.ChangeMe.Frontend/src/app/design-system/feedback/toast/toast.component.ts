import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../ui/button';
import { ToastVariant, ToastAnimation, Toast, getToastVariantDefinition } from './toast.model';

/**
 * Toast Component
 *
 * A notification component for displaying temporary messages.
 */
@Component({
  selector: 'ds-toast',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ds-toast"
      [class]="toastClasses()"
      [attr.data-variant]="variant()"
      [attr.data-animation]="animation()"
    >
      <div class="ds-toast-icon">
        {{ currentVariantDefinition().icon }}
      </div>

      <div class="ds-toast-content">
        @if (title()) {
          <div class="ds-toast-title">{{ title() }}</div>
        }
        <div class="ds-toast-message">{{ message() }}</div>
      </div>

      @if (showCloseButton()) {
        <ds-button
          variant="ghost"
          size="sm"
          customClasses="ds-toast-close"
          ariaLabel="Close notification"
          (clicked)="handleClose()"
        >
          ×
        </ds-button>
      }
    </div>
  `,
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  // =============================================================================
  // INPUTS
  // =============================================================================

  readonly variant = input<ToastVariant>('info');
  readonly animation = input<ToastAnimation>('slide');
  readonly title = input<string>('');
  readonly message = input<string>('');
  readonly showCloseButton = input<boolean>(true);

  // =============================================================================
  // OUTPUTS
  // =============================================================================

  readonly closed = output<void>();

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  readonly currentVariantDefinition = computed(() => getToastVariantDefinition(this.variant()));

  readonly toastClasses = computed(() => {
    const classes = ['ds-toast'];
    classes.push(this.currentVariantDefinition().className);
    return classes.join(' ');
  });

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  handleClose(): void {
    this.closed.emit();
  }
}
