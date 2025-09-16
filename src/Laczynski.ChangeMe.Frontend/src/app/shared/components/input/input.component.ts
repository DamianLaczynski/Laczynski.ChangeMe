import { Component, Input, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'filled' | 'filled-gray' | 'filled-lighter' | 'underlined';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type LabelSize = 'small' | 'small-bold' | 'medium' | 'medium-bold' | 'large';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input-container">
      <label *ngIf="label" class="input-label" [ngClass]="labelClasses">
        {{ label }}
      </label>
      <div class="input-wrapper" [ngClass]="wrapperClasses">
        <input
          class="input"
          [ngClass]="wrapperClasses"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readOnly"
          [value]="value"
          [attr.aria-label]="ariaLabel || label"
          [attr.aria-describedby]="ariaDescribedBy"
          [attr.aria-invalid]="error"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (keydown)="onKeyDown($event)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() size: InputSize = 'medium';
  @Input() variant: InputVariant = 'filled';
  @Input() error: boolean = false;
  @Input() errorMessage: string = '';
  @Input() ariaLabel: string = '';
  @Input() ariaDescribedBy: string = '';
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() pattern: string | null = null;
  @Input() required: boolean = false;
  @Input() label: string = '';
  @Input() labelSize: LabelSize = 'medium';
  @Input() readOnly: boolean = false;

  value: string = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get wrapperClasses(): string {
    const classes = [`input-wrapper--${this.size}`, `input-wrapper--${this.variant}`];

    if (this.error) {
      classes.push('input-wrapper--error');
    }

    if (this.disabled) {
      classes.push('input-wrapper--disabled');
    }

    return classes.join(' ');
  }

  get labelClasses(): string {
    const classes = [`input-label--${this.labelSize}`];

    if (this.disabled) {
      classes.push('input-label--disabled');
    }

    if (this.required) {
      classes.push('input-label--required');
    }

    return classes.join(' ');
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(): void {
    // Focus handling if needed
  }

  onKeyDown(event: KeyboardEvent): void {
    // Handle special key combinations if needed
    if (event.key === 'Enter' && this.type === 'search') {
      // Emit search event or handle search
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setReadOnlyState(isReadOnly: boolean): void {
    this.readOnly = isReadOnly;
  }
}
