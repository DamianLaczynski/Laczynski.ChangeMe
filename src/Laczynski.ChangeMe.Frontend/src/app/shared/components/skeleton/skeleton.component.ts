import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonShape = 'rectangle' | 'circle';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',

  imports: [CommonModule],
})
export class SkeletonComponent {
  shape = input<SkeletonShape>('rectangle');
  animated = input<boolean>(true);
  width = input<string>('100%');
  height = input<string>('20px');
  borderRadius = input<string>('4px');

  skeletonClasses = computed(() => {
    const classes = ['skeleton'];

    classes.push(`skeleton--${this.shape()}`);

    if (this.animated()) {
      classes.push('skeleton--animated');
    }

    return classes.join(' ');
  });

  skeletonStyles = computed(() => {
    const styles: { [key: string]: string } = {
      width: this.width(),
      height: this.height(),
    };

    if (this.borderRadius()) {
      styles['border-radius'] = this.borderRadius();
    } else if (this.shape() === 'circle') {
      styles['border-radius'] = '9999px';
    }

    return styles;
  });
}
