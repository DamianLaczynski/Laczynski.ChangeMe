import { Component, input, contentChild, TemplateRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Size, SpinnerSize } from '../utils';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.component.html',
  imports: [CommonModule, SpinnerComponent],
})
export class LoadingStateComponent {
  // Inputs
  title = input<string>('');
  description = input<string>('');
  spinnerSize = input<SpinnerSize>('medium');
  size = input<Size, Size | undefined>('medium', {
    transform: (value: Size | undefined) => value ?? 'medium',
  });
  overlay = input<boolean>(false);
  blurContent = input<boolean>(true);
  fullScreen = input<boolean>(false);

  // Content projection
  customContent = contentChild<TemplateRef<any>>('customContent');
  customSpinner = contentChild<TemplateRef<any>>('customSpinner');

  // Methods
  loadingStateClasses = computed(() => {
    const classes = ['loading-state'];
    classes.push(`loading-state--${this.size()}`);

    if (this.overlay()) {
      classes.push('loading-state--overlay');
    }

    return classes.join(' ');
  });

  wrapperClasses = computed(() => {
    if (this.overlay() && !this.fullScreen()) {
      return 'loading-state__wrapper';
    }
    return '';
  });

  overlayClasses = computed(() => {
    const classes = ['loading-state__overlay'];

    if (this.fullScreen()) {
      classes.push('loading-state__overlay--fullscreen');
    }

    if (this.blurContent()) {
      classes.push('loading-state__overlay--blur');
    }

    return classes.join(' ');
  });

  hasSpinner(): boolean {
    return !!this.customSpinner();
  }

  hasTitle(): boolean {
    return !!this.title();
  }

  hasDescription(): boolean {
    return !!this.description();
  }

  hasCustomContent(): boolean {
    return !!this.customContent();
  }
}
