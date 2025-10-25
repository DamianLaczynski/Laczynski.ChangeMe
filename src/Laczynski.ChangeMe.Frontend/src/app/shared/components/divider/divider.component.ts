import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerOrientation, DividerAlignment } from '../utils';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class DividerComponent {
  orientation = input<DividerOrientation>('horizontal');
  alignment = input<DividerAlignment>('center');
  text = input<string>('');
  ariaLabel = input<string>('');

  get dividerClasses(): string {
    const classes = ['divider'];

    classes.push(`divider--${this.orientation()}`);
    classes.push(`divider--${this.alignment()}`);

    if (this.hasText()) {
      classes.push('divider--with-text');
    }

    return classes.join(' ');
  }

  hasText(): boolean {
    return this.text() !== '';
  }

  get ariaLabelText(): string {
    return this.ariaLabel() || (this.hasText() ? this.text() : 'divider');
  }
}
