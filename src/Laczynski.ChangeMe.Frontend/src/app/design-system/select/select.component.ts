import {
  Component,
  input,
  output,
  model,
  computed,
  signal,
  viewChild,
  inject,
  forwardRef,
  DestroyRef,
  OnInit,
  ElementRef,
  HostListener,
  effect,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  SelectOption,
  SelectOptionGroup,
  SelectConfig,
  SelectVariant,
  SelectSize,
  SelectState,
  SelectChangeEvent,
  SelectSearchEvent,
  SelectToggleEvent,
  SelectFocusEvent,
  SelectValidation,
  createSelectConfig,
  groupOptions,
  filterOptions,
  getSelectedOptions,
  validateSelectValue,
  getSelectStateFromValidation,
  isOptionSelected,
  getSelectionDisplayText,
  getSelectAriaAttributes,
} from './select.model';

/**
 * Select Component
 *
 * Advanced select component with support for single/multi-select, search,
 * grouping, and accessibility. Built with Angular Signals API.
 */
@Component({
  selector: 'ds-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ds-select-container" [class]="containerClasses()">
      <!-- Label -->
      @if (label()) {
        <label [for]="selectId()" class="ds-select-label" [class.required]="required()">
          {{ label() }}
          @if (required()) {
            <span class="ds-select-required" aria-label="Required field">*</span>
          }
        </label>
      }

      <!-- Select Trigger -->
      <div class="ds-select-wrapper" [class]="wrapperClasses()">
        <button
          #selectTrigger
          type="button"
          [id]="selectId()"
          class="ds-select-trigger"
          [disabled]="disabled()"
          [attr.aria-haspopup]="ariaAttributes()['aria-haspopup']"
          [attr.aria-expanded]="ariaAttributes()['aria-expanded']"
          [attr.aria-invalid]="ariaAttributes()['aria-invalid'] || null"
          [attr.aria-describedby]="ariaAttributes()['aria-describedby'] || null"
          (click)="toggleDropdown()"
          (keydown)="onTriggerKeydown($event)"
          (focus)="onFocus($event)"
          (blur)="onBlur($event)"
        >
          <!-- Selected Values Display -->
          <span class="ds-select-value" [class.placeholder]="!hasSelection()">
            {{ displayText() }}
          </span>

          <!-- Loading Indicator -->
          @if (loading()) {
            <span class="ds-select-loading" aria-label="Loading">⟳</span>
          } @else {
            <!-- Dropdown Arrow -->
            <span class="ds-select-arrow" [class.open]="isOpen()">▼</span>
          }
        </button>

        <!-- Dropdown -->
        @if (isOpen()) {
          <div class="ds-select-dropdown" [style.max-height]="maxHeight()">
            <!-- Search Input -->
            @if (searchable()) {
              <div class="ds-select-search">
                <input
                  #searchInput
                  type="text"
                  class="ds-select-search-input"
                  placeholder="Search..."
                  [(ngModel)]="searchQuery"
                  (input)="onSearch($event)"
                  (keydown)="onSearchKeydown($event)"
                />
              </div>
            }

            <!-- Options List -->
            <div class="ds-select-options" #optionsList>
              @if (filteredGroups().length === 0) {
                <!-- No Options Message -->
                <div class="ds-select-no-options">
                  {{ searchQuery() ? 'No options found' : 'No options available' }}
                </div>
              } @else {
                <!-- Render Options/Groups -->
                @for (group of filteredGroups(); track group.id) {
                  @if (group.label) {
                    <!-- Group Header -->
                    <div class="ds-select-group-header">{{ group.label }}</div>
                  }

                  <!-- Group Options -->
                  @for (option of group.options; track option.value; let optionIndex = $index) {
                    <div
                      class="ds-select-option"
                      [class.selected]="isSelected(option)"
                      [class.disabled]="option.disabled"
                      [class.highlighted]="
                        highlightedIndex() === getOptionIndex(group, optionIndex)
                      "
                      [attr.aria-selected]="isSelected(option)"
                      [attr.aria-disabled]="option.disabled"
                      (click)="selectOption(option, $event)"
                      (mouseenter)="setHighlightedIndex(getOptionIndex(group, optionIndex))"
                    >
                      <!-- Multi-select Checkbox -->
                      @if (multiple()) {
                        <span class="ds-select-checkbox" [class.checked]="isSelected(option)">
                          {{ isSelected(option) ? '☑' : '☐' }}
                        </span>
                      }

                      <!-- Option Icon -->
                      @if (option.icon) {
                        <span class="ds-select-option-icon" [innerHTML]="option.icon"></span>
                      }

                      <!-- Option Content -->
                      <div class="ds-select-option-content">
                        <div class="ds-select-option-label">{{ option.label }}</div>
                        @if (option.description) {
                          <div class="ds-select-option-description">{{ option.description }}</div>
                        }
                      </div>

                      <!-- Selection Indicator -->
                      @if (!multiple() && isSelected(option)) {
                        <span class="ds-select-selected-indicator">✓</span>
                      }
                    </div>
                  }
                }
              }
            </div>
          </div>
        }
      </div>

      <!-- Helper Text / Error Message -->
      @if (helperText() || validationState().errorMessage) {
        <div
          class="ds-select-helper"
          [class.error]="!validationState().valid"
          [id]="helperTextId()"
        >
          {{ validationState().errorMessage || helperText() }}
        </div>
      }

      <!-- Selected Items (for multiple selection) -->
      @if (multiple() && hasSelection() && showSelectedItems()) {
        <div class="ds-select-selected-items">
          @for (option of selectedOptions(); track option.value) {
            <span class="ds-select-selected-item">
              {{ option.label }}
              <button
                type="button"
                class="ds-select-remove-item"
                (click)="deselectOption(option)"
                [attr.aria-label]="'Remove ' + option.label"
              >
                ✕
              </button>
            </span>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './select.component.scss',
})
export class SelectComponent<T = any> implements ControlValueAccessor, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);

  // =============================================================================
  // INPUTS
  // =============================================================================

  /** Select variant */
  variant = input<SelectVariant>('default');

  /** Select size */
  size = input<SelectSize>('md');

  /** Select label */
  label = input<string>('');

  /** Placeholder text */
  placeholder = input<string>('Select...');

  /** Helper text */
  helperText = input<string>('');

  /** Available options */
  options = input<SelectOption<T>[]>([]);

  /** Whether select is disabled */
  disabled = input<boolean>(false);

  /** Whether select is required */
  required = input<boolean>(false);

  /** Whether multiple selection is allowed */
  multiple = input<boolean>(false);

  /** Whether search is enabled */
  searchable = input<boolean>(false);

  /** Whether to show loading state */
  loading = input<boolean>(false);

  /** Maximum dropdown height */
  maxHeight = input<string>('200px');

  /** Whether to show selected items below select (for multiple) */
  showSelectedItems = input<boolean>(true);

  /** Maximum number of selections (for multiple) */
  maxSelections = input<number | null>(null);

  /** Custom CSS classes */
  customClasses = input<string>('');

  // =============================================================================
  // MODEL & OUTPUTS
  // =============================================================================

  /** Selected value(s) - two-way binding */
  value = model<T | T[] | null>(null);

  /** Selection change event */
  selectionChange = output<SelectChangeEvent<T>>();

  /** Search event */
  search = output<SelectSearchEvent>();

  /** Dropdown toggle event */
  toggle = output<SelectToggleEvent>();

  /** Focus events */
  focus = output<SelectFocusEvent>();

  // =============================================================================
  // VIEW CHILDREN
  // =============================================================================

  /** Select trigger button reference */
  private selectTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('selectTrigger');

  /** Search input reference */
  private searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** Options list reference */
  private optionsList = viewChild<ElementRef<HTMLDivElement>>('optionsList');

  // =============================================================================
  // COMPONENT STATE
  // =============================================================================

  /** Whether dropdown is open */
  protected isOpen = signal<boolean>(false);

  /** Search query */
  protected searchQuery = signal<string>('');

  /** Currently highlighted option index */
  protected highlightedIndex = signal<number>(-1);

  /** Component ID for accessibility */
  private componentId = signal<string>(`ds-select-${Math.random().toString(36).substr(2, 9)}`);

  /** Validation state */
  protected validationState = signal<SelectValidation>({ valid: true });

  /** Internal selected values */
  protected internalValue = signal<T | T[] | null>(null);

  constructor() {
    // Watch for external value changes
    effect(() => {
      const externalValue = this.value();
      const currentInternal = this.internalValue();

      // Only update if values are different
      if (JSON.stringify(externalValue) !== JSON.stringify(currentInternal)) {
        this.internalValue.set(externalValue);
        this.validateSelection(externalValue);
      }
    });
  }

  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================

  /** Select ID for accessibility */
  selectId = computed(() => this.componentId());

  /** Helper text ID for accessibility */
  helperTextId = computed(() => `${this.componentId()}-helper`);

  /** Grouped options */
  groupedOptions = computed(() => {
    const opts = this.options();
    return opts.some(opt => opt.group)
      ? groupOptions(opts)
      : [{ id: '__default__', label: '', options: opts }];
  });

  /** Filtered options based on search */
  filteredGroups = computed(() => {
    const query = this.searchQuery();
    if (!query.trim()) return this.groupedOptions();

    return this.groupedOptions()
      .map(group => ({
        ...group,
        options: filterOptions(group.options, query),
      }))
      .filter(group => group.options.length > 0);
  });

  /** Get selected options from values */
  selectedOptions = computed(() => {
    const value = this.internalValue();
    if (value == null) return [];
    return getSelectedOptions(this.options(), value);
  });

  /** Whether any option is selected */
  hasSelection = computed(() => {
    const value = this.internalValue();
    return value != null && (Array.isArray(value) ? value.length > 0 : true);
  });

  /** Display text for selected values */
  displayText = computed(() => {
    const value = this.internalValue();
    return getSelectionDisplayText(this.options(), value ?? null, this.placeholder());
  });

  /** Container CSS classes */
  containerClasses = computed(() => {
    const classes = ['ds-select'];

    classes.push(`ds-select--${this.size()}`);
    classes.push(`ds-select--${this.variant()}`);

    if (this.disabled()) classes.push('ds-select--disabled');
    if (this.isOpen()) classes.push('ds-select--open');
    if (!this.validationState().valid) classes.push('ds-select--error');
    if (this.multiple()) classes.push('ds-select--multiple');
    if (this.customClasses()) classes.push(this.customClasses());

    return classes.join(' ');
  });

  /** Wrapper CSS classes */
  wrapperClasses = computed(() => {
    const classes = ['ds-select-wrapper'];

    if (this.loading()) classes.push('ds-select--loading');

    return classes.join(' ');
  });

  /** ARIA attributes for accessibility */
  ariaAttributes = computed(() => {
    const describedBy: string[] = [];

    if (this.helperText() || this.validationState().errorMessage) {
      describedBy.push(this.helperTextId());
    }

    return getSelectAriaAttributes(this.validationState(), this.isOpen(), describedBy);
  });

  /** Flattened options for keyboard navigation */
  flatOptions = computed(() => {
    return this.filteredGroups().reduce(
      (acc, group) => acc.concat(group.options),
      [] as SelectOption<T>[],
    );
  });

  // =============================================================================
  // CONTROL VALUE ACCESSOR
  // =============================================================================

  private onTouched = () => {};
  private onChange = (value: T | T[] | null) => {};

  writeValue(value: T | T[] | null): void {
    this.internalValue.set(value);
    this.value.set(value);
    this.validateSelection(value);
  }

  registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled through input signal
  }

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Initialize internal value from model
    this.internalValue.set(this.value());
    this.validateSelection(this.value());
  }

  // =============================================================================
  // HOST LISTENERS
  // =============================================================================

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isOpen()) return;

    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown('click', event);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen()) {
      this.closeDropdown('escape', event);
    }
  }

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /** Toggle dropdown open/closed */
  toggleDropdown(): void {
    if (this.disabled()) return;

    if (this.isOpen()) {
      this.closeDropdown('click');
    } else {
      this.openDropdown('click');
    }
  }

  /** Open dropdown */
  openDropdown(reason: SelectToggleEvent['reason'], originalEvent?: Event): void {
    if (this.disabled() || this.isOpen()) return;

    this.isOpen.set(true);
    this.highlightedIndex.set(-1);

    // Focus search input if searchable
    if (this.searchable()) {
      setTimeout(() => {
        this.searchInput()?.nativeElement?.focus();
      });
    }

    this.toggle.emit({
      isOpen: true,
      reason,
      originalEvent,
    });
  }

  /** Close dropdown */
  closeDropdown(reason: SelectToggleEvent['reason'], originalEvent?: Event): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);

    // Return focus to trigger
    this.selectTrigger().nativeElement.focus();

    this.toggle.emit({
      isOpen: false,
      reason,
      originalEvent,
    });
  }

  /** Handle option selection */
  selectOption(option: SelectOption<T>, event?: Event): void {
    if (option.disabled) return;

    const currentValue = this.internalValue();
    let newValue: T | T[] | null;
    let previousValue = currentValue;

    if (this.multiple()) {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];

      if (currentArray.includes(option.value)) {
        // Remove from selection
        newValue = currentArray.filter(v => v !== option.value);
      } else {
        // Add to selection (check max limit)
        const maxSelections = this.maxSelections();
        if (maxSelections && currentArray.length >= maxSelections) {
          return; // Max selections reached
        }
        newValue = [...currentArray, option.value];
      }
    } else {
      newValue = option.value;
      this.closeDropdown('click', event);
    }

    this.updateValue(newValue, previousValue, option, event);
  }

  /** Deselect specific option (for multiple select) */
  deselectOption(option: SelectOption<T>): void {
    if (!this.multiple()) return;

    const currentValue = this.internalValue();
    const currentArray = Array.isArray(currentValue) ? currentValue : [];
    const newValue = currentArray.filter(v => v !== option.value);

    this.updateValue(newValue, currentValue, option);
  }

  /** Update internal value and emit events */
  private updateValue(
    newValue: T | T[] | null,
    previousValue: T | T[] | null,
    option: SelectOption<T> | SelectOption<T>[],
    originalEvent?: Event,
  ): void {
    this.internalValue.set(newValue);
    this.value.set(newValue);
    this.onChange(newValue);
    this.validateSelection(newValue);

    this.selectionChange.emit({
      value: newValue!,
      option,
      previousValue: previousValue!,
      originalEvent,
    });
  }

  /** Handle search input */
  onSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.highlightedIndex.set(-1);

    this.search.emit({
      query,
      originalEvent: event,
    });
  }

  /** Handle trigger keyboard events */
  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        this.openDropdown('keyboard', event);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openDropdown('keyboard', event);
        break;
    }
  }

  /** Handle search input keyboard events */
  onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateOptions(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateOptions(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectHighlightedOption();
        break;
      case 'Escape':
        this.closeDropdown('escape', event);
        break;
    }
  }

  /** Navigate through options with keyboard */
  private navigateOptions(direction: number): void {
    const options = this.flatOptions();
    if (options.length === 0) return;

    let newIndex = this.highlightedIndex() + direction;

    // Wrap around
    if (newIndex < 0) {
      newIndex = options.length - 1;
    } else if (newIndex >= options.length) {
      newIndex = 0;
    }

    // Skip disabled options
    while (options[newIndex]?.disabled && newIndex !== this.highlightedIndex()) {
      newIndex += direction;
      if (newIndex < 0) newIndex = options.length - 1;
      if (newIndex >= options.length) newIndex = 0;
    }

    this.highlightedIndex.set(newIndex);
  }

  /** Select currently highlighted option */
  private selectHighlightedOption(): void {
    const index = this.highlightedIndex();
    const options = this.flatOptions();

    if (index >= 0 && index < options.length) {
      this.selectOption(options[index]);
    }
  }

  /** Handle focus events */
  onFocus(event: FocusEvent): void {
    this.focus.emit({
      direction: 'in',
      originalEvent: event,
    });
  }

  /** Handle blur events */
  onBlur(event: FocusEvent): void {
    this.onTouched();

    this.focus.emit({
      direction: 'out',
      originalEvent: event,
    });
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /** Check if option is selected */
  isSelected(option: SelectOption<T>): boolean {
    return isOptionSelected(option, this.internalValue());
  }

  /** Set highlighted index */
  setHighlightedIndex(index: number): void {
    this.highlightedIndex.set(index);
  }

  /** Get flat option index for keyboard navigation */
  getOptionIndex(group: SelectOptionGroup<T>, optionIndex: number): number {
    let index = 0;
    for (const g of this.filteredGroups()) {
      if (g.id === group.id) {
        return index + optionIndex;
      }
      index += g.options.length;
    }
    return -1;
  }

  /** Validate current selection */
  private validateSelection(value: T | T[] | null): void {
    const validation = validateSelectValue(value, this.required());
    this.validationState.set(validation);
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Clear all selections */
  clear(): void {
    this.updateValue(this.multiple() ? [] : null, this.internalValue(), []);
  }

  /** Open dropdown programmatically */
  open(): void {
    this.openDropdown('focus');
  }

  /** Close dropdown programmatically */
  close(): void {
    this.closeDropdown('blur');
  }

  /** Focus the select */
  focusSelect(): void {
    this.selectTrigger().nativeElement.focus();
  }

  /** Get current validation state */
  getValidationState(): SelectValidation {
    return this.validationState();
  }
}
