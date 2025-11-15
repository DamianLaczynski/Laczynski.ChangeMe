import { Component, input, output, contentChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonStyle, QuickAction, Size } from '../utils';
import { IconName } from '../icon';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  imports: [CommonModule, ButtonComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  // Inputs
  title = input<string>('');
  description = input<string>('');
  icon = input<IconName>('error_circle');
  size = input<Size, Size | undefined>('medium', {
    transform: (value: Size | undefined) => value ?? 'medium',
  });

  // Actions
  primaryAction = input<QuickAction | null>(null);
  secondaryAction = input<QuickAction | null>(null);

  // Content projection
  content = contentChild<TemplateRef<any>>('content');

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

  hasActions(): boolean {
    return !!(this.primaryAction() || this.secondaryAction());
  }
}
