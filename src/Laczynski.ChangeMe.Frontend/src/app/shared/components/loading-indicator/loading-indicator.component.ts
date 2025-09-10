import { Component, input } from '@angular/core';
import { Intent, Size, Variant } from '../utils';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
})
export class LoadingIndicatorComponent {
  intent = input<Intent>('primary');
  size = input<Size>('md');
  text = input<string>('');
  showText = input<boolean>(true);
  overlay = input<boolean>(false);

  loadingClasses(): string {
    const classes = ['loading-indicator'];

    classes.push(`loading-indicator--${this.intent()}`);
    classes.push(`loading-indicator--${this.size()}`);

    if (this.overlay()) {
      classes.push('loading-indicator--overlay');
    }

    return classes.join(' ');
  }

  spinnerClasses(): string {
    const classes = ['loading-indicator__spinner'];

    classes.push(`loading-indicator__spinner--${this.intent()}`);

    return classes.join(' ');
  }
}
