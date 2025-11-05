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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from '../field/field.component';
import { TextComponent } from '../text/text.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '@shared/components/icon/icon.component';
import { ActionButtonComponent } from '../action-button.component';
import { NodeComponent, Node } from '../../node/node.component';

export interface DropdownItem {
  value: string | number;
  label: string;
  type?: 'header' | 'single' | 'multi' | 'divider';
  icon?: string; // SVG string or icon name
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
    TextComponent,
    CheckboxComponent,
    FormsModule,
    IconComponent,
    ActionButtonComponent,
    NodeComponent,
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
export class DropdownComponent extends FieldComponent {
  items = input<DropdownItem[]>([]);
  groups = input<DropdownGroup[]>([]);
  mode = input<DropdownMode>('single');
  searchable = input<boolean>(false);
  clearable = input<boolean>(false);
  maxHeight = input<string>('300px');

  selectionChange = output<any>();
  opened = output<void>();
  closed = output<void>();

  isExpanded = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedValues = signal<Set<string | number>>(new Set());

  @ViewChild('dropdownPanel') dropdownPanel?: ElementRef;

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

  constructor(private elementRef: ElementRef) {
    super();

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
    this.isExpanded.set(true);
    this.opened.emit();
  }

  closeDropdown(): void {
    this.isExpanded.set(false);
    this.searchQuery.set('');
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
      this.selectionChange.emit(Array.from(newSelected));
      // Close dropdown after a small delay to ensure the click is processed
      setTimeout(() => this.closeDropdown(), 0);
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
}
