import {
  Component,
  forwardRef,
  input,
  model,
  output,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Size, StateType } from '../../utils';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-slider',
  imports: [CommonModule, FieldComponent],
  templateUrl: './slider.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent extends FieldComponent implements ControlValueAccessor, OnInit {
  @ViewChild('sliderInput') sliderInput!: ElementRef<HTMLInputElement>;

  // Component inputs

  // Slider-specific inputs
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  unit = input<string>('');
  formatValue = input<(value: number) => string>(value => value.toString());
  vertical = input<boolean>(false);

  protected _isDragging = false;

  get sliderClasses(): string {
    const classes = ['slider'];

    classes.push(`slider--${this.size()}`);
    classes.push(`slider--${this.state()}`);

    if (this.disabled()) {
      classes.push('slider--disabled');
    }

    if (this.readonly()) {
      classes.push('slider--readonly');
    }

    if (this._isDragging) {
      classes.push('slider--dragging');
    }

    if (this.vertical()) {
      classes.push('slider--vertical');
    }

    return classes.join(' ');
  }

  getFillPercentage(): number {
    const range = this.max() - this.min();
    const valueOffset = this.value - this.min();
    return (valueOffset / range) * 100;
  }

  getThumbPosition(): number {
    return this.getFillPercentage();
  }

  onSliderInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = parseFloat(target.value);
    this.onChange(this.value);
  }

  onSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = parseFloat(target.value);
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  override onBlur(event: FocusEvent): void {
    this._isFocused = false;
    this._isDragging = false;
    this.onTouched();
    this.blur.emit(event);
  }

  onMouseDown(): void {
    if (!this.disabled() && !this.readonly()) {
      this._isDragging = true;
    }
  }

  onMouseUp(): void {
    this._isDragging = false;
  }

  // ControlValueAccessor methods
  override writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.value = parseFloat(value);
    } else {
      this.value = this.min();
    }
  }

  setValue(value: number): void {
    this.value = value;
    this.onChange(this.value);
    this.change.emit(this.value);
  }
}
