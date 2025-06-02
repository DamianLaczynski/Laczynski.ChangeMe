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
  effect,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import {
  ComponentSize,
  ComponentVariant,
  ComponentClickEvent,
  ComponentFocusEvent,
  AccessibilityConfig,
  ComponentState,
  generateComponentId,
  mergeClasses,
  createAccessibilityAttributes,
  getSizeConfiguration,
  isValidComponentSize,
  isValidComponentVariant,
} from '../shared';

/**
 * Button click event payload with additional button-specific data
 */
export interface ButtonClickEvent extends ComponentClickEvent<HTMLButtonElement> {
  /** Button variant that was clicked */
  variant: ComponentVariant;
  /** Button size that was clicked */
  size: ComponentSize;
  /** Whether button was in loading state */
  wasLoading: boolean;
}

/**
 * Button focus event payload
 */
export interface ButtonFocusEvent extends ComponentFocusEvent<HTMLButtonElement> {}

/**
 * Button configuration interface
 */
export interface ButtonConfig {
  /** Default button variant */
  defaultVariant: ComponentVariant;
  /** Default button size */
  defaultSize: ComponentSize;
  /** Whether to show loading spinner by default */
  defaultShowSpinner: boolean;
  /** Default tab index */
  defaultTabIndex: number;
  /** Whether buttons are full width by default */
  defaultFullWidth: boolean;
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
      [id]="componentId()"
      [type]="type()"
      [class]="computedClasses()"
      [disabled]="computedDisabled()"
      [style.cursor]="computedCursor()"
      [attr.aria-label]="accessibilityAttributes()['aria-label']"
      [attr.aria-describedby]="accessibilityAttributes()['aria-describedby']"
      [attr.aria-pressed]="accessibilityAttributes()['aria-pressed']"
      [attr.aria-expanded]="accessibilityAttributes()['aria-expanded']"
      [attr.aria-controls]="accessibilityAttributes()['aria-controls']"
      [attr.role]="accessibilityAttributes()['role']"
      [attr.tabindex]="effectiveTabIndex()"
      (click)="handleClick($event)"
      (focus)="handleFocus($event)"
      (blur)="handleBlur($event)"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
      (mousedown)="handleMouseDown()"
      (mouseup)="handleMouseUp()"
    >
      @if (loading() && showLoadingSpinner()) {
        <span
          class="ds-button__spinner"
          aria-hidden="true"
          role="status"
          [attr.aria-label]="loadingAriaLabel()"
        >
          <span class="ds-button__spinner-icon"></span>
        </span>
      }

      @if (iconStart() && !loading()) {
        <span
          class="ds-button__icon ds-button__icon--start"
          aria-hidden="true"
          [innerHTML]="iconStart()"
        >
        </span>
      }

      <span
        class="ds-button__content"
        [class.visually-hidden]="loading() && hideContentOnLoading()"
      >
        <ng-content></ng-content>
      </span>

