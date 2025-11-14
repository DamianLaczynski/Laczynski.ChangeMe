import { Component, input } from '@angular/core';
import { BadgeColor, BadgeAppearance, Size } from '../utils';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',

  imports: [IconComponent],
})
export class BadgeComponent {
  color = input<BadgeColor>('brand');
  size = input<Size>('medium');
  appearance = input<BadgeAppearance>('filled');
  text = input.required<string>();
  icon = input<IconName | undefined>(undefined);
  ariaLabel = input<string>('');

  get badgeClasses(): string {
    const classes = ['badge'];

    classes.push(`badge--${this.color()}`);
    classes.push(`badge--${this.size()}`);
    classes.push(`badge--${this.appearance()}`);

    return classes.join(' ');
  }
}
