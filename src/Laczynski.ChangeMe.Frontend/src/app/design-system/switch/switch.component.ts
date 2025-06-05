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

import { ComponentSize } from '../shared';

import {
  SwitchVariant,
  SwitchChangeEvent,
  SwitchFocusEvent,
  SwitchKeyboardEvent,
  createSwitchChangeEvent,
  createSwitchFocusEvent,
  createSwitchKeyboardEvent,
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
  templateUrl: './switch.component.html',
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

    classes.push(`ds-switch--${this.size()}`);
    classes.push(`ds-switch--${this.variant()}`);

    if (this.disabled()) classes.push('ds-switch--disabled');
    if (this.hasError()) classes.push('ds-switch--error');
    if (this.className()) classes.push(this.className()!);

    return classes.join(' ');
  });

  /** Switch CSS classes */
  switchClasses = computed(() => {
    const classes = ['ds-switch'];

    if (this.disabled()) classes.push('ds-switch--disabled');

    return classes.join(' ');
  });

  /** Track CSS classes */
  trackClasses = computed(() => {
    const classes = ['ds-switch__track'];

    if (this.checked()) classes.push('ds-switch__track--checked');
    if (this.disabled()) classes.push('ds-switch__track--disabled');
    if (this.readonly()) classes.push('ds-switch__track--readonly');
    if (this.hasError()) classes.push('ds-switch__track--error');

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
