import { Component, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagStyle, TagSize } from '../utils';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class TagComponent {
  // Component inputs
  tagStyle = input<TagStyle>('filled');
  size = input<TagSize>('medium');
  text = input.required<string>();
  selected = model<boolean>(false);
  disabled = input<boolean>(false);
  dismissible = input<boolean>(true);
  ariaLabel = input<string>('');

  // Component outputs
  dismiss = output<void>();
  tagClick = output<MouseEvent>();

  // Computed properties
  get tagClasses(): string {
    const classes = ['tag'];

    classes.push(`tag--${this.tagStyle()}`);
    classes.push(`tag--${this.size()}`);

    if (this.selected()) {
      classes.push('tag--selected');
    }

    if (this.disabled()) {
      classes.push('tag--disabled');
    }

    return classes.join(' ');
  }

  get dismissIconSize(): number {
    switch (this.size()) {
      case 'extra-small':
        return 12;
      case 'small':
        return 16;
      case 'medium':
        return 20;
      default:
        return 20;
    }
  }

  onTagClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }

    this.tagClick.emit(event);
  }

  onTagKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.tagClick.emit(event as any);
    }
  }

  onDismissClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }

    event.stopPropagation();
    this.dismiss.emit();
  }

  onDismissKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.dismiss.emit();
    }
  }
}
