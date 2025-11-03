import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { Size } from '../utils';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  imports: [CommonModule, IconComponent],
})
export class RatingComponent {
  // Inputs
  value = input<number>(0);
  max = input<number>(5);
  size = input<Size, Size | undefined>('medium', {
    transform: (value: Size | undefined) => value ?? 'medium',
  });
  readOnly = input<boolean>(false);
  disabled = input<boolean>(false);
  allowHalf = input<boolean>(false);
  showValue = input<boolean>(false);

  // Outputs
  valueChange = output<number>();

  // Internal state for hover
  hoveredValue = signal<number | null>(null);

  // Computed properties
  stars = computed(() => {
    const maxValue = this.max();
    return Array.from({ length: maxValue }, (_, i) => i + 1);
  });

  displayValue = computed(() => {
    // In read-only mode, don't show hover effect
    if (this.readOnly()) {
      return this.value();
    }
    return this.hoveredValue() ?? this.value();
  });

  getRatingClasses(): string {
    const classes = ['rating'];
    classes.push(`rating--${this.size()}`);
    
    if (this.disabled()) {
      classes.push('rating--disabled');
    }
    
    if (this.readOnly()) {
      classes.push('rating--readonly');
    }
    
    return classes.join(' ');
  }

  isStarFilled(starIndex: number): boolean {
    const displayVal = this.displayValue();
    return starIndex <= displayVal;
  }

  isStarHalfFilled(starIndex: number): boolean {
    if (!this.allowHalf()) {
      return false;
    }
    const displayVal = this.displayValue();
    const diff = displayVal - (starIndex - 1);
    return diff > 0 && diff < 1;
  }

  onStarClick(starIndex: number): void {
    if (this.readOnly() || this.disabled()) {
      return;
    }
    this.valueChange.emit(starIndex);
    this.hoveredValue.set(null);
  }

  onStarHover(starIndex: number): void {
    if (this.readOnly() || this.disabled()) {
      return;
    }
    this.hoveredValue.set(starIndex);
  }

  onStarLeave(): void {
    if (this.readOnly() || this.disabled()) {
      return;
    }
    this.hoveredValue.set(null);
  }

  onHalfStarClick(starIndex: number, isLeftHalf: boolean): void {
    if (this.readOnly() || this.disabled() || !this.allowHalf()) {
      return;
    }
    const value = starIndex - (isLeftHalf ? 0.5 : 0);
    this.valueChange.emit(value);
    this.hoveredValue.set(null);
  }

  onHalfStarHover(starIndex: number, isLeftHalf: boolean): void {
    if (this.readOnly() || this.disabled() || !this.allowHalf()) {
      return;
    }
    const value = starIndex - (isLeftHalf ? 0.5 : 0);
    this.hoveredValue.set(value);
  }

  getAriaLabel(): string {
    const value = this.value();
    const max = this.max();
    return `Rating: ${value} out of ${max} stars`;
  }
}
