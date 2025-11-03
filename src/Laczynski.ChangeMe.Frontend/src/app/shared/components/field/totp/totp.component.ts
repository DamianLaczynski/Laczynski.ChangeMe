import {
  Component,
  forwardRef,
  ViewChildren,
  QueryList,
  ElementRef,
  signal,
  computed,
  input,
  OnInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { FieldComponent } from '../field/field.component';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-totp',
  standalone: true,
  imports: [FieldComponent, CommonModule, NgClass],
  templateUrl: './totp.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TotpComponent),
      multi: true,
    },
  ],
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class TotpComponent extends FieldComponent implements OnInit, ControlValueAccessor {
  digitsCount = input<number>(6);

  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // Internal state for each digit
  digits = signal<string[]>(['', '', '', '', '', '']);

  // Computed full code value
  fullCode = computed(() => {
    return this.digits().join('');
  });

  override ngOnInit(): void {
    super.ngOnInit();
    // Initialize digits array based on digitsCount
    const count = this.digitsCount();
    this.digits.set(new Array(count).fill(''));
  }

  onDigitInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // Only allow single digit (0-9)
    if (value.length > 1) {
      // Handle paste - split into digits
      const digits = value.replace(/\D/g, '').slice(0, this.digitsCount());
      this.fillDigits(digits);
      return;
    }

    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      target.value = this.digits()[index];
      return;
    }

    // Update digit
    const currentDigits = [...this.digits()];
    currentDigits[index] = value;
    this.digits.set(currentDigits);

    // Move to next field if digit entered
    if (value && index < this.digitsCount() - 1) {
      this.focusNext(index);
    }

    // Update value and emit
    this.updateValue();
  }

  onDigitKeyDown(event: KeyboardEvent, index: number): void {
    const target = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace') {
      const currentValue = this.digits()[index];

      // If field has value, allow default behavior to clear it
      // The onInput handler will update our state
      if (currentValue) {
        // Don't prevent default - let browser clear the input normally
        // The input event will handle state update
      }
      // If field is empty, move to previous and clear it
      else if (index > 0) {
        event.preventDefault();
        const currentDigits = [...this.digits()];
        currentDigits[index - 1] = '';
        this.digits.set(currentDigits);
        this.updateValue();

        // Update the previous input element value
        const prevInput = this.digitInputs.toArray()[index - 1];
        if (prevInput) {
          prevInput.nativeElement.value = '';
        }

        this.focusPrevious(index);
      }
    }
    // Handle delete - clear current and stay
    else if (event.key === 'Delete') {
      const currentDigits = [...this.digits()];
      currentDigits[index] = '';
      this.digits.set(currentDigits);
      this.updateValue();
    }
    // Handle arrow keys
    else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusPrevious(index);
    } else if (event.key === 'ArrowRight' && index < this.digitsCount() - 1) {
      event.preventDefault();
      this.focusNext(index);
    }
    // Handle paste
    else if (event.ctrlKey && event.key === 'v') {
      // Let paste happen, then handle in onPaste
    }
  }

  onDigitPaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, this.digitsCount());

    if (digits.length > 0) {
      this.fillDigits(digits, index);
    }
  }

  onDigitFocus(event: FocusEvent): void {
    super.onFocus(event);
    const target = event.target as HTMLInputElement;
    // Select all text on focus for easy replacement
    target.select();
  }

  private fillDigits(digits: string, startIndex: number = 0): void {
    const currentDigits = [...this.digits()];
    const count = this.digitsCount();

    for (let i = 0; i < digits.length && startIndex + i < count; i++) {
      currentDigits[startIndex + i] = digits[i];
    }

    this.digits.set(currentDigits);
    this.updateValue();

    // Focus the next empty field or the last field
    const nextIndex = Math.min(startIndex + digits.length, count - 1);
    setTimeout(() => {
      this.focusInput(nextIndex);
    }, 0);
  }

  private focusNext(currentIndex: number): void {
    if (currentIndex < this.digitsCount() - 1) {
      this.focusInput(currentIndex + 1);
    }
  }

  private focusPrevious(currentIndex: number): void {
    if (currentIndex > 0) {
      this.focusInput(currentIndex - 1);
    }
  }

  private focusInput(index: number): void {
    const inputs = this.digitInputs.toArray();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }

  private updateValue(): void {
    const code = this.fullCode();
    this.value = code;
    this.onChange(code);
    this.change.emit(code);
  }

  override writeValue(value: any): void {
    if (!value) {
      const count = this.digitsCount();
      this.digits.set(new Array(count).fill(''));
      this.value = '';
      return;
    }

    const valueStr = String(value).replace(/\D/g, '');
    const count = this.digitsCount();
    const digits = valueStr.slice(0, count).split('');

    // Pad with empty strings if needed
    while (digits.length < count) {
      digits.push('');
    }

    this.digits.set(digits.slice(0, count));
    this.value = this.fullCode();
  }

  getDigitValue(index: number): string {
    return this.digits()[index] || '';
  }

  getTotpContainerClasses(): string {
    return `totp-container totp-container--${this.size()}`;
  }

  // Override wrapperClasses to get it from FieldComponent
  override get wrapperClasses(): string {
    const classes = [`input-wrapper--${this.size()}`, `input-wrapper--${this.variant()}`];

    classes.push(`input-wrapper--${this.state()}`);

    if (this.disabled()) {
      classes.push('input-wrapper--disabled');
    }

    if (this.readonly()) {
      classes.push('input-wrapper--read-only');
    }

    return classes.join(' ');
  }
}
