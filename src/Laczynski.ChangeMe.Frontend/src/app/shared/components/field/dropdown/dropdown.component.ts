import {
  Component,
  forwardRef,
  input,
  output,
  signal,
  computed,
  ElementRef,
  ViewChild,
  HostListener,
  effect,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ActionButtonComponent } from '../action-button.component';
import { NodeComponent, Node } from '../../node/node.component';
import { ButtonComponent } from '../../button/button.component';
import { IconName } from '@shared/components/icon';
import { SearchComponent } from '../search';

export interface DropdownItem {
  value: string | number;
  label: string;
  type?: 'header' | 'single' | 'multi' | 'divider';
  icon?: IconName;
  disabled?: boolean;
  selected?: boolean;
}

export interface DropdownGroup {
  header?: string;
  items: DropdownItem[];
}

export type DropdownMode = 'single' | 'multi';

@Component({
  selector: 'app-dropdown',

  imports: [
    CommonModule,
    FieldComponent,
    CheckboxComponent,
    FormsModule,
    IconComponent,
    ActionButtonComponent,
    NodeComponent,
    ButtonComponent,
    SearchComponent,
  ],
  templateUrl: './dropdown.component.html',
  host: {
    '[style.position]': '"relative"',
    '[style.display]': '"block"',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent extends FieldComponent implements AfterViewInit, OnDestroy {
  /**
   * Override getDisplayValue to use computed displayText.
   */
  override getDisplayValue(): string {
    return this.displayText();
  }

  /**
   * Hook called after entering edit mode to open dropdown automatically.
   * Uses requestAnimationFrame + setTimeout to ensure DOM is updated and dropdown is ready before opening.
   */
  protected override afterEnterEditMode(): void {
    // Open dropdown automatically when entering edit mode
    if (!this.disabled() && !this.readonly()) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          this.openDropdown();
        }, 0);
      });
    }
  }

  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private panelElement: HTMLElement | null = null;
  private portalContainer: HTMLElement | null = null;
  private resizeObserver?: ResizeObserver;
  private scrollListener?: () => void;
  private typeaheadTimeout?: number;
  private typeaheadString = '';
  private dropdownOpenListener?: () => void;
  items = input<DropdownItem[]>([]);
  groups = input<DropdownGroup[]>([]);
  mode = input<DropdownMode>('single');
  searchable = input<boolean>(false);
  clearable = input<boolean>(false);
  maxHeight = input<string>('300px');
  compact = input<boolean>(false); // Use button trigger instead of input
  compactIcon = input<IconName>('filter'); // Icon for compact mode

  selectionChange = output<any>();
  opened = output<void>();
  closed = output<void>();

  isExpanded = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedValues = signal<Set<string | number>>(new Set());
  activeDescendant = signal<string | null>(null);

  @ViewChild('dropdownPanel') dropdownPanel?: ElementRef;
  @ViewChild('triggerElement') triggerElement?: ElementRef;

  // Computed properties
  displayText = computed(() => {
    const selected = this.getSelectedItems();
    if (selected.length === 0) {
      return this.placeholder() || 'Select...';
    }
    if (this.mode() === 'single') {
      return selected[0]?.label || '';
    }
    return `${selected.length} selected`;
  });

  // Computed icon for compact mode - updates when selection changes
  computedCompactIcon = computed(() => {
    // Check if there's a selected value
    const selectedValues = this.selectedValues();
    if (selectedValues.size > 0) {
      // Get all items and find the selected one
      const allItems = this.getAllItems();
      const selectedValue = Array.from(selectedValues)[0];
      const selectedItem = allItems.find(item => item.value === selectedValue);

      // If the selected item has an icon, use it
      if (selectedItem?.icon) {
        return selectedItem.icon;
      }
    }
    // Otherwise use the provided compactIcon input
    return this.compactIcon();
  });

  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const allItems = this.getAllItems();

    if (!query) {
      return allItems;
    }

    return allItems.filter(
      item =>
        item.type !== 'header' &&
        item.type !== 'divider' &&
        item.label.toLowerCase().includes(query),
    );
  });

  // Get selectable items (for keyboard navigation)
  selectableItems = computed(() => {
    return this.filteredItems().filter(
      item => item.type !== 'header' && item.type !== 'divider' && !item.disabled,
    );
  });

  // Get active item index
  activeItemIndex = computed(() => {
    const activeId = this.activeDescendant();
    if (!activeId) return -1;
    const selectable = this.selectableItems();
    return selectable.findIndex(item => this.getItemId(item) === activeId);
  });

  constructor(private elementRef: ElementRef) {
    super();

    // Listen for other dropdowns opening (custom event on document)
    this.dropdownOpenListener = this.renderer.listen(
      'document',
      'dropdown:open',
      (event: Event) => {
        // If another dropdown opened and this one is open, close it
        const customEvent = event as CustomEvent;
        if (customEvent.detail?.element !== this.elementRef.nativeElement && this.isExpanded()) {
          this.closeDropdown();
        }
      },
    );

    // Effect to update field value when selection changes
    effect(() => {
      const values = Array.from(this.selectedValues());
      if (this.mode() === 'single') {
        this.value = values[0] || '';
      } else {
        this.value = values;
      }
      this.onChange(this.value);
    });

    // Effect to check if panel should flip to top when expanded
    effect(() => {
      if (this.isExpanded()) {
        setTimeout(() => this.checkAndFlipPanel(), 0);
      }
    });

    // Effect to scroll to active item
    effect(() => {
      if (this.isExpanded() && this.activeDescendant()) {
        setTimeout(() => this.scrollToActiveItem(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    // Setup resize observer for trigger element
    if (this.triggerElement?.nativeElement) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isExpanded()) {
          this.checkAndFlipPanel();
        }
      });
      this.resizeObserver.observe(this.triggerElement.nativeElement);
    }

    // Setup scroll listener
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      if (this.isExpanded()) {
        this.checkAndFlipPanel();
      }
    });
  }

  override ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.scrollListener) {
      this.scrollListener();
    }
    if (this.dropdownOpenListener) {
      this.dropdownOpenListener();
    }
    if (this.typeaheadTimeout) {
      clearTimeout(this.typeaheadTimeout);
    }
    this.removePortal();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isExpanded()) {
      return;
    }

    const target = event.target as HTMLElement;
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  toggleDropdown(): void {
    if (this.disabled()) {
      return;
    }

    if (this.isExpanded()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    // Emit custom event to close other dropdowns (like native select does)
    const event = new CustomEvent('dropdown:open', {
      bubbles: true,
      detail: { element: this.elementRef.nativeElement },
    });
    this.document.dispatchEvent(event);

    this.isExpanded.set(true);
    // Set initial active descendant to first selectable item or selected item
    const selectable = this.selectableItems();
    if (selectable.length > 0) {
      const selected = Array.from(this.selectedValues());
      const selectedItem =
        selected.length > 0 ? selectable.find(item => selected.includes(item.value)) : null;
      this.activeDescendant.set(
        selectedItem ? this.getItemId(selectedItem) : this.getItemId(selectable[0]),
      );
    }
    this.opened.emit();
  }

  closeDropdown(): void {
    this.isExpanded.set(false);
    this.searchQuery.set('');
    this.activeDescendant.set(null);
    this.typeaheadString = '';
    this.closed.emit();
  }

  selectItem(item: DropdownItem, event?: Event): void {
    if (item.disabled || item.type === 'header' || item.type === 'divider') {
      return;
    }

    // Prevent event from bubbling up
    if (event) {
      event.stopPropagation();
    }

    const newSelected = new Set(this.selectedValues());

    if (this.mode() === 'single') {
      newSelected.clear();
      newSelected.add(item.value);
      this.selectedValues.set(newSelected);
      // Update value immediately for inline edit mode
      const newValue = item.value;
      this.value = newValue;
      this.onChange(newValue);
      this.selectionChange.emit(Array.from(newSelected));
      // Close dropdown after a small delay to ensure the click is processed
      setTimeout(() => {
        this.closeDropdown();
        // If in inline edit mode, save changes and exit edit mode
        if (this.inlineEdit() && this.isEditMode()) {
          this.saveChanges();
        }
      }, 0);
    } else {
      if (newSelected.has(item.value)) {
        newSelected.delete(item.value);
      } else {
        newSelected.add(item.value);
      }
      this.selectedValues.set(newSelected);
      this.selectionChange.emit(Array.from(newSelected));
      // Keep dropdown open for multi-select
    }
  }

  isItemSelected(item: DropdownItem): boolean {
    return this.selectedValues().has(item.value);
  }

  clearSelection(): void {
    this.selectedValues.set(new Set());
    this.value = this.mode() === 'single' ? '' : [];
    this.onChange(this.value);
    this.selectionChange.emit([]);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  private getAllItems(): DropdownItem[] {
    if (this.groups().length > 0) {
      return this.groups().flatMap(group => {
        const items: DropdownItem[] = [];
        if (group.header) {
          items.push({
            value: `header-${group.header}`,
            label: group.header,
            type: 'header',
          });
        }
        items.push(...group.items);
        return items;
      });
    }
    return this.items();
  }

  private getSelectedItems(): DropdownItem[] {
    const allItems = this.getAllItems();
    return allItems.filter(item => this.selectedValues().has(item.value));
  }

  // Override ControlValueAccessor methods
  override writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.selectedValues.set(new Set());
      return;
    }

    const values = Array.isArray(value) ? value : [value];
    this.selectedValues.set(new Set(values));
    super.writeValue(value);
  }

  /**
   * Convert DropdownItem to Node format
   */
  itemToNode(item: DropdownItem): Node<DropdownItem> {
    return {
      id: item.value,
      label: item.label,
      icon: item.icon,
      disabled: item.disabled || false,
      selected: this.isItemSelected(item),
      data: item,
      onClick: () => this.selectItem(item),
    };
  }

  /**
   * Check if item should show checkbox (for multi-select mode)
   */
  shouldShowCheckbox(item: DropdownItem): boolean {
    return this.mode() === 'multi' && item.type !== 'header' && item.type !== 'divider';
  }

  /**
   * Check if item should show checkmark (for single-select mode)
   */
  shouldShowCheckmark(item: DropdownItem): boolean {
    return (
      this.mode() === 'single' &&
      this.isItemSelected(item) &&
      item.type !== 'header' &&
      item.type !== 'divider'
    );
  }

  /**
   * Get unique ID for dropdown item
   */
  getItemId(item: DropdownItem): string {
    return `dropdown-option-${this.id() || 'default'}-${item.value}`;
  }

  /**
   * Get listbox ID
   */
  getListboxId(): string {
    return `dropdown-listbox-${this.id() || 'default'}`;
  }

  /**
   * Check if item is active (for aria-activedescendant)
   */
  isItemActive(item: DropdownItem): boolean {
    return this.activeDescendant() === this.getItemId(item);
  }

  /**
   * Check if panel should flip to top (like native select does automatically)
   */
  private checkAndFlipPanel(): void {
    if (!this.triggerElement?.nativeElement || !this.dropdownPanel?.nativeElement) {
      return;
    }

    const trigger = this.triggerElement.nativeElement;
    const panel = this.dropdownPanel.nativeElement;
    const triggerRect = trigger.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Estimate panel height
    const maxHeight = parseInt(this.maxHeight()) || 300;
    const panelHeight = Math.min(panel.scrollHeight || maxHeight, maxHeight);

    // Check available space (like native select does)
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    // Flip to top if not enough space below (native select behavior)
    const shouldFlip = spaceBelow < panelHeight && spaceAbove > spaceBelow;

    // Toggle CSS class for flip (CSS handles the positioning)
    if (shouldFlip) {
      this.renderer.addClass(panel, 'dropdown-panel--top');
    } else {
      this.renderer.removeClass(panel, 'dropdown-panel--top');
    }
  }

  /**
   * Scroll to active item in listbox
   */
  private scrollToActiveItem(): void {
    if (!this.activeDescendant() || !this.dropdownPanel?.nativeElement) {
      return;
    }

    const activeElement = this.document.getElementById(this.activeDescendant()!);
    if (activeElement) {
      activeElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }

  /**
   * Handle keyboard navigation
   */
  override onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const selectable = this.selectableItems();
    if (selectable.length === 0) {
      return;
    }

    let currentIndex = this.activeItemIndex();
    if (currentIndex === -1) {
      currentIndex = 0;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        if (!this.isExpanded()) {
          this.openDropdown();
        } else {
          const nextIndex = currentIndex < selectable.length - 1 ? currentIndex + 1 : currentIndex;
          this.activeDescendant.set(this.getItemId(selectable[nextIndex]));
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        if (!this.isExpanded()) {
          this.openDropdown();
          // Set to last item when opening with Up Arrow
          this.activeDescendant.set(this.getItemId(selectable[selectable.length - 1]));
        } else {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          this.activeDescendant.set(this.getItemId(selectable[prevIndex]));
        }
        break;

      case 'Home':
        if (this.isExpanded()) {
          event.preventDefault();
          event.stopPropagation();
          this.activeDescendant.set(this.getItemId(selectable[0]));
        }
        break;

      case 'End':
        if (this.isExpanded()) {
          event.preventDefault();
          event.stopPropagation();
          this.activeDescendant.set(this.getItemId(selectable[selectable.length - 1]));
        }
        break;

      case 'PageUp':
        if (this.isExpanded()) {
          event.preventDefault();
          event.stopPropagation();
          const pageSize = 10;
          const newIndex = Math.max(0, currentIndex - pageSize);
          this.activeDescendant.set(this.getItemId(selectable[newIndex]));
        }
        break;

      case 'PageDown':
        if (this.isExpanded()) {
          event.preventDefault();
          event.stopPropagation();
          const pageSize = 10;
          const newIndex = Math.min(selectable.length - 1, currentIndex + pageSize);
          this.activeDescendant.set(this.getItemId(selectable[newIndex]));
        }
        break;

      case 'Enter':
      case ' ':
        if (this.isExpanded() && currentIndex >= 0) {
          event.preventDefault();
          event.stopPropagation();
          const activeItem = selectable[currentIndex];
          if (activeItem) {
            this.selectItem(activeItem, event);
          }
        } else if (!this.isExpanded()) {
          event.preventDefault();
          event.stopPropagation();
          this.openDropdown();
        }
        break;

      case 'Escape':
        if (this.isExpanded()) {
          event.preventDefault();
          event.stopPropagation();
          this.closeDropdown();
          // Return focus to trigger
          if (this.triggerElement?.nativeElement) {
            this.triggerElement.nativeElement.focus();
          }
        }
        break;

      case 'Tab':
        if (this.isExpanded() && currentIndex >= 0) {
          // Select active item before tabbing away
          const activeItem = selectable[currentIndex];
          if (activeItem) {
            this.selectItem(activeItem, event);
          }
        }
        // Allow default tab behavior
        break;

      default:
        // Typeahead: handle printable characters
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          if (!this.isExpanded()) {
            this.openDropdown();
          }
          this.handleTypeahead(event.key);
        }
        break;
    }
  }

  /**
   * Handle typeahead search (typing to find options)
   */
  private handleTypeahead(key: string): void {
    // Clear previous timeout
    if (this.typeaheadTimeout) {
      clearTimeout(this.typeaheadTimeout);
    }

    // Append to typeahead string
    this.typeaheadString += key.toLowerCase();

    // Find matching item
    const selectable = this.selectableItems();
    const currentIndex = this.activeItemIndex();
    const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;

    // Search from current position
    let foundIndex = -1;
    for (let i = 0; i < selectable.length; i++) {
      const index = (startIndex + i) % selectable.length;
      const item = selectable[index];
      if (item.label.toLowerCase().startsWith(this.typeaheadString)) {
        foundIndex = index;
        break;
      }
    }

    // If not found, search from beginning
    if (foundIndex === -1) {
      for (let i = 0; i < selectable.length; i++) {
        const item = selectable[i];
        if (item.label.toLowerCase().startsWith(this.typeaheadString)) {
          foundIndex = i;
          break;
        }
      }
    }

    if (foundIndex >= 0) {
      this.activeDescendant.set(this.getItemId(selectable[foundIndex]));
    }

    // Clear typeahead string after delay
    this.typeaheadTimeout = window.setTimeout(() => {
      this.typeaheadString = '';
    }, 1000);
  }

  /**
   * Remove portal container (if using portal)
   */
  private removePortal(): void {
    if (this.portalContainer && this.portalContainer.parentNode) {
      this.renderer.removeChild(this.document.body, this.portalContainer);
      this.portalContainer = null;
    }
  }
}
