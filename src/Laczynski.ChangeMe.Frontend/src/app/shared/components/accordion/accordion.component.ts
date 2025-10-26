import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../utils';

export type ChevronPosition = 'before' | 'after';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AccordionComponent {
  title = input.required<string>();
  size = input<Size>('medium');
  chevronPosition = input<ChevronPosition>('before');
  disabled = input<boolean>(false);
  expanded = signal<boolean>(false);
  showIcon = input<boolean>(false);

  toggle = output<boolean>();

  accordionClasses(): string {
    const classes = [];

    classes.push(`accordion--${this.size()}`);
    classes.push(`accordion--chevron-${this.chevronPosition()}`);

    if (this.expanded()) {
      classes.push('accordion--expanded');
    }

    if (this.disabled()) {
      classes.push('accordion--disabled');
    }

    return classes.join(' ');
  }

  onToggle(): void {
    if (this.disabled()) {
      return;
    }

    this.expanded.set(!this.expanded());
    this.toggle.emit(this.expanded());
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onToggle();
    }
  }

  getChevronRotation(): string {
    if (this.expanded()) {
      return this.chevronPosition() === 'before' ? 'rotate(0deg)' : 'rotate(180deg)';
    } else {
      return this.chevronPosition() === 'before' ? 'rotate(-90deg)' : 'rotate(0deg)';
    }
  }
}
