import { Component, input, output, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonStyle, QuickAction, Size } from '../utils';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  imports: [CommonModule, ButtonComponent, IconComponent],
})
export class ErrorStateComponent {
  // Inputs
  title = input<string>('');
  description = input<string>('');
  icon = input<string>('error_circle');
  size = input<Size, Size | undefined>('medium', {
    transform: (value: Size | undefined) => value ?? 'medium',
  });

  // Actions
  primaryAction = input<QuickAction | null>(null);
  secondaryAction = input<QuickAction | null>(null);

  // Content projection
  customContent = contentChild<TemplateRef<any>>('customContent');
  customIcon = contentChild<TemplateRef<any>>('customIcon');

  // Outputs
  actionClick = output<QuickAction>();

  // Methods
  errorStateClasses(): string {
    const classes = ['error-state'];
    classes.push(`error-state--${this.size()}`);
    return classes.join(' ');
  }

  onActionClick(action: QuickAction, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (action.disabled) {
      return;
    }

    this.actionClick.emit(action);

    if (action.action) {
      action.action();
    }
  }

  hasIcon(): boolean {
    return !!this.icon() || !!this.customIcon();
  }

  hasActions(): boolean {
    return !!(this.primaryAction() || this.secondaryAction());
  }
}
