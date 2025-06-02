import {
  Component,
  input,
  output,
  model,
  computed,
  signal,
  DestroyRef,
  inject,
  forwardRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ComponentSize } from '../shared';

import {
  SwitchConfig,
  SwitchVariant,
  SwitchState,
  SwitchChangeEvent,
  SwitchFocusEvent,
  SwitchKeyboardEvent,
  SwitchValidation,
  SwitchComponentState,
  createSwitchConfig,
  createSwitchState,
  createSwitchChangeEvent,
  createSwitchFocusEvent,
  createSwitchKeyboardEvent,
  validateSwitchValue,
  getSwitchState,
  getSwitchAriaAttributes,
  getSwitchClasses,
  generateSwitchId,
  isValidSwitchSize,
  isValidSwitchVariant,
} from './switch.model';

/**
 * Switch Component
 *
 * A toggle switch component that provides an alternative to checkboxes
 * for boolean values with better visual feedback.
 *
 * @example
 * <ds-switch
 *   [value]="true"
 *   [size]="'md'"
 *   [variant]="'default'"
 *   [label]="'Enable notifications'"
 *   [disabled]="false"
 *   (checkedChange)="onToggle($event)"
 * />
 */
@Component({
  selector: 'ds-switch',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ds-switch-container" [class]="containerClasses()">
      <label class="ds-switch" [class.ds-switch--disabled]="disabled()">
        <input
          #switchInput
          type="checkbox"
          class="ds-switch__input"
          [checked]="checked()"
          [disabled]="disabled() || readonly()"
          [required]="required()"
          [attr.aria-label]="ariaLabel() || label()"
          [attr.aria-describedby]="helperText() ? elementId() + '-helper' : null"
          (change)="onInputChange($event)"
          (focus)="onInputFocus($event)"
          (blur)="onInputBlur($event)"
          (keydown)="onInputKeydown($event)"
        />
        <div class="ds-switch__track" [class]="trackClasses()"></div>

        @if (label()) {
          <div class="ds-switch__content">
            <span class="ds-switch__label">
              {{ label() }}
              @if (required()) {
                <span class="ds-switch__required" aria-label="Required">*</span>
              }
            </span>
          </div>
        }
      </label>

      @if (helperText()) {
        <div class="ds-switch-helper" [id]="elementId() + '-helper'" [class.error]="hasError()">
          {{ helperText() }}
        </div>
      }
    </div>
  `,
  styleUrl: './switch.component.scss',
})
export class SwitchComponent implements ControlValueAccessor {
  // =============================================================================
  // DEPENDENCY INJECTION
  // =============================================================================

  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // COMPONENT INPUTS
  // =============================================================================

  /** Switch size */
  size = input<ComponentSize>('md');

  /** Switch variant */
  variant = input<SwitchVariant>('default');

  /** Switch label */
  label = input<string>();

  /** Helper text */
  helperText = input<string>();

  /** Aria label for accessibility */
  ariaLabel = input<string>();

  /** Whether switch is disabled */
  disabled = input<boolean>(false);

  /** Whether switch is readonly */
  readonly = input<boolean>(false);

  /** Whether switch is required */
  required = input<boolean>(false);

  /** Custom CSS classes */
  className = input<string>();

  // =============================================================================
  // COMPONENT MODEL
  // =============================================================================

  /** Switch checked state (two-way binding) */
  value = model<boolean>(false);

  // =============================================================================
  // COMPONENT OUTPUTS
  // =============================================================================

  /** Emitted when switch state changes */
  checkedChange = output<SwitchChangeEvent>();

  /** Emitted when switch gains/loses focus */
  focusChange = output<SwitchFocusEvent>();

  /** Emitted on keyboard interactions */
  keyboardEvent = output<SwitchKeyboardEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Internal checked state */
  private checkedSignal = signal<boolean>(false);

  /** Whether switch has focus */
  private focusedSignal = signal<boolean>(false);

  /** Whether switch has validation error */
  private errorSignal = signal<boolean>(false);

  /** Unique element ID */
  private elementIdSignal = signal<string>(`switch-${Math.random().toString(36).substr(2, 9)}`);

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  @ViewChild('switchInput', { static: true })
  private switchInput!: ElementRef<HTMLInputElement>;

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Current checked state */
  checked = computed(() => this.value() || this.checkedSignal());

  /** Whether switch has focus */
  focused = computed(() => this.focusedSignal());

  /** Whether switch has error */
  hasError = computed(() => this.errorSignal());

  /** Unique element ID */
  elementId = computed(() => this.elementIdSignal());

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-switch-container'];

    if (this.className()) {
      classes.push(this.className()!);
    }

    return classes.join(' ');
  });

  /** Track CSS classes */
  trackClasses = computed(() => {
    const classes = ['ds-switch__track'];

    classes.push(`ds-switch__track--${this.size()}`);
    classes.push(`ds-switch__track--${this.variant()}`);

    if (this.checked()) {
      classes.push('ds-switch__track--checked');
    }

    if (this.disabled()) {
      classes.push('ds-switch__track--disabled');
    }

    if (this.readonly()) {
      classes.push('ds-switch__track--readonly');
    }

    if (this.focused()) {
      classes.push('ds-switch__track--focused');
    }

    if (this.hasError()) {
      classes.push('ds-switch__track--error');
    }

    return classes.join(' ');
  });

  /** Thumb CSS classes */
  thumbClasses = computed(() => {
    const classes = ['ds-switch-thumb'];

    classes.push(`ds-switch-thumb--${this.size()}`);

    if (this.checked()) {
      classes.push('ds-switch-thumb--checked');
    }

    if (this.disabled()) {
      classes.push('ds-switch-thumb--disabled');
    }

    return classes.join(' ');
  });

  // =============================================================================
  // CONTROL VALUE ACCESSOR
  // =============================================================================

  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  writeValue(value: boolean): void {
    this.checkedSignal.set(value || false);
    this.value.set(value || false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // This will be handled by the disabled input
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Handle input change */
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    this.checkedSignal.set(checked);
    this.value.set(checked);
    this.onChange(checked);

    const changeEvent = createSwitchChangeEvent(checked, event, this.switchInput.nativeElement);

    this.checkedChange.emit(changeEvent);
  }

  /** Handle input focus */
  onInputFocus(event: FocusEvent): void {
    this.focusedSignal.set(true);

    const focusEvent = createSwitchFocusEvent(
      'in',
      this.checked(),
      event,
      this.switchInput.nativeElement,
    );

    this.focusChange.emit(focusEvent);
  }

  /** Handle input blur */
  onInputBlur(event: FocusEvent): void {
    this.focusedSignal.set(false);
    this.onTouched();

    const focusEvent = createSwitchFocusEvent(
      'out',
      this.checked(),
      event,
      this.switchInput.nativeElement,
    );

    this.focusChange.emit(focusEvent);
  }

  /** Handle keyboard events */
  onInputKeydown(event: KeyboardEvent): void {
    const keyboardEvent = createSwitchKeyboardEvent(
      this.checked(),
      event,
      this.switchInput.nativeElement,
    );

    this.keyboardEvent.emit(keyboardEvent);

    // Handle space and enter keys
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  /** Toggle switch state programmatically */
  toggle(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const newValue = !this.checked();
    this.checkedSignal.set(newValue);
    this.value.set(newValue);
    this.onChange(newValue);

    const changeEvent = createSwitchChangeEvent(
      newValue,
      new Event('change'),
      this.switchInput.nativeElement,
    );

    this.checkedChange.emit(changeEvent);
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Programmatically focus the switch */
  focus(): void {
    this.switchInput?.nativeElement?.focus();
  }

  /** Programmatically blur the switch */
  blur(): void {
    this.switchInput?.nativeElement?.blur();
  }

  /** Set error state */
  setError(hasError: boolean): void {
    this.errorSignal.set(hasError);
  }
}
