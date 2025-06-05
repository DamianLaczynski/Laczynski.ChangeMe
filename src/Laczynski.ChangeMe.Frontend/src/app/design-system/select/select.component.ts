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

import { ComponentSize } from '../shared';
import { IconComponent } from '../shared/icon/icon.component';

import {
  SelectOption,
  SelectOptionGroup,
  SelectVariant,
  SelectChangeEvent,
  SelectSearchEvent,
  SelectToggleEvent,
  SelectFocusEvent,
  SelectClearEvent,
  SelectValidation,
  groupOptions,
  filterOptions,
  getSelectedOptions,
  validateSelectValue,
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
  imports: [CommonModule, FormsModule, IconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
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
  size = input<ComponentSize>('sm');

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

  /** Whether select is clearable */
  clearable = input<boolean>(false);

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

  /** Clear event */
  cleared = output<SelectClearEvent<T>>();

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

    // Cleanup typeahead timeout on destroy
    this.destroyRef.onDestroy(() => {
      if (this.typeAheadTimeout) {
        clearTimeout(this.typeAheadTimeout);
        this.typeAheadTimeout = null;
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

  /** Options list ID for accessibility */
  optionsListId = computed(() => `${this.componentId()}-listbox`);

  /** Active descendant ID for accessibility */
  activeDescendantId = computed(() => {
    const index = this.highlightedIndex();
    if (index === -1) return null;

    const options = this.flatOptions();
    if (index >= 0 && index < options.length) {
      return `${this.componentId()}-option-${index}`;
    }
    return null;
  });

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

  /** Whether to show clear button */
  showClearButton = computed(() => {
    return this.clearable() && this.hasSelection() && !this.disabled() && !this.loading();
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
    if (this.loading()) classes.push('ds-select--loading');
    if (this.isOpen()) classes.push('ds-select--open');
    if (this.isOpen()) classes.push('ds-select--focused');
    if (this.hasSelection()) classes.push('ds-select--has-value');
    if (!this.validationState().valid) classes.push('ds-select--error');
    if (this.multiple()) classes.push('ds-select--multiple');
    if (this.customClasses()) classes.push(this.customClasses());

    return classes.join(' ');
  });

  /** Wrapper CSS classes */
  wrapperClasses = computed(() => {
    const classes = ['ds-select-wrapper'];

    if (this.showClearButton()) classes.push('ds-select-wrapper--has-clear');

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

    // Set initial highlighted index
    this.setInitialHighlightedIndex();

    // Focus search input if searchable, otherwise ensure proper focus management
    if (this.searchable()) {
      setTimeout(() => {
        this.searchInput()?.nativeElement?.focus();
      });
    } else {
      // For keyboard navigation, highlight first option if none highlighted
      if (reason === 'keyboard' && this.highlightedIndex() === -1) {
        setTimeout(() => this.highlightFirstAvailableOption());
      }
    }

    this.toggle.emit({
      isOpen: true,
      reason,
      originalEvent,
    });
  }

  /** Set initial highlighted index based on current selection */
  private setInitialHighlightedIndex(): void {
    const currentValue = this.internalValue();
    const options = this.flatOptions();

    if (currentValue != null) {
      // For single select, highlight the selected option
      if (!this.multiple()) {
        const selectedIndex = options.findIndex(option => option.value === currentValue);
        if (selectedIndex !== -1) {
          this.highlightedIndex.set(selectedIndex);
          setTimeout(() => this.scrollToHighlightedOption());
          return;
        }
      } else {
        // For multi-select, highlight the first selected option
        const selectedValues = Array.isArray(currentValue) ? currentValue : [];
        for (let i = 0; i < options.length; i++) {
          if (selectedValues.includes(options[i].value)) {
            this.highlightedIndex.set(i);
            setTimeout(() => this.scrollToHighlightedOption());
            return;
          }
        }
      }
    }

    // If no selection or selection not found, highlight first available option
    this.highlightedIndex.set(-1);
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
    const previousValue = currentValue;

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
      event: originalEvent || new Event('change'),
      element: this.selectTrigger().nativeElement,
      timestamp: Date.now(),
      value: newValue!,
      option,
      previousValue: previousValue!,
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
        event.preventDefault();
        if (this.isOpen()) {
          this.selectHighlightedOption();
        } else {
          this.openDropdown('keyboard', event);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (this.isOpen()) {
          this.navigateOptions(1);
        } else {
          this.openDropdown('keyboard', event);
          // Highlight first available option when opening
          setTimeout(() => this.highlightFirstAvailableOption());
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.navigateOptions(-1);
        } else {
          this.openDropdown('keyboard', event);
          // Highlight last available option when opening
          setTimeout(() => this.highlightLastAvailableOption());
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.closeDropdown('escape', event);
        }
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.highlightFirstAvailableOption();
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.highlightLastAvailableOption();
        }
        break;

      case 'PageDown':
        if (this.isOpen()) {
          event.preventDefault();
          this.navigateOptionsBy(5); // Jump by 5 options
        }
        break;

      case 'PageUp':
        if (this.isOpen()) {
          event.preventDefault();
          this.navigateOptionsBy(-5); // Jump by 5 options
        }
        break;

      case 'Tab':
        if (this.isOpen()) {
          this.closeDropdown('blur', event);
        }
        break;

      case 'Delete':
      case 'Backspace':
        // Remove last selected item in multiple mode when dropdown is closed
        if (!this.isOpen() && this.multiple() && this.hasSelection()) {
          event.preventDefault();
          const selectedOptions = this.selectedOptions();
          if (selectedOptions.length > 0) {
            const lastOption = selectedOptions[selectedOptions.length - 1];
            this.deselectOption(lastOption);
          }
        }
        // Clear all selections with Ctrl modifier
        else if (event.ctrlKey && this.clearable() && this.hasSelection()) {
          event.preventDefault();
          this.clearSelection(event);
        }
        break;

      case 'a':
      case 'A':
        // Ctrl+A to select all (multiple mode only)
        if (event.ctrlKey && this.multiple()) {
          event.preventDefault();
          this.selectAllAvailableOptions();
        }
        break;

      default:
        // Handle alphanumeric keys for type-ahead search when dropdown is closed
        if (!this.isOpen() && this.isAlphanumericKey(event.key)) {
          event.preventDefault();
          this.handleTypeAhead(event.key);
        }
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
        event.preventDefault();
        this.closeDropdown('escape', event);
        break;

      case 'Tab':
        // Allow normal tab behavior
        this.closeDropdown('blur', event);
        break;

      case 'Home':
        // Only handle Home if input is empty or cursor is at start
        const input = event.target as HTMLInputElement;
        if (input.selectionStart === 0) {
          event.preventDefault();
          this.highlightFirstAvailableOption();
        }
        break;

      case 'End':
        // Only handle End if cursor is at end
        const inputEnd = event.target as HTMLInputElement;
        if (inputEnd.selectionStart === inputEnd.value.length) {
          event.preventDefault();
          this.highlightLastAvailableOption();
        }
        break;

      case 'PageDown':
        event.preventDefault();
        this.navigateOptionsBy(5);
        break;

      case 'PageUp':
        event.preventDefault();
        this.navigateOptionsBy(-5);
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
    let attempts = 0;
    while (options[newIndex]?.disabled && attempts < options.length) {
      newIndex += direction;
      if (newIndex < 0) newIndex = options.length - 1;
      if (newIndex >= options.length) newIndex = 0;
      attempts++;
    }

    // If all options are disabled, don't change index
    if (attempts < options.length) {
      this.highlightedIndex.set(newIndex);
      this.scrollToHighlightedOption();
    }
  }

  /** Navigate by multiple steps */
  private navigateOptionsBy(steps: number): void {
    const options = this.flatOptions();
    if (options.length === 0) return;

    let newIndex = this.highlightedIndex() + steps;

    // Clamp to bounds
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= options.length) {
      newIndex = options.length - 1;
    }

    // Find nearest non-disabled option
    while (options[newIndex]?.disabled && newIndex >= 0 && newIndex < options.length) {
      newIndex += steps > 0 ? -1 : 1;
    }

    if (newIndex >= 0 && newIndex < options.length && !options[newIndex]?.disabled) {
      this.highlightedIndex.set(newIndex);
      this.scrollToHighlightedOption();
    }
  }

  /** Highlight first available option */
  private highlightFirstAvailableOption(): void {
    const options = this.flatOptions();
    const firstAvailable = options.findIndex(option => !option.disabled);
    if (firstAvailable !== -1) {
      this.highlightedIndex.set(firstAvailable);
      this.scrollToHighlightedOption();
    }
  }

  /** Highlight last available option */
  private highlightLastAvailableOption(): void {
    const options = this.flatOptions();
    for (let i = options.length - 1; i >= 0; i--) {
      if (!options[i].disabled) {
        this.highlightedIndex.set(i);
        this.scrollToHighlightedOption();
        break;
      }
    }
  }

  /** Scroll highlighted option into view */
  private scrollToHighlightedOption(): void {
    setTimeout(() => {
      const optionsList = this.optionsList()?.nativeElement;
      if (!optionsList) return;

      const highlightedOption = optionsList.querySelector(
        '.ds-select-option.highlighted',
      ) as HTMLElement;
      if (highlightedOption) {
        highlightedOption.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    });
  }

  /** Check if key is alphanumeric */
  private isAlphanumericKey(key: string): boolean {
    return key.length === 1 && /[a-zA-Z0-9]/.test(key);
  }

  /** Type ahead functionality */
  private typeAheadTimeout: number | null = null;
  private typeAheadString = '';

  private handleTypeAhead(key: string): void {
    // Clear previous timeout
    if (this.typeAheadTimeout) {
      clearTimeout(this.typeAheadTimeout);
    }

    // Add to search string
    this.typeAheadString += key.toLowerCase();

    // Find matching option
    const options = this.flatOptions();
    const matchingIndex = options.findIndex(
      option => !option.disabled && option.label.toLowerCase().startsWith(this.typeAheadString),
    );

    if (matchingIndex !== -1) {
      // If dropdown is closed, open it and highlight the match
      if (!this.isOpen()) {
        this.openDropdown('keyboard');
        setTimeout(() => {
          this.highlightedIndex.set(matchingIndex);
          this.scrollToHighlightedOption();
        });
      } else {
        this.highlightedIndex.set(matchingIndex);
        this.scrollToHighlightedOption();
      }
    }

    // Clear search string after timeout
    this.typeAheadTimeout = window.setTimeout(() => {
      this.typeAheadString = '';
    }, 1000);
  }

  /** Select currently highlighted option */
  private selectHighlightedOption(): void {
    const index = this.highlightedIndex();
    const options = this.flatOptions();

    if (index >= 0 && index < options.length) {
      const option = options[index];
      if (!option.disabled) {
        this.selectOption(option);
      }
    }
  }

  /** Handle focus events */
  onFocus(event: FocusEvent): void {
    this.focus.emit({
      event,
      element: event.target as HTMLSelectElement,
      timestamp: Date.now(),
      direction: 'in',
    });
  }

  /** Handle blur events */
  onBlur(event: FocusEvent): void {
    this.onTouched();

    this.focus.emit({
      event,
      element: event.target as HTMLSelectElement,
      timestamp: Date.now(),
      direction: 'out',
    });
  }

  /** Handle keyboard events for remove item buttons */
  onRemoveItemKeydown(event: KeyboardEvent, option: SelectOption<T>): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.deselectOption(option);
        // Return focus to select trigger
        this.focusSelect();
        break;
      case 'Escape':
        event.preventDefault();
        // Return focus to select trigger
        this.focusSelect();
        break;
    }
  }

  /** Handle keyboard events for clear button */
  onClearButtonKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.clearSelection(event);
        break;
      case 'Escape':
        event.preventDefault();
        // Return focus to select trigger
        this.focusSelect();
        break;
    }
  }

  /** Clear all selections */
  clearSelection(event?: Event): void {
    const previousValue = this.internalValue();
    const previousOptions = this.selectedOptions();
    const newValue = this.multiple() ? [] : null;

    this.internalValue.set(newValue);
    this.value.set(newValue);
    this.onChange(newValue);
    this.validateSelection(newValue);

    // Emit clear event
    this.cleared.emit({
      element: this.selectTrigger().nativeElement,
      previousValue,
      previousOptions,
      timestamp: Date.now(),
    });

    // Return focus to trigger
    this.focusSelect();

    // Close dropdown if open
    if (this.isOpen()) {
      this.closeDropdown('click', event);
    }
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

  /** Get option ID for accessibility */
  getOptionId(group: SelectOptionGroup<T>, optionIndex: number): string {
    const flatIndex = this.getOptionIndex(group, optionIndex);
    return `${this.componentId()}-option-${flatIndex}`;
  }

  /** Get option ARIA label */
  getOptionAriaLabel(option: SelectOption<T>): string {
    let label = option.label;
    if (option.description) {
      label += `, ${option.description}`;
    }
    if (option.disabled) {
      label += ', disabled';
    }
    if (this.multiple() && this.isSelected(option)) {
      label += ', selected';
    }
    return label;
  }

  /** Validate current selection */
  private validateSelection(value: T | T[] | null): void {
    const validation = validateSelectValue(value, this.required());
    this.validationState.set(validation);
  }

  // =============================================================================
  // PUBLIC METHODS
  // =============================================================================

  /** Clear all selections (alias for clearSelection) */
  clear(): void {
    this.clearSelection();
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

  /** Select all available options in multiple mode */
  private selectAllAvailableOptions(): void {
    const options = this.flatOptions();
    const availableOptions = options.filter(option => !option.disabled);
    const selectedValues = availableOptions.map(option => option.value);
    this.updateValue(selectedValues, this.internalValue(), availableOptions);
  }
}
