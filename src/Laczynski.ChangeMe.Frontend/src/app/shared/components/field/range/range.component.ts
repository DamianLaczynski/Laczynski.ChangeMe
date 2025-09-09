import {
  Component,
  input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';

@Component({
  selector: 'app-range',
  imports: [FieldComponent, CommonModule],
  templateUrl: './range.component.html',
})
export class RangeComponent
  extends FieldComponent
  implements OnInit, OnDestroy
{
  @ViewChild('rangeInput') rangeInput!: ElementRef<HTMLInputElement>;

  // Range input properties
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  unit = input<string>('');
  showValue = input<boolean>(true);
  showLabels = input<boolean>(true);
  showSteps = input<boolean>(false);
  minLabel = input<string>('');
  maxLabel = input<string>('');
  formatValue = input<(value: number) => string>((value) => value.toString());

  getDisplayValue(): string {
    return this.formatValue()(this.value);
  }

  getMinLabel(): string {
    if (this.minLabel()) {
      return this.minLabel();
    }
    return this.formatValue()(this.min());
  }

  getMaxLabel(): string {
    if (this.maxLabel()) {
      return this.maxLabel();
    }
    return this.formatValue()(this.max());
  }

  getFillPercentage(): number {
    const range = this.max() - this.min();
    const value = this.value - this.min();
    return (value / range) * 100;
  }

  getThumbPosition(): number {
    return this.getFillPercentage();
  }

  getStepMarkers(): number[] {
    if (!this.showSteps()) {
      return [];
    }

    const steps: number[] = [];
    const range = this.max() - this.min();
    const stepCount = Math.floor(range / this.step());

    for (let i = 0; i <= stepCount; i++) {
      steps.push(this.min() + i * this.step());
    }

    return steps;
  }

  getStepPosition(index: number): number {
    const steps = this.getStepMarkers();
    if (steps.length === 0) return 0;

    const range = this.max() - this.min();
    const value = steps[index] - this.min();
    return (value / range) * 100;
  }

  isStepActive(index: number): boolean {
    const steps = this.getStepMarkers();
    if (steps.length === 0) return false;

    return Math.abs(steps[index] - this.value) < this.step() / 2;
  }

  override onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = parseFloat(target.value);

    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onRangeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = parseFloat(target.value);

    this.onChange(this.value);
    this.change.emit(this.value);
  }

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
