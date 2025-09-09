import { Component, input, output, model } from '@angular/core';
import { Intent, Size, Variant } from '../utils';

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
})
export class ButtonComponent {
  intent = input<Intent>('primary');
  variant = input<Variant>('solid');
  size = input<Size>('md');
  type = input<ButtonType>('button');
  disabled = model<boolean>(false);
  fullWidth = input<boolean>(false);
  ariaLabel = input<string>();

  click = output<MouseEvent>();

  buttonClasses(): string {
    const classes = ['button'];

    classes.push(`button--${this.intent()}`);
    classes.push(`button--${this.variant()}`);
    classes.push(`button--${this.size()}`);

    if (this.fullWidth()) {
      classes.push('button--full-width');
    }

    return classes.join(' ');
  }

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.click.emit(event);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
