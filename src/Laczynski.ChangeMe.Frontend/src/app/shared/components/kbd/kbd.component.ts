import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Size } from '../utils';

@Component({
  selector: 'app-kbd',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kbd.component.html',
})
export class KbdComponent {
  text = input.required<string>();
  size = input<Size>('medium');
  appearance = input<'default' | 'filled'>('default');

  get kbdClasses(): string {
    const classes = ['kbd'];

    classes.push(`kbd--${this.size()}`);
    classes.push(`kbd--${this.appearance()}`);

    return classes.join(' ');
  }
}


