import { Component, input, output } from '@angular/core';
import { RadioLayout, Size } from '../../utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radio',
  imports: [CommonModule],
  templateUrl: './radio.component.html',
  standalone: true,
})
export class RadioComponent {
  id = input.required<string | number>();
  name = input.required<string>();
  value = input.required<any>();
  label = input<string>('');
  layout = input<RadioLayout>('after');
  size = input<Size>('medium');
  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  readonly = input<boolean>(false);
  required = input<boolean>(false);
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');

  valueChange = output<any>();

  get isChecked(): boolean {
    return this.checked();
  }

  get radioClasses(): string {
    const classes = ['radio'];

    classes.push(`radio--${this.layout()}`);
    classes.push(this.isChecked ? 'radio--checked' : 'radio--unchecked');
    classes.push(`radio--${this.size()}`);

    if (this.disabled()) {
      classes.push('radio--disabled');
    }

    return classes.join(' ');
  }

  onRadioChange(event: Event): void {
    if (this.disabled() || this.readonly()) {
      event.preventDefault();
      return;
    }

    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.valueChange.emit(this.value());
    }
  }

  onRadioClick(event: MouseEvent): void {
    if (this.disabled() || this.readonly()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
