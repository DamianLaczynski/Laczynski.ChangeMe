import { Component, input, contentChild, TemplateRef, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Size, SpinnerSize } from '../utils';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.component.html',
  imports: [CommonModule, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  // Inputs
  title = input<string>('');
  description = input<string>('');
  size = input<Size, Size | undefined>('medium', {
    transform: (value: Size | undefined) => value ?? 'medium',
  });
  overlay = input<boolean>(false);
  blurContent = input<boolean>(true);
  fullScreen = input<boolean>(false);
  isLoading = input<boolean>(false);

  // Content projection
  content = contentChild<TemplateRef<any>>('content');

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

  hasTitle(): boolean {
    return !!this.title();
  }

  hasDescription(): boolean {
    return !!this.description();
  }
}
