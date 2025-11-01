import { Component, input, output, model, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { CardStyle, QuickAction } from '../utils';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',

  imports: [CommonModule, ButtonComponent, IconComponent],
})
export class CardComponent {
  // Inputs
  title = input<string>('');
  subtitle = input<string>('');
  bodyText = input<string>('');
  style = input<CardStyle>('filled');
  disabled = model<boolean>(false);
  clickable = input<boolean>(false);
  orientation = input<'vertical' | 'horizontal'>('vertical');

  // Header
  showHeader = input<boolean>(true);
  headerIcon = input<string>('');
  showQuickAction = input<boolean>(false);

  // Footer
  showFooter = input<boolean>(true);
  primaryAction = input<QuickAction | null>(null);
  secondaryAction = input<QuickAction | null>(null);

  // Content projection
  customHeader = contentChild<TemplateRef<any>>('customHeader');
  customBody = contentChild<TemplateRef<any>>('customBody');
  customFooter = contentChild<TemplateRef<any>>('customFooter');
  quickActions = contentChild<TemplateRef<any>>('quickActions');

  // Outputs
  cardClick = output<MouseEvent>();
  quickActionClick = output<MouseEvent>();

  // Methods
  cardClasses(): string {
    const classes = ['card'];

    classes.push(`card--${this.style()}`);

    if (this.disabled()) {
      classes.push('card--disabled');
    }

    if (this.clickable()) {
      classes.push('card--clickable');
    }

    classes.push(`card--${this.orientation()}`);

    return classes.join(' ');
  }

  onCardClick(event: MouseEvent): void {
    if (this.disabled() || !this.clickable()) {
      return;
    }

    this.cardClick.emit(event);
  }

  onQuickActionClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.disabled()) {
      return;
    }

    this.quickActionClick.emit(event);
  }

  onPrimaryAction(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const action = this.primaryAction();
    if (action && !action.disabled && !this.disabled()) {
      action.action();
    }
  }

  onSecondaryAction(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    const action = this.secondaryAction();
    if (action && !action.disabled && !this.disabled()) {
      action.action();
    }
  }

  hasCustomContent(): boolean {
    return !!(this.customHeader() || this.customBody() || this.customFooter());
  }
}
