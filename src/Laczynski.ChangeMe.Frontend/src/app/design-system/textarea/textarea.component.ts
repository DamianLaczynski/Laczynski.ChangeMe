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
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  TextareaSize,
  TextareaVariant,
  TextareaResize,
  TextareaChangeEvent,
  TextareaFocusEvent,
  TextareaKeyboardEvent,
  TextareaResizeEvent,
  createTextareaChangeEvent,
  createTextareaFocusEvent,
  createTextareaKeyboardEvent,
  createTextareaResizeEvent,
  isValidTextareaSize,
  isValidTextareaVariant,
  countLines,
  countCharacters,
  isWithinMaxLength,
} from './textarea.model';

/**
 * Textarea Component
 *
 * A multiline text input component with advanced features like auto-resize,
 * character counting, and enhanced styling.
 *
 * @example
 * <ds-textarea
 *   [value]="description"
 *   [size]="'md'"
 *   [variant]="'default'"
 *   [label]="'Description'"
 *   [placeholder]="'Enter description...'"
 *   [rows]="4"
 *   [maxLength]="500"
 *   [showCounter]="true"
 *   [autoResize]="true"
 *   (valueChange)="onDescriptionChange($event)"
 * />
 */
@Component({
  selector: 'ds-textarea',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ds-textarea-container" [class]="containerClasses()">
      @if (label()) {
        <label class="ds-textarea-label" [for]="elementId()" [class.required]="required()">
          {{ label() }}
          @if (required()) {
            <span class="ds-textarea-required" aria-label="Required">*</span>
          }
        </label>
      }

      <div class="ds-textarea-wrapper" [class]="wrapperClasses()">
        <textarea
          #textareaElement
          [id]="elementId()"
          class="ds-textarea-field"
          [class]="fieldClasses()"
          [value]="currentValue()"
          [placeholder]="placeholder() || ''"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [rows]="effectiveRows()"
          [cols]="cols()"
          [maxLength]="maxLength() || undefined"
          [style.resize]="resizeStyle()"
          [attr.aria-label]="ariaLabel() || label()"
          [attr.aria-describedby]="getAriaDescribedby()"
          [attr.aria-invalid]="hasError()"
          (input)="onTextareaInput($event)"
          (change)="onTextareaChange($event)"
          (focus)="onTextareaFocus($event)"
          (blur)="onTextareaBlur($event)"
          (keydown)="onTextareaKeydown($event)"
        ></textarea>
      </div>

      <div class="ds-textarea-footer" [class.visible]="showFooter()">
        @if (helperText() && !showCounter()) {
          <div class="ds-textarea-helper" [id]="elementId() + '-helper'" [class.error]="hasError()">
            {{ helperText() }}
          </div>
        }

        @if (showCounter()) {
          <div class="ds-textarea-info">
            @if (helperText()) {
              <div
                class="ds-textarea-helper"
                [id]="elementId() + '-helper'"
                [class.error]="hasError()"
              >
                {{ helperText() }}
              </div>
            }
            <div
              class="ds-textarea-counter"
              [id]="elementId() + '-counter'"
              [class]="counterClasses()"
            >
              {{ characterCount() }}{{ maxLength() ? '/' + maxLength() : '' }}
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements ControlValueAccessor, AfterViewInit {
  // =============================================================================
  // DEPENDENCY INJECTION
  // =============================================================================

  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // COMPONENT INPUTS
  // =============================================================================

  /** Textarea size */
  size = input<TextareaSize>('md');

  /** Textarea variant */
  variant = input<TextareaVariant>('default');

  /** Textarea label */
  label = input<string>();

  /** Placeholder text */
  placeholder = input<string>();

  /** Helper text */
  helperText = input<string>();

  /** Aria label for accessibility */
  ariaLabel = input<string>();

  /** Whether textarea is disabled */
  disabled = input<boolean>(false);

  /** Whether textarea is readonly */
  readonly = input<boolean>(false);

  /** Whether textarea is required */
  required = input<boolean>(false);

  /** Number of visible rows */
  rows = input<number>(4);

  /** Number of visible columns */
  cols = input<number>();

  /** Minimum number of rows for auto-resize */
  minRows = input<number>(2);

  /** Maximum number of rows for auto-resize */
  maxRows = input<number>(10);

  /** Maximum character length */
  maxLength = input<number>();

  /** Whether to show character counter */
  showCounter = input<boolean>(false);

  /** Whether textarea can be resized */
  resizable = input<boolean>(true);

  /** Resize direction */
  resize = input<TextareaResize>('vertical');

  /** Whether textarea should auto-resize */
  autoResize = input<boolean>(false);

  /** Custom CSS classes */
  className = input<string>();

  // =============================================================================
  // COMPONENT OUTPUTS
  // =============================================================================

  /** Current text value (two-way binding) */
  value = model<string>('');

  /** Emitted when textarea value changes */
  valueChange = output<TextareaChangeEvent>();

  /** Emitted when textarea gains or loses focus */
  focusChange = output<TextareaFocusEvent>();

  /** Emitted on keyboard interactions */
  keyboardEvent = output<TextareaKeyboardEvent>();

  /** Emitted when textarea is resized */
  resizeEvent = output<TextareaResizeEvent>();

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Internal text state */
  private textSignal = signal<string>('');

  /** Internal focus state */
  private focusedSignal = signal<boolean>(false);

  /** Internal error state */
  private errorSignal = signal<boolean>(false);

  /** Unique element ID */
  private elementIdSignal = signal<string>(
    `ds-textarea-${Math.random().toString(36).substr(2, 9)}`,
  );

  /** Resize observer for auto-resize functionality */
  private resizeObserver?: ResizeObserver;

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  @ViewChild('textareaElement', { static: true })
  private textareaElement!: ElementRef<HTMLTextAreaElement>;

  // =============================================================================
  // COMPUTED PROPERTIES
  // =============================================================================

  /** Current textarea value */
  currentValue = computed(() => this.value() || this.textSignal());

  /** Character count */
  characterCount = computed(() => countCharacters(this.currentValue()));

  /** Line count */
  lineCount = computed(() => countLines(this.currentValue()));

  /** Whether textarea is focused */
  focused = computed(() => this.focusedSignal());

  /** Whether textarea has error */
  hasError = computed(() => this.errorSignal());

  /** Unique element ID */
  elementId = computed(() => this.elementIdSignal());

  /** Whether to show footer */
  showFooter = computed(() => this.helperText() || this.showCounter());

  /** Effective number of rows */
  effectiveRows = computed(() => {
    if (this.autoResize()) {
      const lineCount = this.lineCount();
      return Math.max(this.minRows(), Math.min(this.maxRows(), lineCount + 1));
    }
    return this.rows();
  });

  /** Resize style for CSS */
  resizeStyle = computed(() => {
    if (!this.resizable() || this.autoResize()) return 'none';
    return this.resize();
  });

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes: string[] = ['ds-textarea'];

    // Size classes
    classes.push(`ds-textarea--${this.size()}`);

    // Variant classes
    classes.push(`ds-textarea--${this.variant()}`);

    // State classes
    if (this.focused()) classes.push('ds-textarea--focused');
    if (this.hasError()) classes.push('ds-textarea--error');
    if (this.disabled()) classes.push('ds-textarea--disabled');
    if (this.readonly()) classes.push('ds-textarea--readonly');

    // Custom classes
    if (this.className()) classes.push(this.className()!);

    return classes.join(' ');
  });

  /** Wrapper CSS classes */
  wrapperClasses = computed(() => {
    const classes: string[] = [];

    // State-specific wrapper classes
    if (this.focused()) classes.push('ds-textarea-wrapper--focused');
    if (this.hasError()) classes.push('ds-textarea-wrapper--error');

    return classes.join(' ');
  });

  /** Field CSS classes */
  fieldClasses = computed(() => {
    const classes: string[] = [];

    // Auto-resize specific class
    if (this.autoResize()) classes.push('ds-textarea-field--auto-resize');

    return classes.join(' ');
  });

  /** Counter CSS classes */
  counterClasses = computed(() => {
    const classes: string[] = [];
    const count = this.characterCount();
    const max = this.maxLength();

    if (max) {
      const percentage = (count / max) * 100;
      if (percentage >= 100) {
        classes.push('ds-textarea-counter--exceeded');
      } else if (percentage >= 80) {
        classes.push('ds-textarea-counter--warning');
      }
    }

    return classes.join(' ');
  });

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngAfterViewInit(): void {
    if (this.autoResize()) {
      this.setupAutoResize();
    }
  }

  // =============================================================================
  // CONTROL VALUE ACCESSOR
  // =============================================================================

  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.textSignal.set(value || '');
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
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

  /** Handle textarea input event */
  onTextareaInput(event: Event): void {
    if (this.disabled() || this.readonly()) return;

    const target = event.target as HTMLTextAreaElement;
    const value = target.value;

    // Check max length
    if (this.maxLength() && !isWithinMaxLength(value, this.maxLength())) {
      return;
    }

    this.updateValue(value, event);
  }

  /** Handle textarea change event */
  onTextareaChange(event: Event): void {
    if (this.disabled() || this.readonly()) return;

    const target = event.target as HTMLTextAreaElement;
    this.updateValue(target.value, event);
  }

  /** Handle textarea focus event */
  onTextareaFocus(event: FocusEvent): void {
    this.focusedSignal.set(true);

    const focusEvent = createTextareaFocusEvent(this.currentValue(), 'focus', event);
    this.focusChange.emit(focusEvent);
  }

  /** Handle textarea blur event */
  onTextareaBlur(event: FocusEvent): void {
    this.focusedSignal.set(false);
    this.onTouched();

    const focusEvent = createTextareaFocusEvent(this.currentValue(), 'blur', event);
    this.focusChange.emit(focusEvent);
  }

  /** Handle keyboard events */
  onTextareaKeydown(event: KeyboardEvent): void {
    const keyboardEvent = createTextareaKeyboardEvent(this.currentValue(), event);
    this.keyboardEvent.emit(keyboardEvent);

    // Handle special key combinations
    if (event.key === 'Tab' && !event.shiftKey) {
      // Allow normal tab behavior
      return;
    }
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  /** Update textarea value */
  private updateValue(value: string, originalEvent: Event): void {
    this.textSignal.set(value);
    this.value.set(value);
    this.onChange(value);

    const changeEvent = createTextareaChangeEvent(value, originalEvent);
    this.valueChange.emit(changeEvent);

    if (this.autoResize()) {
      this.adjustHeight();
    }
  }

  /** Setup auto-resize functionality */
  private setupAutoResize(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          const resizeEvent = createTextareaResizeEvent(width, height, 'auto');
          this.resizeEvent.emit(resizeEvent);
        }
      });

      this.resizeObserver.observe(this.textareaElement.nativeElement);
    }

    // Initial height adjustment
    setTimeout(() => this.adjustHeight(), 0);
  }

  /** Adjust textarea height for auto-resize */
  private adjustHeight(): void {
    if (!this.autoResize()) return;

    const element = this.textareaElement.nativeElement;
    element.style.height = 'auto';

    const scrollHeight = element.scrollHeight;
    const minHeight = this.minRows() * 20; // Approximate line height
    const maxHeight = this.maxRows() * 20;

    const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
    element.style.height = `${newHeight}px`;
  }

  /** Get aria-describedby attribute */
  getAriaDescribedby(): string | null {
    const parts: string[] = [];

    if (this.helperText()) {
      parts.push(this.elementId() + '-helper');
    }

    if (this.showCounter()) {
      parts.push(this.elementId() + '-counter');
    }

    return parts.length > 0 ? parts.join(' ') : null;
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Programmatically focus the textarea */
  focus(): void {
    this.textareaElement?.nativeElement?.focus();
  }

  /** Programmatically blur the textarea */
  blur(): void {
    this.textareaElement?.nativeElement?.blur();
  }

  /** Select all text */
  selectAll(): void {
    this.textareaElement?.nativeElement?.select();
  }

  /** Set error state */
  setError(hasError: boolean): void {
    this.errorSignal.set(hasError);
  }

  /** Get current selection */
  getSelection(): { start: number; end: number } {
    const element = this.textareaElement?.nativeElement;
    if (!element) return { start: 0, end: 0 };

    return {
      start: element.selectionStart || 0,
      end: element.selectionEnd || 0,
    };
  }

  /** Set text selection */
  setSelection(start: number, end: number): void {
    const element = this.textareaElement?.nativeElement;
    if (element) {
      element.setSelectionRange(start, end);
    }
  }
}
