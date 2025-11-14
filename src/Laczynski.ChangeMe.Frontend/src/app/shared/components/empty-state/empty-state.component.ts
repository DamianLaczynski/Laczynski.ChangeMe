import { Component, input, output, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { ButtonStyle, QuickAction, Size } from '../utils';
import { IconName } from '../icon';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  imports: [CommonModule, ButtonComponent, IconComponent],
})
export class EmptyStateComponent {
  // Inputs
  title = input<string>('');
  description = input<string>('');
  icon = input<IconName | undefined>(undefined);
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
  emptyStateClasses(): string {
    const classes = ['empty-state'];
    classes.push(`empty-state--${this.size()}`);
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
