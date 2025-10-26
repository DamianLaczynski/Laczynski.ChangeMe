import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeColor, BadgeSize, BadgeAppearance } from '../utils';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class BadgeComponent {
  color = input<BadgeColor>('brand');
  size = input<BadgeSize>('medium');
  appearance = input<BadgeAppearance>('filled');
  text = input.required<string>();
  showIcon = input<boolean>(false);
  ariaLabel = input<string>('');

  get badgeClasses(): string {
    const classes = ['badge'];

    classes.push(`badge--${this.color()}`);
    classes.push(`badge--${this.size()}`);
    classes.push(`badge--${this.appearance()}`);

    return classes.join(' ');
  }

  get iconSize(): number {
    switch (this.size()) {
      case 'small':
        return 12;
      case 'medium':
        return 12;
      case 'large':
        return 16;
      case 'extra-large':
        return 20;
      default:
        return 12;
    }
  }
}
