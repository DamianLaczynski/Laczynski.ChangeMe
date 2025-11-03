import {
  Component,
  forwardRef,
  input,
  model,
  output,
  OnInit,
  ViewChild,
  ElementRef,
  effect,
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
  valueModel = model<number>();

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
    const valueOffset = this.currentValue - this.min();
    return (valueOffset / range) * 100;
  }

  getThumbPosition(): number {
    return this.getFillPercentage();
  }

  get currentValue(): number {
    return this.valueModel() !== undefined && this.valueModel() !== null
      ? this.valueModel()!
      : this.value;
  }

  private setCurrentValue(value: number): void {
    if (this.valueModel() !== undefined && this.valueModel() !== null) {
      this.valueModel.set(value);
    } else {
      this.value = value;
    }
    this.onChange(value);
  }

  onSliderInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);

    // Validate the value before setting
    if (isFinite(newValue) && !isNaN(newValue)) {
      this.setCurrentValue(newValue);
    }
  }

  onSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);

    // Validate the value before setting and emitting
    if (isFinite(newValue) && !isNaN(newValue)) {
      this.setCurrentValue(newValue);
      this.change.emit(newValue);
    }
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
      const numValue = parseFloat(value);
      if (this.valueModel() !== undefined && this.valueModel() !== null) {
        this.valueModel.set(numValue);
      } else {
        this.value = numValue;
      }
    } else {
      const minValue = this.min();
      if (this.valueModel() !== undefined && this.valueModel() !== null) {
        this.valueModel.set(minValue);
      } else {
        this.value = minValue;
      }
    }
  }

  setValue(value: number): void {
    this.setCurrentValue(value);
    this.change.emit(value);
  }
}