      @if (iconEnd() && !loading()) {
        <span
          class="ds-button__icon ds-button__icon--end"
          aria-hidden="true"
          [innerHTML]="iconEnd()"
        >
        </span>
      }
    </button>
  `,
  styleUrl: './button.component.scss',
  host: {
    '[class.ds-button-host]': 'true',
    '[class.ds-button-host--loading]': 'loading()',
    '[class.ds-button-host--disabled]': 'computedDisabled()',
    '[class.ds-button-host--focused]': 'componentState().isFocused',
    '[class.ds-button-host--hovered]': 'componentState().isHovered',
  },
})
export class ButtonComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUT SIGNALS
  // =============================================================================

  /** Button variant style */
  variant = input<ComponentVariant>('primary');

  /** Button size */
  size = input<ComponentSize>('md');

  /** Button type attribute */
  type = input<'button' | 'submit' | 'reset'>('button');

  /** Whether button is disabled */
  disabled = input<boolean>(false);

  /** Whether button is in loading state */
  loading = input<boolean>(false);

  /** Whether to show loading spinner when loading */
  showLoadingSpinner = input<boolean>(true);

  /** Whether to hide content when loading */
  hideContentOnLoading = input<boolean>(false);

  /** Icon to display at start of button */
  iconStart = input<string>('');

  /** Icon to display at end of button */
  iconEnd = input<string>('');

  /** Full width button */
  fullWidth = input<boolean>(false);

  /** Custom CSS classes */
  customClasses = input<string>('');

  /** ARIA label for accessibility */
  ariaLabel = input<string>('');

  /** ARIA described by for accessibility */
  ariaDescribedBy = input<string>('');

  /** ARIA controls for accessibility */
  ariaControls = input<string>('');

  /** ARIA pressed state for toggle buttons */
  pressed = input<boolean | undefined>(undefined);

  /** ARIA expanded state for dropdown buttons */
  expanded = input<boolean | undefined>(undefined);

  /** Tab index */
  tabIndex = input<number>(0);

  /** Loading ARIA label */
  loadingAriaLabel = input<string>('Loading...');

  // =============================================================================
  // OUTPUT SIGNALS
  // =============================================================================

  /** Emitted when button is clicked */
  clicked = output<ButtonClickEvent>();

  /** Emitted when button receives focus */
  focused = output<ButtonFocusEvent>();

  /** Emitted when button loses focus */
  blurred = output<ButtonFocusEvent>();

  // =============================================================================
  // VIEW CHILD SIGNALS
  // =============================================================================

  /** Button element reference */
  buttonRef = viewChild.required<ElementRef<HTMLButtonElement>>('buttonRef');

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Unique component ID */
  componentId = signal(generateComponentId('ds-button'));

  /** Internal component state */
  componentState = signal<ComponentState>({
    isFocused: false,
    isHovered: false,
    isActive: false,
    isDisabled: false,
    isLoading: false,
    variant: 'primary',
    size: 'md',
  });

  // =============================================================================
  // COMPUTED SIGNALS
  // =============================================================================

  /** Computed disabled state considering loading */
  computedDisabled = computed(() => this.disabled() || this.loading());

  /** Computed cursor style */
  computedCursor = computed(() => {
    if (this.computedDisabled()) return 'not-allowed';
    if (this.loading()) return 'wait';
    return 'pointer';
  });

  /** Effective tab index considering disabled state */
  effectiveTabIndex = computed(() => {
    if (this.computedDisabled()) return -1;
    return this.tabIndex();
  });

  /** Computed accessibility attributes */
  accessibilityAttributes = computed(() => {
    const config: AccessibilityConfig = {
      ariaLabel: this.ariaLabel() || undefined,
      ariaDescribedBy: this.ariaDescribedBy() || undefined,
      ariaControls: this.ariaControls() || undefined,
      ariaPressed: this.pressed(),
      ariaExpanded: this.expanded(),
    };
    return createAccessibilityAttributes(config);
  });

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

    if (this.componentState().isFocused) {
      classes.push('ds-button--focused');
    }

    if (this.componentState().isHovered) {
      classes.push('ds-button--hovered');
    }

    if (this.componentState().isActive) {
      classes.push('ds-button--active');
    }

    return mergeClasses(...classes, this.customClasses());
  });

  // =============================================================================
  // EFFECTS
  // =============================================================================

  constructor() {
    // Update component state when inputs change
    effect(() => {
      this.componentState.update(state => ({
        ...state,
        isDisabled: this.computedDisabled(),
        isLoading: this.loading(),
        variant: this.variant(),
        size: this.size(),
      }));
    });
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /**
   * Programmatically focus the button
   */
  focus(): void {
    try {
      this.buttonRef()?.nativeElement.focus();
    } catch (error) {
      console.warn('Failed to focus button:', error);
    }
  }

  /**
   * Programmatically blur the button
   */
  blur(): void {
    try {
      this.buttonRef()?.nativeElement.blur();
    } catch (error) {
      console.warn('Failed to blur button:', error);
    }
  }

  /**
   * Programmatically click the button
   */
  click(): void {
    if (!this.computedDisabled()) {
      try {
        this.buttonRef()?.nativeElement.click();
      } catch (error) {
        console.warn('Failed to click button:', error);
      }
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

  /**
   * Get current component state
   */
  getState(): ComponentState {
    return { ...this.componentState() };
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
      element: buttonElement,
      timestamp: Date.now(),
      variant: this.variant(),
      size: this.size(),
      wasLoading: this.loading(),
    };

    this.clicked.emit(clickEvent);
  }

  /**
   * Handle button focus events
   */
  protected handleFocus(event: FocusEvent): void {
    this.componentState.update(state => ({ ...state, isFocused: true }));

    const buttonElement = this.buttonRef()?.nativeElement;
    if (!buttonElement) return;

    const focusEvent: ButtonFocusEvent = {
      event,
      element: buttonElement,
      timestamp: Date.now(),
    };

    this.focused.emit(focusEvent);
  }

  /**
   * Handle button blur events
   */
  protected handleBlur(event: FocusEvent): void {
    this.componentState.update(state => ({ ...state, isFocused: false }));

    const buttonElement = this.buttonRef()?.nativeElement;
    if (!buttonElement) return;

    const blurEvent: ButtonFocusEvent = {
      event,
      element: buttonElement,
      timestamp: Date.now(),
    };

    this.blurred.emit(blurEvent);
  }

  /**
   * Handle mouse enter events
   */
  protected handleMouseEnter(): void {
    this.componentState.update(state => ({ ...state, isHovered: true }));
  }

  /**
   * Handle mouse leave events
   */
  protected handleMouseLeave(): void {
    this.componentState.update(state => ({ ...state, isHovered: false, isActive: false }));
  }

  /**
   * Handle mouse down events
   */
  protected handleMouseDown(): void {
    if (!this.computedDisabled()) {
      this.componentState.update(state => ({ ...state, isActive: true }));
    }
  }

  /**
   * Handle mouse up events
   */
  protected handleMouseUp(): void {
    this.componentState.update(state => ({ ...state, isActive: false }));
  }
}
