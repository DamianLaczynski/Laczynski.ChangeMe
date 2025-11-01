import { Component, input, output, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ScrollPanelOrientation = 'vertical' | 'horizontal' | 'both';
export type ScrollPanelBehavior = 'auto' | 'always' | 'never';

@Component({
  selector: 'app-scroll-panel',
  templateUrl: './scroll-panel.component.html',

  imports: [CommonModule],
})
export class ScrollPanelComponent {
  orientation = input<ScrollPanelOrientation>('vertical');
  scrollbarBehavior = input<ScrollPanelBehavior>('auto');
  maxHeight = input<string>('100%');
  maxWidth = input<string>('100%');
  ariaLabel = input<string>('');

  // Outputs
  scroll = output<Event>();
  scrollEnd = output<void>();

  // View children
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  private scrollTimeout?: ReturnType<typeof setTimeout>;

  constructor() {
    afterNextRender(() => {
      this.checkScrollbar();
    });
  }

  // Computed properties
  get scrollPanelClasses(): string {
    const classes = ['scroll-panel'];

    classes.push(`scroll-panel--${this.orientation()}`);
    classes.push(`scroll-panel--${this.scrollbarBehavior()}`);

    return classes.join(' ');
  }

  get scrollPanelStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    if (this.maxHeight()) {
      styles['max-height'] = this.maxHeight();
    }

    if (this.maxWidth()) {
      styles['max-width'] = this.maxWidth();
    }

    return styles;
  }

  get ariaLabelText(): string {
    return this.ariaLabel() || 'Scrollable content';
  }

  // Event handlers
  onScroll(event: Event): void {
    this.scroll.emit(event);

    // Debounce scroll end event
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      this.scrollEnd.emit();
    }, 150);
  }

  // Public methods
  scrollTo(options: ScrollToOptions): void {
    const container = this.scrollContainer()?.nativeElement;
    if (container) {
      container.scrollTo(options);
    }
  }

  scrollToTop(): void {
    this.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToBottom(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (container) {
      this.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }

  scrollToLeft(): void {
    this.scrollTo({ left: 0, behavior: 'smooth' });
  }

  scrollToRight(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (container) {
      this.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    }
  }

  private checkScrollbar(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    // Check if content overflows to add appropriate classes
    const hasVerticalScroll = container.scrollHeight > container.clientHeight;
    const hasHorizontalScroll = container.scrollWidth > container.clientWidth;

    if (hasVerticalScroll) {
      container.classList.add('scroll-panel__content--has-vertical-scroll');
    }

    if (hasHorizontalScroll) {
      container.classList.add('scroll-panel__content--has-horizontal-scroll');
    }
  }
}
