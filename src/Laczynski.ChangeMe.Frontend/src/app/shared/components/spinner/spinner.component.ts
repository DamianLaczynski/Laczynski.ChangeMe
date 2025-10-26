import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerSize, SpinnerLabelPosition, StateType } from '../utils';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SpinnerComponent {
  size = input<SpinnerSize>('medium');
  state = input<StateType | 'default' | 'inverted'>('default');
  labelPosition = input<SpinnerLabelPosition>('none');
  label = input<string>('');
  ariaLabel = input<string>('Loading');

  spinnerClasses = computed(() => {
    const classes = ['spinner'];

    classes.push(`spinner--${this.size()}`);
    classes.push(`spinner--${this.state()}`);

    if (this.labelPosition() !== 'none') {
      classes.push(`spinner--label-${this.labelPosition()}`);
    }

    return classes.join(' ');
  });

  get spinnerSize(): number {
    switch (this.size()) {
      case 'extra-tiny':
        return 16;
      case 'tiny':
        return 20;
      case 'extra-small':
        return 24;
      case 'small':
        return 28;
      case 'medium':
        return 32;
      case 'large':
        return 36;
      case 'extra-large':
        return 40;
      case 'huge':
        return 44;
      default:
        return 32;
    }
  }

  get labelClasses(): string {
    const classes = ['spinner__label'];

    // Font size based on size
    if (
      this.size() === 'extra-tiny' ||
      this.size() === 'tiny' ||
      this.size() === 'extra-small' ||
      this.size() === 'small'
    ) {
      classes.push('spinner__label--small');
    } else if (
      this.size() === 'medium' ||
      this.size() === 'large' ||
      this.size() === 'extra-large'
    ) {
      classes.push('spinner__label--medium');
    } else {
      classes.push('spinner__label--large');
    }

    classes.push(`spinner__label--label-${this.labelPosition()}`);

    return classes.join(' ');
  }

  hasLabel = computed(() => {
    return this.labelPosition() !== 'none' && this.label().length > 0;
  });
}
