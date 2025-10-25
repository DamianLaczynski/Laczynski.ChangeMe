import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size, StateType } from '../utils';

export type ProgressBarType = 'determinate' | 'indeterminate';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class ProgressBarComponent {
  type = input<ProgressBarType>('determinate');
  size = input<Size>('medium');
  state = input<StateType | 'default'>('default');
  value = input(0, {
    transform: (value: number | undefined) => (value ? Math.max(0, Math.min(value, 100)) : 0),
  });
  ariaLabel = input<string>('Progress');
  ariaValueText = input<string>();

  progressBarClasses = computed(() => {
    const classes = ['progress-bar'];
    classes.push(`progress-bar--${this.type()}`);
    classes.push(`progress-bar--${this.size()}`);
    classes.push(`progress-bar--${this.state()}`);
    return classes.join(' ');
  });

  trackClasses = computed(() => {
    const classes = ['progress-bar__track'];
    if (this.type() === 'indeterminate') {
      classes.push('progress-bar__track--animated');
    }
    return classes.join(' ');
  });

  progressValue = computed(() => {
    const val = this.value();
    if (val < 0) return 0;
    if (val > 100) return 100;
    return val;
  });

  trackStyle = computed(() => {
    if (this.type() === 'determinate') {
      return { width: `${this.progressValue()}%` };
    }
    return {};
  });

  ariaValueNow = computed(() => {
    return this.type() === 'determinate' ? this.progressValue() : undefined;
  });

  ariaValueMin = computed(() => {
    return this.type() === 'determinate' ? 0 : undefined;
  });

  ariaValueMax = computed(() => {
    return this.type() === 'determinate' ? 100 : undefined;
  });
}
