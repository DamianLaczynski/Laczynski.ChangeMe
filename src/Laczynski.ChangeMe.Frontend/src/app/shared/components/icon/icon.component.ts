import { Component, computed, input } from '@angular/core';
import { Size } from '../utils';

@Component({
  selector: 'app-icon',
  template: `
    <svg [attr.width]="getNumberSize() + 'px'" [attr.height]="getNumberSize() + 'px'" alt="Icon">
      <use
        [attr.href]="iconSrc()"
        [attr.fill]="'currentColor'"
        [attr.viewBox]="viewBox"
        [attr.width]="getNumberSize() + 'px'"
        [attr.height]="getNumberSize() + 'px'"
      ></use>
    </svg>
  `,
  styles: [
    `
      :host {
        width: min-content;
        height: min-content;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class IconComponent {
  icon = input<string, string | undefined>('', {
    transform: (value: string | undefined) => value ?? '',
  });
  size = input<Size, Size | undefined>('medium', {
    transform: (value: Size | undefined) => value ?? 'medium',
  });
  variant = input<'regular' | 'filled'>('regular');

  iconSrc = computed(() => {
    return `assets/icons/${this.icon()}_${this.getNumberSize()}_${this.variant()}.svg`;
  });

  get viewBox(): string {
    return `0 0 ${this.getNumberSize()} ${this.getNumberSize()}`;
  }

  getNumberSize(): number {
    switch (this.size()) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
    }
  }
}
