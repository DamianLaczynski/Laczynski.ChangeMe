import {
  Component,
  computed,
  input,
  output,
  signal,
  DestroyRef,
  inject,
  ElementRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

/**
 * Button size variants
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button style variants
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'ghost'
  | 'link';

/**
 * Button click event payload
 */
export interface ButtonClickEvent {
  /** Original MouseEvent */
  event: MouseEvent;
  /** Button element reference */
  buttonElement: HTMLButtonElement;
  /** Timestamp of the click */
  timestamp: number;
}

/**
 * Modern Angular Button Component
 *
 * A fully accessible button component with multiple variants, sizes, and states.
 * Supports loading states, disabled states, and custom content projection.
 *
 * @example
 * ```html
 * <!-- Basic button -->
 * <ds-button>Click me</ds-button>
 *
 * <!-- Primary button with size -->
 * <ds-button variant="primary" size="lg">Large Primary</ds-button>
 *
 * <!-- Loading button -->
 * <ds-button [loading]="isLoading" (clicked)="handleClick($event)">
 *   Submit
 * </ds-button>
 * ```
 */
@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      #buttonRef
      [type]="type()"
      [class]="computedClasses()"
      [disabled]="computedDisabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy()"
      [attr.aria-pressed]="pressed() ? 'true' : null"
      [attr.aria-expanded]="expanded() ? 'true' : null"
      [attr.aria-controls]="ariaControls()"
      [attr.tabindex]="tabIndex()"
      (click)="handleClick($event)"
      (focus)="handleFocus($event)"
      (blur)="handleBlur($event)"
    >
      @if (loading() && showLoadingSpinner()) {
        <span class="ds-button__spinner" aria-hidden="true" role="status"> </span>
      }

      @if (iconStart() && !loading()) {
        <span class="ds-button__icon ds-button__icon--start" aria-hidden="true">
          {{ iconStart() }}
        </span>
      }

      <span class="ds-button__content">
        <ng-content></ng-content>
      </span>

      @if (iconEnd() && !loading()) {
        <span class="ds-button__icon ds-button__icon--end" aria-hidden="true">
          {{ iconEnd() }}
        </span>
      }
    </button>
  `,
  styleUrl: './button.component.scss',
  host: {
    '[class.ds-button-host]': 'true',
    '[class.ds-button-host--loading]': 'loading()',
    '[class.ds-button-host--disabled]': 'computedDisabled()',
  },
})
export class ButtonComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Button variant style */
  variant = input<ButtonVariant>('primary');

  /** Button size */
  size = input<ButtonSize>('md');

  /** Button type attribute */
  type = input<'button' | 'submit' | 'reset'>('button');

  /** Whether button is disabled */
  disabled = input<boolean>(false);

  /** Whether button is in loading state */
  loading = input<boolean>(false);

  /** Whether to show loading spinner when loading */
  showLoadingSpinner = input<boolean>(true);

  /** Icon to display at start of button */
  iconStart = input<string>();

  /** Icon to display at end of button */
  iconEnd = input<string>();

  /** Full width button */
  fullWidth = input<boolean>(false);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** ARIA label for accessibility */
  ariaLabel = input<string>();

  /** ARIA described by for accessibility */
  ariaDescribedBy = input<string>();

  /** ARIA controls for accessibility */
  ariaControls = input<string>();

  /** ARIA pressed state for toggle buttons */
  pressed = input<boolean>();

  /** ARIA expanded state for dropdown buttons */
  expanded = input<boolean>();

  /** Tab index */
  tabIndex = input<number>(0);

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Emitted when button is clicked */
  clicked = output<ButtonClickEvent>();

  /** Emitted when button receives focus */
  focused = output<FocusEvent>();

  /** Emitted when button loses focus */
  blurred = output<FocusEvent>();

  // =============================================================================
  // VIEW CHILD SIGNALS
  // =============================================================================

  /** Button element reference */
  buttonRef = viewChild.required<ElementRef<HTMLButtonElement>>('buttonRef');

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  /** Computed disabled state considering loading */
  computedDisabled = computed(() => this.disabled() || this.loading());

  /** Computed CSS classes */
  computedClasses = computed(() => {
    const classes = ['ds-button', `ds-button--${this.variant()}`, `ds-button--${this.size()}`];

    if (this.fullWidth()) {
      classes.push('ds-button--full-width');
    }

    if (this.loading()) {
      classes.push('ds-button--loading');
    }

    if (this.computedDisabled()) {
      classes.push('ds-button--disabled');
    }

    if (this.customClasses()) {
      classes.push(this.customClasses());
    }

    return classes.join(' ');
  });

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Internal focus state for debugging */
  private readonly isFocused = signal(false);

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /**
   * Programmatically focus the button
   */
  focus(): void {
    this.buttonRef()?.nativeElement.focus();
  }

  /**
   * Programmatically blur the button
   */
  blur(): void {
    this.buttonRef()?.nativeElement.blur();
  }

  /**
   * Programmatically click the button
   */
  click(): void {
    if (!this.computedDisabled()) {
      this.buttonRef()?.nativeElement.click();
    }
  }

  /**
   * Get button element dimensions
   */
  getDimensions(): { width: number; height: number } {
    const element = this.buttonRef()?.nativeElement;
    return {
      width: element?.offsetWidth || 0,
      height: element?.offsetHeight || 0,
    };
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /**
   * Handle button click events
   */
  protected handleClick(event: MouseEvent): void {
    if (this.computedDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const buttonElement = this.buttonRef()?.nativeElement;
    if (!buttonElement) return;

    const clickEvent: ButtonClickEvent = {
      event,
      buttonElement,
      timestamp: Date.now(),
    };

    this.clicked.emit(clickEvent);
  }

  /**
   * Handle button focus events
   */
  protected handleFocus(event: FocusEvent): void {
    this.isFocused.set(true);
    this.focused.emit(event);
  }

  /**
   * Handle button blur events
   */
  protected handleBlur(event: FocusEvent): void {
    this.isFocused.set(false);
    this.blurred.emit(event);
  }
}
