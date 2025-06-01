import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../../ui/button';
import { AlertVariant, getAlertVariantDefinition } from './alert.model';

@Component({
  selector: 'ds-alert',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ds-alert" [class]="alertClasses()" [attr.data-variant]="variant()">
      <div class="ds-alert-icon">
        {{ currentVariantDefinition().icon }}
      </div>

      <div class="ds-alert-content">
        @if (title()) {
          <div class="ds-alert-title">{{ title() }}</div>
        }
        <div class="ds-alert-message">
          <ng-content></ng-content>
        </div>
      </div>

      @if (dismissible()) {
        <ds-button
          variant="ghost"
          size="sm"
          customClasses="ds-alert-close"
          ariaLabel="Dismiss alert"
          (clicked)="handleDismiss()"
        >
          ×
        </ds-button>
      }
    </div>
  `,
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string>('');
  readonly dismissible = input<boolean>(false);

  readonly dismissed = output<void>();

  readonly currentVariantDefinition = computed(() => getAlertVariantDefinition(this.variant()));

  readonly alertClasses = computed(() => {
    const classes = ['ds-alert'];
    classes.push(this.currentVariantDefinition().className);
    return classes.join(' ');
  });

  handleDismiss(): void {
    this.dismissed.emit();
  }
}
