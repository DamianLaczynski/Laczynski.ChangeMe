import { Component, input, signal, ElementRef, Renderer2, inject, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  host: {
    class: 'tooltip',
  },
})
export class TooltipComponent implements OnDestroy {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private tooltipId = `tooltip-${Math.random().toString(36).substring(2, 11)}`;

  text = input<string>('');
  position = input<TooltipPosition>('top');
  size = input<TooltipSize>('medium');
  disabled = input<boolean>(false);
  delay = input<number>(300);
  
  visible = signal<boolean>(false);
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  get tooltipIdValue(): string {
    return this.tooltipId;
  }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent): void {
    if (!this.disabled()) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    this.hideTooltip();
  }

  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent): void {
    if (!this.disabled()) {
      this.showTooltip();
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent): void {
    this.hideTooltip();
  }

  tooltipClasses(): string {
    const classes = ['tooltip__popup'];
    
    classes.push(`tooltip__popup--${this.position()}`);
    classes.push(`tooltip__popup--${this.size()}`);
    
    if (this.visible()) {
      classes.push('tooltip__popup--visible');
    }
    
    return classes.join(' ');
  }

  private showTooltip(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    
    if (!this.visible()) {
      this.showTimeout = setTimeout(() => {
        if (!this.disabled()) {
          this.visible.set(true);
          this.updateAriaAttributes();
        }
      }, this.delay());
    }
  }

  private hideTooltip(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    
    this.hideTimeout = setTimeout(() => {
      this.visible.set(false);
      this.removeAriaAttributes();
    }, 50);
  }

  private updateAriaAttributes(): void {
    const triggerElement = this.elementRef.nativeElement.querySelector('[aria-describedby], button, input, a') 
      || this.elementRef.nativeElement.firstElementChild;
    
    if (triggerElement) {
      this.renderer.setAttribute(triggerElement, 'aria-describedby', this.tooltipId);
    }
  }

  private removeAriaAttributes(): void {
    const triggerElement = this.elementRef.nativeElement.querySelector('[aria-describedby]');
    
    if (triggerElement) {
      this.renderer.removeAttribute(triggerElement, 'aria-describedby');
    }
  }

  ngOnDestroy(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }
}

