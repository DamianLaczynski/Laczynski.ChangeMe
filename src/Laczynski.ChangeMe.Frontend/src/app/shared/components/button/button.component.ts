import { Component, input, output, model } from '@angular/core';
import { ButtonStyle, Size } from '../utils';

export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
})
export class ButtonComponent {
  variant = input<ButtonStyle>('secondary');
  size = input<Size>('medium');
  iconOnly = input<boolean>(false);
  selected = input<boolean>(false);

  type = input<ButtonType>('button');
  disabled = model<boolean>(false);
  fullWidth = input<boolean>(false);
  ariaLabel = input<string>();

  click = output<MouseEvent>();

  buttonClasses(): string {
    const classes = ['button'];

    classes.push(`button--${this.variant()}`);
    classes.push(`button--${this.size()}`);

    if (this.iconOnly()) {
      classes.push('button--icon-only');
    }

    if (this.disabled()) {
      classes.push('button--disabled');
    }

    if (this.selected()) {
      classes.push('button--selected');
    }

    if (this.fullWidth()) {
      classes.push('button--full-width');
    }

    return classes.join(' ');
  }

  buttonState(): string {
    if (this.disabled()) {
      return 'disabled';
    }
    if (this.selected()) {
      return 'selected';
    }
    return 'rest';
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
